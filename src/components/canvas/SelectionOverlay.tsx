import { useStore } from '@nanostores/react';
import { canvasStore, updateShape } from '@/stores/canvas';
import { editorStore } from '@/stores/editorState';
import { useTransformContext } from 'react-zoom-pan-pinch';
import { useState, useCallback, useEffect } from 'react';

type Shape = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

function calculateBoundingBox(shapes: Shape[]) {
  const minX = Math.min(...shapes.map(s => s.x));
  const minY = Math.min(...shapes.map(s => s.y));
  const maxX = Math.max(...shapes.map(s => s.x + s.width));
  const maxY = Math.max(...shapes.map(s => s.y + s.height));
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

function calculateResizeTransform(
  resizeHandle: string,
  deltaX: number,
  deltaY: number,
  originalBounds: { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number }
) {
  const { width: originalWidth, height: originalHeight } = originalBounds;
  
  let scaleX = 1;
  let scaleY = 1;
  let offsetX = 0;
  let offsetY = 0;

  // Calculate scale and offset based on resize handle
  switch (resizeHandle) {
    case 'nw':
      // Diagonal handle - maintain aspect ratio
      const nwScale = Math.max(
        (originalWidth - deltaX) / originalWidth,
        (originalHeight - deltaY) / originalHeight
      );
      scaleX = nwScale;
      scaleY = nwScale;
      offsetX = originalWidth - (originalWidth * nwScale);
      offsetY = originalHeight - (originalHeight * nwScale);
      break;
    case 'n':
      scaleY = (originalHeight - deltaY) / originalHeight;
      offsetY = deltaY;
      break;
    case 'ne':
      // Diagonal handle - maintain aspect ratio
      const neScale = Math.max(
        (originalWidth + deltaX) / originalWidth,
        (originalHeight - deltaY) / originalHeight
      );
      scaleX = neScale;
      scaleY = neScale;
      offsetY = originalHeight - (originalHeight * neScale);
      break;
    case 'e':
      scaleX = (originalWidth + deltaX) / originalWidth;
      break;
    case 'se':
      // Diagonal handle - maintain aspect ratio
      const seScale = Math.max(
        (originalWidth + deltaX) / originalWidth,
        (originalHeight + deltaY) / originalHeight
      );
      scaleX = seScale;
      scaleY = seScale;
      break;
    case 's':
      scaleY = (originalHeight + deltaY) / originalHeight;
      break;
    case 'sw':
      // Diagonal handle - maintain aspect ratio
      const swScale = Math.max(
        (originalWidth - deltaX) / originalWidth,
        (originalHeight + deltaY) / originalHeight
      );
      scaleX = swScale;
      scaleY = swScale;
      offsetX = originalWidth - (originalWidth * swScale);
      break;
    case 'w':
      scaleX = (originalWidth - deltaX) / originalWidth;
      offsetX = deltaX;
      break;
  }

  // Ensure minimum scale
  const minScale = 0.1;
  scaleX = Math.max(minScale, Math.abs(scaleX));
  scaleY = Math.max(minScale, Math.abs(scaleY));

  return { scaleX, scaleY, offsetX, offsetY };
}

function generateResizeHandles(minX: number, minY: number, maxX: number, maxY: number, handleSize: number) {
  const width = maxX - minX;
  const height = maxY - minY;
  
  return [
    { id: 'nw', x: minX - handleSize / 2, y: minY - handleSize / 2, cursor: 'nw-resize' },
    { id: 'n', x: minX + width / 2 - handleSize / 2, y: minY - handleSize / 2, cursor: 'n-resize' },
    { id: 'ne', x: maxX - handleSize / 2, y: minY - handleSize / 2, cursor: 'ne-resize' },
    { id: 'e', x: maxX - handleSize / 2, y: minY + height / 2 - handleSize / 2, cursor: 'e-resize' },
    { id: 'se', x: maxX - handleSize / 2, y: maxY - handleSize / 2, cursor: 'se-resize' },
    { id: 's', x: minX + width / 2 - handleSize / 2, y: maxY - handleSize / 2, cursor: 's-resize' },
    { id: 'sw', x: minX - handleSize / 2, y: maxY - handleSize / 2, cursor: 'sw-resize' },
    { id: 'w', x: minX - handleSize / 2, y: minY + height / 2 - handleSize / 2, cursor: 'w-resize' },
  ];
}

export function SelectionOverlay() {
  const { frame } = useStore(canvasStore);
  const { shapes } = frame;
  const { selectedIds, editingTextId } = useStore(editorStore);
  const { state: transformState } = useTransformContext();
  
  const [mouseState, setMouseState] = useState({
    isDragging: false,
    isMoving: false,
    dragStart: null as { x: number; y: number } | null,
    resizeHandle: null as string | null
  });
  const [initialShapes, setInitialShapes] = useState<Array<{ id: string; x: number; y: number; width: number; height: number }>>([]);

  const scale = transformState.scale;
  const selectedShapes = shapes.filter(shape => selectedIds.includes(shape.id));

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handleId: string) => {
    if (selectedShapes.length === 0) return;
    e.stopPropagation();
    setMouseState({
      isDragging: true,
      isMoving: false,
      resizeHandle: handleId,
      dragStart: { x: e.clientX, y: e.clientY }
    });
    setInitialShapes(selectedShapes.map(shape => ({
      id: shape.id,
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height
    })));
  }, [selectedShapes]);

  const handleMoveMouseDown = useCallback((e: React.MouseEvent) => {
    if (selectedShapes.length === 0) return;
    e.stopPropagation();
    setMouseState({
      isDragging: false,
      isMoving: true,
      resizeHandle: null,
      dragStart: { x: e.clientX, y: e.clientY }
    });
    setInitialShapes(selectedShapes.map(shape => ({
      id: shape.id,
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height
    })));
  }, [selectedShapes]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if ((!mouseState.isDragging && !mouseState.isMoving) || !mouseState.dragStart || initialShapes.length === 0) return;

    const deltaX = (e.clientX - mouseState.dragStart.x) / scale;
    const deltaY = (e.clientY - mouseState.dragStart.y) / scale;

    if (mouseState.isMoving) {
      // Handle move operation
      initialShapes.forEach(initialShape => {
        updateShape(initialShape.id, {
          x: initialShape.x + deltaX,
          y: initialShape.y + deltaY
        });
      });
    } else if (mouseState.isDragging && mouseState.resizeHandle) {
      // Handle resize operation
      const originalBounds = calculateBoundingBox(initialShapes);
      const { scaleX, scaleY, offsetX, offsetY } = calculateResizeTransform(
        mouseState.resizeHandle,
        deltaX,
        deltaY,
        originalBounds
      );

      // Apply transformations to all selected shapes
      initialShapes.forEach(initialShape => {
        const relativeX = initialShape.x - originalBounds.minX;
        const relativeY = initialShape.y - originalBounds.minY;

        const newX = originalBounds.minX + offsetX + relativeX * scaleX;
        const newY = originalBounds.minY + offsetY + relativeY * scaleY;
        const newWidth = Math.max(5, initialShape.width * scaleX);
        const newHeight = Math.max(5, initialShape.height * scaleY);

        updateShape(initialShape.id, {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight
        });
      });
    }
  }, [mouseState.isDragging, mouseState.isMoving, mouseState.dragStart, mouseState.resizeHandle, initialShapes, scale]);

  const handleMouseUp = useCallback(() => {
    setMouseState({
      isDragging: false,
      isMoving: false,
      resizeHandle: null,
      dragStart: null
    });
    setInitialShapes([]);
  }, []);


  // Add global event listeners when dragging or moving
  useEffect(() => {
    if (mouseState.isDragging || mouseState.isMoving) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [mouseState.isDragging, mouseState.isMoving, handleMouseMove, handleMouseUp]);

  // Early return after all hooks are called
  if (selectedIds.length === 0 || selectedShapes.length === 0) return null;

  // Hide selection overlay if any selected shape is being edited
  if (editingTextId && selectedIds.includes(editingTextId)) return null;

  // Calculate bounding box for all selected shapes
  const { minX, minY, maxX, maxY, width, height } = calculateBoundingBox(selectedShapes);

  const handleSize = 8 / scale; // Adjust handle size based on zoom level
  const handles = generateResizeHandles(minX, minY, maxX, maxY, handleSize);

  return (
    <g className="selection-overlay">
      {/* Selection rectangle */}
      <rect
        x={minX}
        y={minY}
        width={width}
        height={height}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={1 / scale}
        strokeDasharray={`${4 / scale} ${4 / scale}`}
        style={{ cursor: mouseState.isMoving ? 'grabbing' : 'grab' }}
        onMouseDown={handleMoveMouseDown}
      />


      {/* Transform handles */}
      {handles.map((handle) => (
        <rect
          key={handle.id}
          x={handle.x}
          y={handle.y}
          width={handleSize}
          height={handleSize}
          fill="#3b82f6"
          stroke="#ffffff"
          strokeWidth={1 / scale}
          style={{ cursor: handle.cursor }}
          className="hover:fill-blue-600"
          onMouseDown={(e) => handleResizeMouseDown(e, handle.id)}
        />
      ))}
    </g>
  );
}