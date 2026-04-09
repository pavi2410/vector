import { useRef, useState, useCallback, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { TransformComponent, useTransformContext, useControls } from 'react-zoom-pan-pinch';
import { canvasStore, addShape, updateShape } from '@/stores/canvas';
import { editorStore, selectShape, clearSelection, setHoveredShape, setTextEditing } from '@/stores/editorState';
import { setMousePosition } from '@/stores/mouse';
import { debugStore } from '@/stores/debug';
import { projectSettingsStore } from '@/stores/project';
import { ShapeRenderer } from './ShapeRenderer';
import { GroupRenderer } from './GroupRenderer';
import { SelectionOverlay } from './SelectionOverlay';
import { FrameSelectionOverlay } from './FrameSelectionOverlay';
import { TextEditor } from './TextEditor';
import { CanvasControls } from './CanvasControls';
import { DebugInfo } from './DebugInfo';
import { useCanvasShortcuts } from '@/hooks/useCanvasShortcuts';
import { useOnEvent } from '@/utils/eventBus';
import { getRenderableShapes } from '@/utils/zIndex';
import type { Shape, Group } from '@/types/canvas';

interface FrameContentProps {
  isSpacePanning: boolean;
  setIsSpacePanning: (active: boolean) => void;
  onWrapperClick: (event: React.MouseEvent) => void;
}

type DragState = {
  startMouse: { x: number; y: number };
  initialPositions: { id: string; x: number; y: number }[];
} | null;

export function FrameContent({ isSpacePanning, setIsSpacePanning, onWrapperClick }: FrameContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [dragState, setDragState] = useState<DragState>(null);

  const { frame } = useStore(canvasStore);
  const { shapes } = frame;
  const { activeTool, toolSettings, selectedIds, hoveredId, editingTextId } = useStore(editorStore);
  const { showDebugInfo } = useStore(debugStore);
  const { gridSize } = useStore(projectSettingsStore);
  const { state: transformState } = useTransformContext();
  const { zoomIn, zoomOut, centerView, instance } = useControls();

  const scale = transformState.scale;

  useCanvasShortcuts({
    onTogglePanMode: (active: boolean) => setIsSpacePanning(active)
  });

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
    const scaleX = wrapper.width / boundsWidth;
    const scaleY = wrapper.height / boundsHeight;
    const newScale = Math.min(scaleX, scaleY, 1);
    centerView(1 / newScale);
  }, [centerView, instance]);

  const getDocPosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / scale,
      y: (clientY - rect.top) / scale,
    };
  }, [scale]);

  const hitTest = useCallback((docX: number, docY: number): Shape | null => {
    // Check all renderable shapes in reverse z-order (highest z = topmost).
    // Children have higher z than their parent group, so they are checked first.
    // If no child is hit, we fall through to the group itself, which lets users
    // select the group by clicking on empty space inside its bounding box.
    const all = getRenderableShapes(shapes);
    const margin = 6 / scale;
    for (let i = all.length - 1; i >= 0; i--) {
      const s = all[i];
      // Normalize bounds — lines can have negative width/height
      const minX = Math.min(s.x, s.x + s.width);
      const maxX = Math.max(s.x, s.x + s.width);
      const minY = Math.min(s.y, s.y + s.height);
      const maxY = Math.max(s.y, s.y + s.height);
      if (docX >= minX - margin && docX <= maxX + margin &&
          docY >= minY - margin && docY <= maxY + margin) {
        return s;
      }
    }
    return null;
  }, [shapes, scale]);

  // Global drag listeners
  useEffect(() => {
    if (!dragState) return;

    const onMove = (e: MouseEvent) => {
      const rawDx = e.clientX - dragState.startMouse.x;
      const rawDy = e.clientY - dragState.startMouse.y;
      // Dead zone: ignore sub-3px movement to prevent micro-moves on click
      if (Math.abs(rawDx) < 3 && Math.abs(rawDy) < 3) return;
      const dx = rawDx / scale;
      const dy = rawDy / scale;
      dragState.initialPositions.forEach(({ id, x, y }) => {
        updateShape(id, { x: x + dx, y: y + dy });
      });
    };

    const onUp = () => setDragState(null);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [dragState, scale]);

  const getCursor = () => {
    if (isSpacePanning) return 'cursor-grab';
    if (activeTool === 'select') return 'cursor-default';
    return 'cursor-crosshair';
  };

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (isSpacePanning || event.button === 1 || event.altKey) return;

    const pos = getDocPosition(event.clientX, event.clientY);

    if (activeTool === 'select') {
      const hit = hitTest(pos.x, pos.y);
      if (hit) {
        if (!selectedIds.includes(hit.id)) {
          selectShape(hit.id, event.shiftKey);
        }
        // Build the set of IDs that will be selected after this click
        const nextSelectedIds = event.shiftKey
          ? [...new Set([...selectedIds, hit.id])]
          : selectedIds.includes(hit.id)
            ? selectedIds
            : [hit.id];

        const initialPositions = shapes
          .filter(s => nextSelectedIds.includes(s.id))
          .map(s => ({ id: s.id, x: s.x, y: s.y }));

        setDragState({
          startMouse: { x: event.clientX, y: event.clientY },
          initialPositions,
        });
      } else {
        clearSelection();
      }
      return;
    }

    event.stopPropagation();

    if (['rectangle', 'circle', 'line'].includes(activeTool)) {
      setIsDrawing(true);
      setStartPoint(pos);
      setCurrentShape({
        id: `shape-${crypto.randomUUID()}`,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        z: 0,
        fill: toolSettings.fill,
        stroke: toolSettings.stroke,
        strokeWidth: toolSettings.strokeWidth,
        opacity: toolSettings.opacity,
      });
    } else if (activeTool === 'text') {
      const fontSize = toolSettings.fontSize ?? 16;
      const newShape: Shape = {
        id: `shape-${crypto.randomUUID()}`,
        x: pos.x,
        y: pos.y,
        width: 100,
        height: fontSize * 1.2,
        z: 0,
        fill: toolSettings.fill,
        stroke: toolSettings.stroke,
        strokeWidth: toolSettings.strokeWidth,
        opacity: toolSettings.opacity,
        text: 'Text',
        fontSize,
        fontFamily: toolSettings.fontFamily || 'Inter, system-ui, sans-serif',
        fontWeight: toolSettings.fontWeight || 'normal',
        fontStyle: toolSettings.fontStyle || 'normal',
        textAlign: toolSettings.textAlign || 'start',
      };
      addShape(newShape);
      selectShape(newShape.id);
    }
  }, [activeTool, toolSettings, shapes, selectedIds, isSpacePanning, getDocPosition, hitTest]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const pos = getDocPosition(event.clientX, event.clientY);
    setMousePosition(pos.x, pos.y, event.clientX, event.clientY);

    // Drawing in progress
    if (isDrawing && startPoint && currentShape) {
      event.stopPropagation();

      if (currentShape.type === 'line') {
        let endX = pos.x;
        let endY = pos.y;
        if (event.shiftKey) {
          const deltaX = pos.x - startPoint.x;
          const deltaY = pos.y - startPoint.y;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const angle = Math.atan2(deltaY, deltaX);
          const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
          endX = startPoint.x + distance * Math.cos(snapAngle);
          endY = startPoint.y + distance * Math.sin(snapAngle);
        }
        setCurrentShape({ ...currentShape, x: startPoint.x, y: startPoint.y, width: endX - startPoint.x, height: endY - startPoint.y });
      } else {
        let width = Math.abs(pos.x - startPoint.x);
        let height = Math.abs(pos.y - startPoint.y);
        if (event.shiftKey) {
          const size = Math.max(width, height);
          width = size;
          height = size;
        }
        let finalX = Math.min(startPoint.x, pos.x);
        let finalY = Math.min(startPoint.y, pos.y);
        if (event.shiftKey) {
          const size = Math.max(width, height);
          if (pos.x >= startPoint.x && pos.y >= startPoint.y) {
            finalX = startPoint.x; finalY = startPoint.y;
          } else if (pos.x < startPoint.x && pos.y >= startPoint.y) {
            finalX = startPoint.x - size; finalY = startPoint.y;
          } else if (pos.x < startPoint.x && pos.y < startPoint.y) {
            finalX = startPoint.x - size; finalY = startPoint.y - size;
          } else {
            finalX = startPoint.x; finalY = startPoint.y - size;
          }
        }
        setCurrentShape({ ...currentShape, x: finalX, y: finalY, width, height });
      }
      return;
    }

    // Hover tracking
    if (activeTool === 'select' && !dragState) {
      const hit = hitTest(pos.x, pos.y);
      setHoveredShape(hit ? hit.id : null);
    }
  }, [isDrawing, startPoint, currentShape, activeTool, dragState, getDocPosition, hitTest]);

  const handleMouseUp = useCallback(() => {
    if (isDrawing && currentShape) {
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

  const handleDoubleClick = useCallback((event: React.MouseEvent) => {
    if (activeTool !== 'select') return;
    const pos = getDocPosition(event.clientX, event.clientY);
    const hit = hitTest(pos.x, pos.y);
    if (hit && hit.type === 'text') {
      setTextEditing(hit.id);
    }
  }, [activeTool, getDocPosition, hitTest]);

  const handleFinishTextEditing = useCallback(() => {
    setTextEditing(null);
  }, []);

  const editingShape = editingTextId ? shapes.find(s => s.id === editingTextId) : null;
  const hoveredShape = hoveredId && !selectedIds.includes(hoveredId)
    ? shapes.find(s => s.id === hoveredId)
    : null;

  return (
    <>
      <TransformComponent
        wrapperClass="w-full! h-full! bg-muted"
        wrapperProps={{ onClick: onWrapperClick }}
      >
        <div
          ref={containerRef}
          style={{ position: 'relative', width: frame.width, height: frame.height }}
          className={`${getCursor()} select-none`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          onMouseLeave={() => setHoveredShape(null)}
        >
          {/* Layer 1: Document — pure SVG render, no editor artifacts */}
          <svg
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
            width={frame.width}
            height={frame.height}
            viewBox={`0 0 ${frame.width} ${frame.height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
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

            <rect
              x={0} y={0}
              width={frame.width} height={frame.height}
              fill={frame.backgroundColor || '#ffffff'}
              stroke="none"
            />
            <rect
              x={0} y={0}
              width={frame.width} height={frame.height}
              fill="url(#grid)"
            />

            {getRenderableShapes(shapes)
              .filter(shape => !shape.parentId)
              .map(shape =>
                shape.type === 'group' ? (
                  <GroupRenderer key={shape.id} group={shape as Group} shapes={shapes} />
                ) : (
                  <ShapeRenderer key={shape.id} shape={shape} />
                )
              )}

            {currentShape && <ShapeRenderer shape={currentShape} isPreview />}
          </svg>

          {/* Layer 2: Editor overlay — selection chrome, hover outlines, text editing */}
          <svg
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
            width={frame.width}
            height={frame.height}
            viewBox={`0 0 ${frame.width} ${frame.height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Hover outline */}
            {hoveredShape && (
              <rect
                x={Math.min(hoveredShape.x, hoveredShape.x + hoveredShape.width)}
                y={Math.min(hoveredShape.y, hoveredShape.y + hoveredShape.height)}
                width={Math.abs(hoveredShape.width)}
                height={Math.abs(hoveredShape.height)}
                fill="none"
                stroke="#93c5fd"
                strokeWidth={1.5 / scale}
                style={{ pointerEvents: 'none' }}
              />
            )}

            {/* Inline text editor */}
            {editingShape && (
              <TextEditor
                shape={editingShape}
                onFinishEditing={handleFinishTextEditing}
                scale={scale}
              />
            )}

            <SelectionOverlay editingTextId={editingTextId} />
            <FrameSelectionOverlay />
          </svg>
        </div>
      </TransformComponent>

      {showDebugInfo && <DebugInfo />}
      <CanvasControls />
    </>
  );
}
