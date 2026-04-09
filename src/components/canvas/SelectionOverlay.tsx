import { useStore } from '@nanostores/react';
import { canvasStore, updateShape } from '@/stores/canvas';
import { editorStore } from '@/stores/editorState';
import { useTransformContext } from 'react-zoom-pan-pinch';
import { useState, useCallback, useEffect } from 'react';

interface SelectionOverlayProps {
  editingTextId: string | null;
}

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

  switch (resizeHandle) {
    case 'nw': {
      const nwScale = Math.max(
        (originalWidth - deltaX) / originalWidth,
        (originalHeight - deltaY) / originalHeight
      );
      scaleX = nwScale; scaleY = nwScale;
      offsetX = originalWidth - originalWidth * nwScale;
      offsetY = originalHeight - originalHeight * nwScale;
      break;
    }
    case 'n':
      scaleY = (originalHeight - deltaY) / originalHeight;
      offsetY = deltaY;
      break;
    case 'ne': {
      const neScale = Math.max(
        (originalWidth + deltaX) / originalWidth,
        (originalHeight - deltaY) / originalHeight
      );
      scaleX = neScale; scaleY = neScale;
      offsetY = originalHeight - originalHeight * neScale;
      break;
    }
    case 'e':
      scaleX = (originalWidth + deltaX) / originalWidth;
      break;
    case 'se': {
      const seScale = Math.max(
        (originalWidth + deltaX) / originalWidth,
        (originalHeight + deltaY) / originalHeight
      );
      scaleX = seScale; scaleY = seScale;
      break;
    }
    case 's':
      scaleY = (originalHeight + deltaY) / originalHeight;
      break;
    case 'sw': {
      const swScale = Math.max(
        (originalWidth - deltaX) / originalWidth,
        (originalHeight + deltaY) / originalHeight
      );
      scaleX = swScale; scaleY = swScale;
      offsetX = originalWidth - originalWidth * swScale;
      break;
    }
    case 'w':
      scaleX = (originalWidth - deltaX) / originalWidth;
      offsetX = deltaX;
      break;
  }

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

export function SelectionOverlay({ editingTextId }: SelectionOverlayProps) {
  const { frame } = useStore(canvasStore);
  const { shapes } = frame;
  const { selectedIds } = useStore(editorStore);
  const { state: transformState } = useTransformContext();

  const [resizeState, setResizeState] = useState<{
    handle: string;
    dragStart: { x: number; y: number };
    initialShapes: Array<{ id: string; x: number; y: number; width: number; height: number }>;
  } | null>(null);

  const scale = transformState.scale;
  const selectedShapes = shapes.filter(shape => selectedIds.includes(shape.id));

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handleId: string) => {
    if (selectedShapes.length === 0) return;
    e.stopPropagation();
    setResizeState({
      handle: handleId,
      dragStart: { x: e.clientX, y: e.clientY },
      initialShapes: selectedShapes.map(s => ({ id: s.id, x: s.x, y: s.y, width: s.width, height: s.height })),
    });
  }, [selectedShapes]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizeState) return;
    const deltaX = (e.clientX - resizeState.dragStart.x) / scale;
    const deltaY = (e.clientY - resizeState.dragStart.y) / scale;
    const originalBounds = calculateBoundingBox(resizeState.initialShapes);
    const { scaleX, scaleY, offsetX, offsetY } = calculateResizeTransform(
      resizeState.handle, deltaX, deltaY, originalBounds
    );
    resizeState.initialShapes.forEach(initialShape => {
      const relativeX = initialShape.x - originalBounds.minX;
      const relativeY = initialShape.y - originalBounds.minY;
      updateShape(initialShape.id, {
        x: originalBounds.minX + offsetX + relativeX * scaleX,
        y: originalBounds.minY + offsetY + relativeY * scaleY,
        width: Math.max(5, initialShape.width * scaleX),
        height: Math.max(5, initialShape.height * scaleY),
      });
    });
  }, [resizeState, scale]);

  const handleMouseUp = useCallback(() => {
    setResizeState(null);
  }, []);

  useEffect(() => {
    if (!resizeState) return;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizeState, handleMouseMove, handleMouseUp]);

  if (selectedIds.length === 0 || selectedShapes.length === 0) return null;
  if (editingTextId && selectedIds.includes(editingTextId)) return null;

  const { minX, minY, maxX, maxY, width, height } = calculateBoundingBox(selectedShapes);
  const handleSize = 8 / scale;
  const handles = generateResizeHandles(minX, minY, maxX, maxY, handleSize);

  return (
    <g className="selection-overlay">
      {/* Selection bounding rect — visual only, transparent to pointer events */}
      <rect
        x={minX}
        y={minY}
        width={width}
        height={height}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={1 / scale}
        strokeDasharray={`${4 / scale} ${4 / scale}`}
        style={{ pointerEvents: 'none' }}
      />

      {/* Resize handles — interactive */}
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
          style={{ cursor: handle.cursor, pointerEvents: 'auto' }}
          className="hover:fill-blue-600"
          onMouseDown={(e) => handleResizeMouseDown(e, handle.id)}
        />
      ))}
    </g>
  );
}
