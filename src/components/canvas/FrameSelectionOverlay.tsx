import { useStore } from '@nanostores/react';
import { canvasStore, updateFrame } from '@/stores/canvas';
import { editorStore } from '@/stores/editorState';
import { useTransformContext } from 'react-zoom-pan-pinch';
import { useState, useCallback, useEffect } from 'react';

export function FrameSelectionOverlay() {
  const { frame } = useStore(canvasStore);
  const { selectedFrameIds } = useStore(editorStore);
  const { transformState } = useTransformContext();
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [initialFrame, setInitialFrame] = useState<{ width: number; height: number } | null>(null);
  
  const scale = transformState.scale;

  // Check if current frame is selected
  const isFrameSelected = selectedFrameIds.includes(frame.id);

  const handleMouseDown = useCallback((e: React.MouseEvent, handleId: string) => {
    e.stopPropagation();
    setIsDragging(true);
    setResizeHandle(handleId);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialFrame({ width: frame.width, height: frame.height });
  }, [frame]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStart || !resizeHandle || !initialFrame) return;

    const deltaX = (e.clientX - dragStart.x) / scale;
    const deltaY = (e.clientY - dragStart.y) / scale;

    let newWidth = initialFrame.width;
    let newHeight = initialFrame.height;

    // Calculate new dimensions based on resize handle (frame is always at 0,0)
    switch (resizeHandle) {
      case 'nw':
        // For frames at origin, NW becomes SE behavior
        newWidth = Math.max(50, initialFrame.width - deltaX);
        newHeight = Math.max(50, initialFrame.height - deltaY);
        break;
      case 'n':
        newHeight = Math.max(50, initialFrame.height - deltaY);
        break;
      case 'ne':
        newWidth = Math.max(50, initialFrame.width + deltaX);
        newHeight = Math.max(50, initialFrame.height - deltaY);
        break;
      case 'e':
        newWidth = Math.max(50, initialFrame.width + deltaX);
        break;
      case 'se':
        newWidth = Math.max(50, initialFrame.width + deltaX);
        newHeight = Math.max(50, initialFrame.height + deltaY);
        break;
      case 's':
        newHeight = Math.max(50, initialFrame.height + deltaY);
        break;
      case 'sw':
        newWidth = Math.max(50, initialFrame.width - deltaX);
        newHeight = Math.max(50, initialFrame.height + deltaY);
        break;
      case 'w':
        newWidth = Math.max(50, initialFrame.width - deltaX);
        break;
    }

    updateFrame({
      width: newWidth,
      height: newHeight
    });
  }, [isDragging, dragStart, resizeHandle, initialFrame, scale]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setResizeHandle(null);
    setDragStart(null);
    setInitialFrame(null);
  }, []);

  // Add global event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Early return after all hooks are called
  if (!isFrameSelected) return null;

  const handleSize = 12 / scale;
  const handles = [
    { id: 'nw', x: -handleSize / 2, y: -handleSize / 2, cursor: 'nw-resize' },
    { id: 'n', x: frame.width / 2 - handleSize / 2, y: -handleSize / 2, cursor: 'n-resize' },
    { id: 'ne', x: frame.width - handleSize / 2, y: -handleSize / 2, cursor: 'ne-resize' },
    { id: 'e', x: frame.width - handleSize / 2, y: frame.height / 2 - handleSize / 2, cursor: 'e-resize' },
    { id: 'se', x: frame.width - handleSize / 2, y: frame.height - handleSize / 2, cursor: 'se-resize' },
    { id: 's', x: frame.width / 2 - handleSize / 2, y: frame.height - handleSize / 2, cursor: 's-resize' },
    { id: 'sw', x: -handleSize / 2, y: frame.height - handleSize / 2, cursor: 'sw-resize' },
    { id: 'w', x: -handleSize / 2, y: frame.height / 2 - handleSize / 2, cursor: 'w-resize' },
  ];

  return (
    <g className="frame-selection-overlay">
      {/* Selection rectangle */}
      <rect
        x={0}
        y={0}
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
        x={8 / scale}
        y={-8 / scale}
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