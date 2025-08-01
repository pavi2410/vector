import { useStore } from '@nanostores/react';
import { canvasStore, updateFrame } from '@/stores/canvas';
import { selectionStore } from '@/stores/selection';
import { useTransformContext } from 'react-zoom-pan-pinch';
import { useState, useCallback } from 'react';

export function FrameSelectionOverlay() {
  const { frames } = useStore(canvasStore);
  const { selectedFrameIds } = useStore(selectionStore);
  const { transformState } = useTransformContext();
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [initialFrame, setInitialFrame] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  
  const scale = transformState.scale;

  const selectedFrames = frames.filter(frame => selectedFrameIds.includes(frame.id));
  
  // For now, handle single frame selection (can be extended for multi-selection)
  const frame = selectedFrames[0];

  const handleMouseDown = useCallback((e: React.MouseEvent, handleId: string) => {
    if (!frame) return;
    e.stopPropagation();
    setIsDragging(true);
    setResizeHandle(handleId);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialFrame({ x: frame.x, y: frame.y, width: frame.width, height: frame.height });
  }, [frame]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart || !resizeHandle || !initialFrame) return;

    const deltaX = (e.clientX - dragStart.x) / scale;
    const deltaY = (e.clientY - dragStart.y) / scale;

    let newX = initialFrame.x;
    let newY = initialFrame.y;
    let newWidth = initialFrame.width;
    let newHeight = initialFrame.height;

    // Calculate new dimensions based on resize handle
    switch (resizeHandle) {
      case 'nw':
        newX = initialFrame.x + deltaX;
        newY = initialFrame.y + deltaY;
        newWidth = initialFrame.width - deltaX;
        newHeight = initialFrame.height - deltaY;
        break;
      case 'n':
        newY = initialFrame.y + deltaY;
        newHeight = initialFrame.height - deltaY;
        break;
      case 'ne':
        newY = initialFrame.y + deltaY;
        newWidth = initialFrame.width + deltaX;
        newHeight = initialFrame.height - deltaY;
        break;
      case 'e':
        newWidth = initialFrame.width + deltaX;
        break;
      case 'se':
        newWidth = initialFrame.width + deltaX;
        newHeight = initialFrame.height + deltaY;
        break;
      case 's':
        newHeight = initialFrame.height + deltaY;
        break;
      case 'sw':
        newX = initialFrame.x + deltaX;
        newWidth = initialFrame.width - deltaX;
        newHeight = initialFrame.height + deltaY;
        break;
      case 'w':
        newX = initialFrame.x + deltaX;
        newWidth = initialFrame.width - deltaX;
        break;
    }

    // Ensure minimum dimensions
    const minSize = 50;
    if (newWidth < minSize) {
      if (resizeHandle.includes('w')) {
        newX = initialFrame.x + initialFrame.width - minSize;
      }
      newWidth = minSize;
    }
    if (newHeight < minSize) {
      if (resizeHandle.includes('n')) {
        newY = initialFrame.y + initialFrame.height - minSize;
      }
      newHeight = minSize;
    }

    if (frame) {
      updateFrame(frame.id, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
    }
  }, [isDragging, dragStart, resizeHandle, initialFrame, scale, frame]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setResizeHandle(null);
    setDragStart(null);
    setInitialFrame(null);
  }, []);

  // Early return after all hooks are called
  if (selectedFrameIds.length === 0 || !frame) return null;

  const handleSize = 12 / scale;
  const handles = [
    { id: 'nw', x: frame.x - handleSize / 2, y: frame.y - handleSize / 2, cursor: 'nw-resize' },
    { id: 'n', x: frame.x + frame.width / 2 - handleSize / 2, y: frame.y - handleSize / 2, cursor: 'n-resize' },
    { id: 'ne', x: frame.x + frame.width - handleSize / 2, y: frame.y - handleSize / 2, cursor: 'ne-resize' },
    { id: 'e', x: frame.x + frame.width - handleSize / 2, y: frame.y + frame.height / 2 - handleSize / 2, cursor: 'e-resize' },
    { id: 'se', x: frame.x + frame.width - handleSize / 2, y: frame.y + frame.height - handleSize / 2, cursor: 'se-resize' },
    { id: 's', x: frame.x + frame.width / 2 - handleSize / 2, y: frame.y + frame.height - handleSize / 2, cursor: 's-resize' },
    { id: 'sw', x: frame.x - handleSize / 2, y: frame.y + frame.height - handleSize / 2, cursor: 'sw-resize' },
    { id: 'w', x: frame.x - handleSize / 2, y: frame.y + frame.height / 2 - handleSize / 2, cursor: 'w-resize' },
  ];

  return (
    <g 
      className="frame-selection-overlay"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Selection rectangle */}
      <rect
        x={frame.x}
        y={frame.y}
        width={frame.width}
        height={frame.height}
        fill="none"
        stroke="#10b981"
        strokeWidth={2 / scale}
        strokeDasharray={`${4 / scale} ${4 / scale}`}
        pointerEvents="none"
      />

      {/* Frame label */}
      <text
        x={frame.x}
        y={frame.y - 8 / scale}
        fill="#10b981"
        fontSize={12 / scale}
        fontWeight="bold"
        pointerEvents="none"
      >
        {frame.name}
      </text>

      {/* Resize handles */}
      {handles.map((handle) => (
        <rect
          key={handle.id}
          x={handle.x}
          y={handle.y}
          width={handleSize}
          height={handleSize}
          fill="#10b981"
          stroke="#ffffff"
          strokeWidth={1 / scale}
          style={{ cursor: handle.cursor }}
          className="hover:fill-green-600"
          onMouseDown={(e) => handleMouseDown(e, handle.id)}
        />
      ))}
    </g>
  );
}