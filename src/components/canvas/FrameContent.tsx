import { useRef, useState, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { TransformComponent, useTransformContext, useControls } from 'react-zoom-pan-pinch';
import { canvasStore, addShape } from '@/stores/canvas';
import { editorStore, selectShape, clearSelection } from '@/stores/editorState';
import { setMousePosition } from '@/stores/mouse';
import { debugStore } from '@/stores/debug';
import { projectSettingsStore } from '@/stores/project';
import { ShapeRenderer } from './ShapeRenderer';
import { InteractiveShape } from './InteractiveShape';
import { SelectionOverlay } from './SelectionOverlay';
import { FrameSelectionOverlay } from './FrameSelectionOverlay';
import { CanvasControls } from './CanvasControls';
import { DebugInfo } from './DebugInfo';
import { useCanvasShortcuts } from '@/hooks/useCanvasShortcuts';
import { useOnEvent } from '@/utils/eventBus';
import type { Shape } from '@/types/canvas';

interface FrameContentProps {
  isSpacePanning: boolean;
  setIsSpacePanning: (active: boolean) => void;
  onWrapperClick: (event: React.MouseEvent) => void;
}

export function FrameContent({ isSpacePanning, setIsSpacePanning, onWrapperClick }: FrameContentProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);

  const { frame } = useStore(canvasStore);
  const { shapes } = frame;
  const { activeTool, toolSettings, selectedIds, hoveredId } = useStore(editorStore);
  const { showDebugInfo } = useStore(debugStore);
  const { gridSize } = useStore(projectSettingsStore);
  const { transformState } = useTransformContext();
  const { zoomIn, zoomOut, centerView, instance } = useControls();

  const scale = transformState.scale;

  // Initialize canvas keyboard shortcuts (now inside TransformWrapper)
  useCanvasShortcuts({
    onTogglePanMode: (active: boolean) => setIsSpacePanning(active)
  });

  // Listen to zoom events from ViewMenu
  useOnEvent('zoom:in', () => zoomIn(0.2), [zoomIn]);
  useOnEvent('zoom:out', () => zoomOut(0.2), [zoomOut]);
  useOnEvent('zoom:actual', () => centerView(1), [centerView]);
  useOnEvent('canvas:center', () => centerView(), [centerView]);
  
  useOnEvent('zoom:fit', () => {
    const { frame } = canvasStore.get();
    const padding = 50;
    const boundsWidth = frame.width + padding * 2;
    const boundsHeight = frame.height + padding * 2;

    const wrapper = instance.wrapperComponent?.getBoundingClientRect();
    if (!wrapper) return;

    // Calculate scale to fit frame
    const containerWidth = wrapper.width;
    const containerHeight = wrapper.height;
    const scaleX = containerWidth / boundsWidth;
    const scaleY = containerHeight / boundsHeight;
    const newScale = Math.min(scaleX, scaleY, 1);

    // Center the frame
    centerView(1 / newScale);
  }, [centerView, instance]);

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
    } else if (activeTool === 'text') {
      // Text tool - create immediately on click
      const fontSize = toolSettings.fontSize || 16;
      const textWidth = 100; // Default width for text bounding box
      const textHeight = fontSize * 1.2; // Height based on font size
      
      const newShape: Shape = {
        id: `shape-${Date.now()}`,
        type: 'text',
        x: position.x,
        y: position.y,
        width: textWidth,
        height: textHeight,
        fill: toolSettings.fill,
        stroke: toolSettings.stroke,
        strokeWidth: toolSettings.strokeWidth,
        opacity: toolSettings.opacity,
        text: 'Text',
        fontSize: fontSize,
        fontFamily: toolSettings.fontFamily || 'Inter, system-ui, sans-serif',
        fontWeight: toolSettings.fontWeight || 'normal',
        fontStyle: toolSettings.fontStyle || 'normal',
        textAlign: toolSettings.textAlign || 'start'
      };
      
      addShape(newShape);
      selectShape(newShape.id);
    }
  }, [activeTool, toolSettings, getMousePosition, isSpacePanning]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    // Always update mouse position for debug info
    const position = getMousePosition(event);
    setMousePosition(position.x, position.y, event.clientX, event.clientY);
    
    if (!isDrawing || !startPoint || !currentShape) return;
    
    // Stop propagation to prevent transform wrapper interference
    event.stopPropagation();
    
    // Handle line tool differently from rectangles and circles
    if (currentShape.type === 'line') {
      let endX = position.x;
      let endY = position.y;
      
      // Apply constraint for 45-degree angle snapping when Shift is held
      if (event.shiftKey) {
        const deltaX = position.x - startPoint.x;
        const deltaY = position.y - startPoint.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Calculate angle from start point to current position
        const angle = Math.atan2(deltaY, deltaX);
        
        // Snap to nearest 45-degree increment (8 directions)
        const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
        
        // Calculate snapped end position
        endX = startPoint.x + distance * Math.cos(snapAngle);
        endY = startPoint.y + distance * Math.sin(snapAngle);
      }
      
      // For lines, store the end point directly in width and height
      setCurrentShape({
        ...currentShape,
        x: startPoint.x,
        y: startPoint.y,
        width: endX - startPoint.x,
        height: endY - startPoint.y
      });
    } else {
      // Rectangle and circle logic
      let width = Math.abs(position.x - startPoint.x);
      let height = Math.abs(position.y - startPoint.y);
      
      // Apply constraint for perfect squares/circles when Shift is held
      if (event.shiftKey && (currentShape.type === 'rectangle' || currentShape.type === 'circle')) {
        const size = Math.max(width, height);
        width = size;
        height = size;
      }
      
      const x = Math.min(startPoint.x, position.x);
      const y = Math.min(startPoint.y, position.y);
      
      // Adjust position for perfect squares/circles to maintain center point
      let finalX = x;
      let finalY = y;
      
      if (event.shiftKey && (currentShape.type === 'rectangle' || currentShape.type === 'circle')) {
        const centerX = startPoint.x;
        const centerY = startPoint.y;
        const size = Math.max(width, height);
        
        if (position.x >= startPoint.x && position.y >= startPoint.y) {
          // Bottom-right quadrant
          finalX = centerX;
          finalY = centerY;
        } else if (position.x < startPoint.x && position.y >= startPoint.y) {
          // Bottom-left quadrant
          finalX = centerX - size;
          finalY = centerY;
        } else if (position.x < startPoint.x && position.y < startPoint.y) {
          // Top-left quadrant
          finalX = centerX - size;
          finalY = centerY - size;
        } else {
          // Top-right quadrant
          finalX = centerX;
          finalY = centerY - size;
        }
      }
      
      setCurrentShape({
        ...currentShape,
        x: finalX,
        y: finalY,
        width,
        height
      });
    }
  }, [isDrawing, startPoint, currentShape, getMousePosition]);

  const handleMouseUp = useCallback(() => {
    if (isDrawing && currentShape) {
      // For lines, check if there's any movement; for other shapes, check minimum size
      const shouldAdd = currentShape.type === 'line' 
        ? Math.abs(currentShape.width) > 2 || Math.abs(currentShape.height) > 2
        : currentShape.width > 5 && currentShape.height > 5;
        
      if (shouldAdd) {
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
        wrapperProps={{ onClick: onWrapperClick }}
        // contentClass="w-full! h-full!"
      >
        <svg
          ref={svgRef}
          className={`${getCursor()}`}
          width={frame.width}
          height={frame.height}
          viewBox={`0 0 ${frame.width} ${frame.height}`}
          preserveAspectRatio="xMidYMid meet"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <defs>
            {/* Grid pattern */}
            <pattern
              id="grid"
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>

          {/* Frame background */}
          <rect
            x={0}
            y={0}
            width={frame.width}
            height={frame.height}
            fill={frame.backgroundColor || '#ffffff'}
            stroke="none"
          />
          
          {/* Grid background */}
          <rect
            x={0}
            y={0}
            width={frame.width}
            height={frame.height}
            fill="url(#grid)"
          />

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
      {showDebugInfo && <DebugInfo />}
      
      {/* Enhanced canvas controls - now inside TransformWrapper */}
      <CanvasControls />
    </>
  );
}