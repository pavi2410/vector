import { useRef, useState, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { canvasStore, setZoom, setViewBox, addShape } from '@/stores/canvas';
import { toolStore } from '@/stores/tools';
import { selectionStore, selectShape, clearSelection } from '@/stores/selection';
import { ShapeRenderer } from './ShapeRenderer';
import { SelectionOverlay } from './SelectionOverlay';
import type { Shape } from '@/types/canvas';

export function SVGCanvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);

  const { shapes, viewBox, zoom, artboards } = useStore(canvasStore);
  const { activeTool, toolSettings } = useStore(toolStore);
  const { selectedIds } = useStore(selectionStore);

  const getMousePosition = useCallback((event: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / zoom + viewBox.x;
    const y = (event.clientY - rect.top) / zoom + viewBox.y;
    
    return { x, y };
  }, [zoom, viewBox]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    const position = getMousePosition(event);
    
    if (event.button === 1 || (event.button === 0 && event.altKey)) {
      setIsPanning(true);
      setStartPoint(position);
      return;
    }

    if (activeTool === 'select') {
      const clickedShape = shapes.find(shape => 
        position.x >= shape.x && 
        position.x <= shape.x + shape.width &&
        position.y >= shape.y && 
        position.y <= shape.y + shape.height
      );
      
      if (clickedShape) {
        selectShape(clickedShape.id, event.shiftKey);
      } else {
        clearSelection();
      }
    } else if (['rectangle', 'circle', 'line'].includes(activeTool)) {
      setIsDrawing(true);
      setStartPoint(position);
      
      const newShape: Shape = {
        id: `shape-${Date.now()}`,
        type: activeTool as 'rectangle' | 'circle' | 'line',
        x: position.x,
        y: position.y,
        width: 0,
        height: 0,
        fill: toolSettings.fill,
        stroke: toolSettings.stroke,
        strokeWidth: toolSettings.strokeWidth,
        opacity: toolSettings.opacity
      };
      
      setCurrentShape(newShape);
    }
  }, [activeTool, shapes, toolSettings, getMousePosition]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const position = getMousePosition(event);
    
    if (isPanning && startPoint) {
      const dx = startPoint.x - position.x;
      const dy = startPoint.y - position.y;
      setViewBox(viewBox.x + dx, viewBox.y + dy, viewBox.width, viewBox.height);
    } else if (isDrawing && startPoint && currentShape) {
      const width = Math.abs(position.x - startPoint.x);
      const height = Math.abs(position.y - startPoint.y);
      const x = Math.min(startPoint.x, position.x);
      const y = Math.min(startPoint.y, position.y);
      
      setCurrentShape({
        ...currentShape,
        x,
        y,
        width,
        height
      });
    }
  }, [isPanning, isDrawing, startPoint, currentShape, viewBox, getMousePosition]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      setStartPoint(null);
    } else if (isDrawing && currentShape) {
      if (currentShape.width > 5 && currentShape.height > 5) {
        addShape(currentShape);
        selectShape(currentShape.id);
      }
      setIsDrawing(false);
      setCurrentShape(null);
      setStartPoint(null);
    }
  }, [isPanning, isDrawing, currentShape]);

  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    setZoom(zoom * delta);
  }, [zoom]);

  return (
    <div className="w-full h-full overflow-hidden relative bg-gray-50">
      <svg
        ref={svgRef}
        className="w-full h-full cursor-crosshair"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width / zoom} ${viewBox.height / zoom}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs>
          {/* Grid pattern */}
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        {/* Grid background */}
        <rect
          x={viewBox.x}
          y={viewBox.y}
          width={viewBox.width / zoom}
          height={viewBox.height / zoom}
          fill="url(#grid)"
        />

        {/* Artboards */}
        {artboards.map(artboard => (
          <rect
            key={artboard.id}
            x={artboard.x}
            y={artboard.y}
            width={artboard.width}
            height={artboard.height}
            fill={artboard.backgroundColor || '#ffffff'}
            stroke="#d1d5db"
            strokeWidth="1"
          />
        ))}

        {/* Rendered shapes */}
        {shapes.map(shape => (
          <ShapeRenderer
            key={shape.id}
            shape={shape}
            isSelected={selectedIds.includes(shape.id)}
          />
        ))}

        {/* Current drawing shape */}
        {currentShape && (
          <ShapeRenderer
            shape={currentShape}
            isSelected={false}
            isPreview={true}
          />
        )}

        {/* Selection overlay */}
        <SelectionOverlay />
      </svg>
      
      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-background border border-border rounded-md p-2">
        <button
          onClick={() => setZoom(zoom * 0.9)}
          className="px-2 py-1 text-xs hover:bg-accent rounded"
        >
          -
        </button>
        <span className="text-xs min-w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(zoom * 1.1)}
          className="px-2 py-1 text-xs hover:bg-accent rounded"
        >
          +
        </button>
      </div>
    </div>
  );
}