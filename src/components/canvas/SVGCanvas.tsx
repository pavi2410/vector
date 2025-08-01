import { useRef, useState, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { canvasStore, setTransform, addShape } from '@/stores/canvas';
import { toolStore } from '@/stores/tools';
import { selectionStore, selectShape, clearSelection } from '@/stores/selection';
import { ShapeRenderer } from './ShapeRenderer';
import { SelectionOverlay } from './SelectionOverlay';
import { CanvasControls } from './CanvasControls';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import type { Shape } from '@/types/canvas';

export function SVGCanvas() {
  const svgRef = useRef<SVGSVGElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const [isSpacePanning, setIsSpacePanning] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);

  const { shapes, viewBox, zoom, artboards } = useStore(canvasStore);
  const { activeTool, toolSettings } = useStore(toolStore);
  const { selectedIds } = useStore(selectionStore);

  // Initialize keyboard shortcuts with transform ref
  useKeyboardShortcuts({
    transformRef,
    onTogglePanMode: (active: boolean) => setIsSpacePanning(active)
  });

  const getMousePosition = useCallback((event: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const rect = svgRef.current.getBoundingClientRect();
    
    // Convert screen coordinates to SVG coordinates using SVG's built-in methods
    const point = svgRef.current.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    
    // Transform point through the SVG's transformation matrix
    const svgPoint = point.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    
    return { x: svgPoint.x, y: svgPoint.y };
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    const position = getMousePosition(event);
    
    // Handle panning modes - let react-zoom-pan-pinch handle these
    if (isSpacePanning || event.button === 1 || event.altKey) {
      return;
    }
    
    // Prevent default to stop transform wrapper from handling drawing interactions
    if (activeTool !== 'select') {
      event.stopPropagation();
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
  }, [activeTool, shapes, toolSettings, getMousePosition, isSpacePanning]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDrawing || !startPoint || !currentShape) return;
    
    // Stop propagation to prevent transform wrapper interference
    event.stopPropagation();
    
    const position = getMousePosition(event);
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
  }, [isDrawing, startPoint, currentShape, getMousePosition]);

  const handleMouseUp = useCallback(() => {
    if (isDrawing && currentShape) {
      if (currentShape.width > 5 && currentShape.height > 5) {
        addShape(currentShape);
        selectShape(currentShape.id);
      }
      setIsDrawing(false);
      setCurrentShape(null);
      setStartPoint(null);
    }
  }, [isDrawing, currentShape]);

  // Transform change handler
  const handleTransformChange = useCallback((ref: ReactZoomPanPinchRef) => {
    const { state } = ref;
    setTransform(state.scale, state.positionX, state.positionY);
  }, []);

  // Dynamic cursor based on current state
  const getCursor = () => {
    if (isSpacePanning) return 'cursor-grab';
    if (activeTool === 'select') return 'cursor-default';
    return 'cursor-crosshair';
  };

  return (
    <div className="w-full h-full overflow-hidden relative bg-gray-50">
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.1}
        maxScale={10}
        limitToBounds={false}
        centerOnInit={false}
        wheel={{ 
          step: 0.1,
          wheelDisabled: false,
          touchPadDisabled: false
        }}
        pinch={{ 
          step: 5,
          disabled: false 
        }}
        doubleClick={{ disabled: true }}
        panning={{ 
          disabled: activeTool !== 'select' && !isSpacePanning,
          velocityDisabled: false,
          lockAxisX: false,
          lockAxisY: false
        }}
        onTransformed={handleTransformChange}
      >
        <TransformComponent
          wrapperClass="w-full h-full"
          contentClass="w-full h-full"
        >
          <svg
            ref={svgRef}
            className={`w-full h-full ${getCursor()}`}
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid meet"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
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
        </TransformComponent>
      </TransformWrapper>
      
      {/* Enhanced canvas controls */}
      <CanvasControls transformRef={transformRef} />
    </div>
  );
}