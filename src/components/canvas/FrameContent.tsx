import { useRef, useState, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { TransformComponent, useTransformContext } from 'react-zoom-pan-pinch';
import { canvasStore, addShape } from '@/stores/canvas';
import { toolStore } from '@/stores/tools';
import { selectionStore, selectShape, clearSelection } from '@/stores/selection';
import { hoverStore } from '@/stores/hover';
import { setMousePosition } from '@/stores/mouse';
import { ShapeRenderer } from './ShapeRenderer';
import { InteractiveShape } from './InteractiveShape';
import { SelectionOverlay } from './SelectionOverlay';
import { FrameSelectionOverlay } from './FrameSelectionOverlay';
import { CanvasControls } from './CanvasControls';
import { DebugInfo } from './DebugInfo';
import { useCanvasShortcuts } from '@/hooks/useCanvasShortcuts';
import type { Shape } from '@/types/canvas';

interface FrameContentProps {
  isSpacePanning: boolean;
  setIsSpacePanning: (active: boolean) => void;
}

export function FrameContent({ isSpacePanning, setIsSpacePanning }: FrameContentProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);

  const { shapes, viewBox, frames } = useStore(canvasStore);
  const { activeTool, toolSettings } = useStore(toolStore);
  const { selectedIds } = useStore(selectionStore);
  const { hoveredId } = useStore(hoverStore);
  const { transformState } = useTransformContext();

  const scale = transformState.scale;

  // Initialize canvas keyboard shortcuts (now inside TransformWrapper)
  useCanvasShortcuts({
    onTogglePanMode: (active: boolean) => setIsSpacePanning(active)
  });

  const getMousePosition = useCallback((event: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    // Get the SVG element's bounding rect
    const svgRect = svgRef.current.getBoundingClientRect();
    
    // Convert screen coordinates to SVG coordinates accounting for zoom and pan
    const x = (event.clientX - svgRect.left) / scale;
    const y = (event.clientY - svgRect.top) / scale;

    return { x, y };
  }, [scale]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    const position = getMousePosition(event);
    
    // Handle panning modes - let react-zoom-pan-pinch handle these
    if (isSpacePanning || event.button === 1 || event.altKey) {
      return;
    }
    
    // For select tool, only handle background clicks (shape clicks are handled by InteractiveShape)
    if (activeTool === 'select') {
      // Only clear selection on background clicks
      clearSelection();
      return;
    }
    
    // Prevent default to stop transform wrapper from handling drawing interactions
    event.stopPropagation();

    if (['rectangle', 'circle', 'line'].includes(activeTool)) {
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
  }, [activeTool, toolSettings, getMousePosition, isSpacePanning]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    // Always update mouse position for debug info
    const position = getMousePosition(event);
    setMousePosition(position.x, position.y, event.clientX, event.clientY);
    
    if (!isDrawing || !startPoint || !currentShape) return;
    
    // Stop propagation to prevent transform wrapper interference
    event.stopPropagation();
    
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

  // Dynamic cursor based on current state
  const getCursor = () => {
    if (isSpacePanning) return 'cursor-grab';
    if (activeTool === 'select') return 'cursor-default';
    return 'cursor-crosshair';
  };

  return (
    <>
      <TransformComponent
        wrapperClass="w-full! h-full! bg-muted"
        // contentClass="w-full! h-full!"
      >
        <svg
          ref={svgRef}
          className={`w-[512px] h-[512px] ${getCursor()}`}
          viewBox="0 0 512 512"
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
            width={viewBox.width / scale}
            height={viewBox.height / scale}
            fill="url(#grid)"
          />

          {/* Frames */}
          {frames.map(frame => (
            <rect
              key={frame.id}
              x={frame.x}
              y={frame.y}
              width={frame.width}
              height={frame.height}
              fill={frame.backgroundColor || '#ffffff'}
              stroke="none"
              strokeWidth="0"
            />
          ))}

          {/* Rendered shapes */}
          {shapes.map(shape => (
            <InteractiveShape
              key={shape.id}
              shape={shape}
              isSelected={selectedIds.includes(shape.id)}
              isHovered={hoveredId === shape.id}
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

          {/* Selection overlays */}
          <SelectionOverlay />
          <FrameSelectionOverlay />
        </svg>
      </TransformComponent>
      
      {/* Debug info panel */}
      <DebugInfo />
      
      {/* Enhanced canvas controls - now inside TransformWrapper */}
      <CanvasControls />
    </>
  );
}