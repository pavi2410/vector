import { useStore } from '@nanostores/react';
import { canvasStore, updateShape } from '@/stores/canvas';
import { selectionStore } from '@/stores/selection';
import { useTransformContext } from 'react-zoom-pan-pinch';
import { useState, useCallback, useEffect } from 'react';

export function SelectionOverlay() {
  const { shapes } = useStore(canvasStore);
  const { selectedIds } = useStore(selectionStore);
  const { transformState } = useTransformContext();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [initialShapes, setInitialShapes] = useState<Array<{ id: string; x: number; y: number; width: number; height: number }>>([]);

  const scale = transformState.scale;
  const selectedShapes = shapes.filter(shape => selectedIds.includes(shape.id));

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handleId: string) => {
    if (selectedShapes.length === 0) return;
    e.stopPropagation();
    setIsDragging(true);
    setResizeHandle(handleId);
    setDragStart({ x: e.clientX, y: e.clientY });
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
    setIsMoving(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialShapes(selectedShapes.map(shape => ({
      id: shape.id,
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height
    })));
  }, [selectedShapes]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if ((!isDragging && !isMoving) || !dragStart || initialShapes.length === 0) return;

    const deltaX = (e.clientX - dragStart.x) / scale;
    const deltaY = (e.clientY - dragStart.y) / scale;

    if (isMoving) {
      // Handle move operation
      initialShapes.forEach(initialShape => {
        updateShape(initialShape.id, {
          x: initialShape.x + deltaX,
          y: initialShape.y + deltaY
        });
      });
    } else if (isDragging && resizeHandle) {
      // Handle resize operation
      // Calculate original bounding box
      const originalMinX = Math.min(...initialShapes.map(s => s.x));
      const originalMinY = Math.min(...initialShapes.map(s => s.y));
      const originalMaxX = Math.max(...initialShapes.map(s => s.x + s.width));
      const originalMaxY = Math.max(...initialShapes.map(s => s.y + s.height));
      const originalWidth = originalMaxX - originalMinX;
      const originalHeight = originalMaxY - originalMinY;

      let scaleX = 1;
      let scaleY = 1;
      let offsetX = 0;
      let offsetY = 0;

      // Calculate scale and offset based on resize handle
      switch (resizeHandle) {
        case 'nw':
          scaleX = (originalWidth - deltaX) / originalWidth;
          scaleY = (originalHeight - deltaY) / originalHeight;
          offsetX = deltaX;
          offsetY = deltaY;
          break;
        case 'n':
          scaleY = (originalHeight - deltaY) / originalHeight;
          offsetY = deltaY;
          break;
        case 'ne':
          scaleX = (originalWidth + deltaX) / originalWidth;
          scaleY = (originalHeight - deltaY) / originalHeight;
          offsetY = deltaY;
          break;
        case 'e':
          scaleX = (originalWidth + deltaX) / originalWidth;
          break;
        case 'se':
          scaleX = (originalWidth + deltaX) / originalWidth;
          scaleY = (originalHeight + deltaY) / originalHeight;
          break;
        case 's':
          scaleY = (originalHeight + deltaY) / originalHeight;
          break;
        case 'sw':
          scaleX = (originalWidth - deltaX) / originalWidth;
          scaleY = (originalHeight + deltaY) / originalHeight;
          offsetX = deltaX;
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

      // Apply transformations to all selected shapes
      initialShapes.forEach(initialShape => {
        const relativeX = initialShape.x - originalMinX;
        const relativeY = initialShape.y - originalMinY;

        const newX = originalMinX + offsetX + relativeX * scaleX;
        const newY = originalMinY + offsetY + relativeY * scaleY;
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
  }, [isDragging, isMoving, dragStart, resizeHandle, initialShapes, scale]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsMoving(false);
    setResizeHandle(null);
    setDragStart(null);
    setInitialShapes([]);
  }, []);

  // Add global event listeners when dragging or moving
  useEffect(() => {
    if (isDragging || isMoving) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isMoving, handleMouseMove, handleMouseUp]);

  // Early return after all hooks are called
  if (selectedIds.length === 0 || selectedShapes.length === 0) return null;

  // Calculate bounding box for all selected shapes
  const minX = Math.min(...selectedShapes.map(s => s.x));
  const minY = Math.min(...selectedShapes.map(s => s.y));
  const maxX = Math.max(...selectedShapes.map(s => s.x + s.width));
  const maxY = Math.max(...selectedShapes.map(s => s.y + s.height));

  const width = maxX - minX;
  const height = maxY - minY;

  const handleSize = 12 / scale; // Adjust handle size based on zoom level
  const handles = [
    { id: 'nw', x: minX - handleSize / 2, y: minY - handleSize / 2, cursor: 'nw-resize' },
    { id: 'n', x: minX + width / 2 - handleSize / 2, y: minY - handleSize / 2, cursor: 'n-resize' },
    { id: 'ne', x: maxX - handleSize / 2, y: minY - handleSize / 2, cursor: 'ne-resize' },
    { id: 'e', x: maxX - handleSize / 2, y: minY + height / 2 - handleSize / 2, cursor: 'e-resize' },
    { id: 'se', x: maxX - handleSize / 2, y: maxY - handleSize / 2, cursor: 'se-resize' },
    { id: 's', x: minX + width / 2 - handleSize / 2, y: maxY - handleSize / 2, cursor: 's-resize' },
    { id: 'sw', x: minX - handleSize / 2, y: maxY - handleSize / 2, cursor: 'sw-resize' },
    { id: 'w', x: minX - handleSize / 2, y: minY + height / 2 - handleSize / 2, cursor: 'w-resize' },
  ];

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
        style={{ cursor: isMoving ? 'grabbing' : 'grab' }}
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