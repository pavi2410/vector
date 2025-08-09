import React, { useCallback, useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { useTransformContext } from 'react-zoom-pan-pinch';
import { toolStore } from '@/stores/tools';
import { selectShape, selectionStore } from '@/stores/selection';
import { setHoveredShape } from '@/stores/hover';
import { updateShape } from '@/stores/canvas';
import { setTextEditing } from '@/stores/textEditing';
import { ShapeRenderer } from './ShapeRenderer';
import { TextEditor } from './TextEditor';
import type { Shape } from '@/types/canvas';

interface InteractiveShapeProps {
  shape: Shape;
  isSelected: boolean;
  isHovered: boolean;
  isPreview?: boolean;
}

export function InteractiveShape({ shape, isSelected, isHovered, isPreview = false }: InteractiveShapeProps) {
  const { activeTool } = useStore(toolStore);
  const { selectedIds } = useStore(selectionStore);
  const { transformState } = useTransformContext();
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [initialPosition, setInitialPosition] = useState<{ x: number; y: number } | null>(null);
  const [isEditingText, setIsEditingText] = useState(false);

  const scale = transformState.scale;

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (activeTool === 'select') {
      event.stopPropagation(); // Prevent bubbling to canvas
      
      // Select the shape first
      if (!selectedIds.includes(shape.id)) {
        selectShape(shape.id, event.shiftKey);
      }
      
      // Start dragging
      setIsDragging(true);
      setDragStart({ x: event.clientX, y: event.clientY });
      setInitialPosition({ x: shape.x, y: shape.y });
    }
  }, [activeTool, shape.id, shape.x, shape.y, selectedIds]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !dragStart || !initialPosition) return;

    const deltaX = (event.clientX - dragStart.x) / scale;
    const deltaY = (event.clientY - dragStart.y) / scale;

    updateShape(shape.id, {
      x: initialPosition.x + deltaX,
      y: initialPosition.y + deltaY
    });
  }, [isDragging, dragStart, initialPosition, scale, shape.id]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
    setInitialPosition(null);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (activeTool === 'select') {
      setHoveredShape(shape.id);
    }
  }, [activeTool, shape.id]);

  const handleMouseLeave = useCallback(() => {
    if (activeTool === 'select') {
      setHoveredShape(null);
    }
  }, [activeTool]);

  const handleDoubleClick = useCallback((event: React.MouseEvent) => {
    if (activeTool === 'select' && shape.type === 'text') {
      event.stopPropagation();
      setIsEditingText(true);
      setTextEditing(shape.id);
    }
  }, [activeTool, shape.type, shape.id]);

  const handleFinishTextEditing = useCallback(() => {
    setIsEditingText(false);
    setTextEditing(null);
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

  return (
    <g
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
      style={{ 
        cursor: activeTool === 'select' ? (isDragging ? 'grabbing' : (shape.type === 'text' ? 'text' : 'grab')) : 'default',
        pointerEvents: isPreview ? 'none' : 'all'
      }}
    >
      {isEditingText && shape.type === 'text' ? (
        <TextEditor 
          shape={shape} 
          onFinishEditing={handleFinishTextEditing}
          scale={scale}
        />
      ) : (
        <ShapeRenderer 
          shape={shape} 
          isSelected={isSelected} 
          isHovered={isHovered}
          isPreview={isPreview} 
        />
      )}
    </g>
  );
}
