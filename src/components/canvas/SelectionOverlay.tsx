import { useStore } from '@nanostores/react';
import { canvasStore } from '@/stores/canvas';
import { selectionStore } from '@/stores/selection';

export function SelectionOverlay() {
  const { shapes } = useStore(canvasStore);
  const { selectedIds } = useStore(selectionStore);

  if (selectedIds.length === 0) return null;

  const selectedShapes = shapes.filter(shape => selectedIds.includes(shape.id));
  
  if (selectedShapes.length === 0) return null;

  // Calculate bounding box for all selected shapes
  const minX = Math.min(...selectedShapes.map(s => s.x));
  const minY = Math.min(...selectedShapes.map(s => s.y));
  const maxX = Math.max(...selectedShapes.map(s => s.x + s.width));
  const maxY = Math.max(...selectedShapes.map(s => s.y + s.height));

  const width = maxX - minX;
  const height = maxY - minY;

  const handleSize = 8;
  const handles = [
    { x: minX - handleSize/2, y: minY - handleSize/2, cursor: 'nw-resize' },
    { x: minX + width/2 - handleSize/2, y: minY - handleSize/2, cursor: 'n-resize' },
    { x: maxX - handleSize/2, y: minY - handleSize/2, cursor: 'ne-resize' },
    { x: maxX - handleSize/2, y: minY + height/2 - handleSize/2, cursor: 'e-resize' },
    { x: maxX - handleSize/2, y: maxY - handleSize/2, cursor: 'se-resize' },
    { x: minX + width/2 - handleSize/2, y: maxY - handleSize/2, cursor: 's-resize' },
    { x: minX - handleSize/2, y: maxY - handleSize/2, cursor: 'sw-resize' },
    { x: minX - handleSize/2, y: minY + height/2 - handleSize/2, cursor: 'w-resize' },
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
        strokeWidth="1"
        strokeDasharray="4 4"
        pointerEvents="none"
      />

      {/* Transform handles */}
      {handles.map((handle, index) => (
        <rect
          key={index}
          x={handle.x}
          y={handle.y}
          width={handleSize}
          height={handleSize}
          fill="#3b82f6"
          stroke="#ffffff"
          strokeWidth="1"
          style={{ cursor: handle.cursor }}
          className="hover:fill-blue-600"
        />
      ))}
    </g>
  );
}