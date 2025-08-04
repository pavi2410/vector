import React, { useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { toolStore } from '@/stores/tools';
import { selectShape } from '@/stores/selection';
import { setHoveredShape } from '@/stores/hover';
import { ShapeRenderer } from './ShapeRenderer';
import type { Shape } from '@/types/canvas';

interface InteractiveShapeProps {
  shape: Shape;
  isSelected: boolean;
  isHovered: boolean;
  isPreview?: boolean;
}

export function InteractiveShape({ shape, isSelected, isHovered, isPreview = false }: InteractiveShapeProps) {
  const { activeTool } = useStore(toolStore);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (activeTool === 'select') {
      event.stopPropagation(); // Prevent bubbling to canvas
      selectShape(shape.id, event.shiftKey);
    }
  }, [activeTool, shape.id]);

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

  return (
    <g
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ 
        cursor: activeTool === 'select' ? 'pointer' : 'default',
        pointerEvents: isPreview ? 'none' : 'all'
      }}
    >
      <ShapeRenderer 
        shape={shape} 
        isSelected={isSelected} 
        isHovered={isHovered}
        isPreview={isPreview} 
      />
    </g>
  );
}
