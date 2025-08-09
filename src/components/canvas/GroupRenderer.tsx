import type { Shape, Group } from '@/types/canvas';
import { InteractiveShape } from './InteractiveShape';
import { getRenderableShapes } from '@/utils/zIndex';
import { cn } from '@/lib/utils';
import { useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { selectShape } from '@/stores/editorState';
import { debugStore } from '@/stores/debug';

interface GroupRendererProps {
  group: Group;
  shapes: Shape[];
  isSelected: boolean;
  isHovered?: boolean;
  isPreview?: boolean;
  selectedIds: string[];
  hoveredId?: string;
}

export function GroupRenderer({ 
  group, 
  shapes, 
  isSelected, 
  isHovered = false, 
  isPreview = false,
  selectedIds,
  hoveredId
}: GroupRendererProps) {
  const { showGroupLabels } = useStore(debugStore);
  
  // Get child shapes
  const childShapes = shapes.filter(s => group.children?.includes(s.id));
  
  // Sort children by z-index for proper rendering order
  const sortedChildren = getRenderableShapes(childShapes);
  
  // Handle group selection
  const handleGroupClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    selectShape(group.id, event.shiftKey);
  }, [group.id]);
  
  const commonProps = {
    opacity: group.opacity ?? 1,
    className: cn(
      isPreview && "pointer-events-none opacity-70"
    )
  };
  
  // Apply group transform if needed
  const transform = group.rotation 
    ? `rotate(${group.rotation} ${group.x + group.width / 2} ${group.y + group.height / 2})`
    : undefined;

  return (
    <g 
      id={`group-${group.id}`}
      transform={transform}
      {...commonProps}
    >
      {/* Group selection area - invisible but clickable */}
      <rect
        x={group.x}
        y={group.y}
        width={group.width}
        height={group.height}
        fill="transparent"
        stroke="none"
        style={{ 
          pointerEvents: isPreview ? 'none' : 'all',
          cursor: 'pointer'
        }}
        onClick={handleGroupClick}
      />
      
      {/* Group visual bounds when selected */}
      {isSelected && (
        <rect
          x={group.x}
          y={group.y}
          width={group.width}
          height={group.height}
          fill="none"
          stroke="rgb(59, 130, 246)"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.5}
          style={{ pointerEvents: 'none' }}
        />
      )}
      
      {/* Group hover bounds */}
      {isHovered && !isSelected && (
        <rect
          x={group.x}
          y={group.y}
          width={group.width}
          height={group.height}
          fill="none"
          stroke="rgb(59, 130, 246)"
          strokeWidth={1}
          strokeDasharray="2 2"
          opacity={0.3}
          style={{ pointerEvents: 'none' }}
        />
      )}
      
      {/* Render child shapes */}
      {sortedChildren.map((child) => {
        if (child.type === 'group') {
          // Recursively render nested groups
          return (
            <GroupRenderer
              key={child.id}
              group={child as Group}
              shapes={shapes}
              isSelected={selectedIds.includes(child.id)}
              isHovered={hoveredId === child.id}
              isPreview={isPreview}
              selectedIds={selectedIds}
              hoveredId={hoveredId}
            />
          );
        } else {
          // Render individual shapes with interaction capabilities
          return (
            <InteractiveShape
              key={child.id}
              shape={child}
              isSelected={selectedIds.includes(child.id)}
              isHovered={hoveredId === child.id}
              isPreview={isPreview}
            />
          );
        }
      })}
      
      {/* Group label for debugging */}
      {showGroupLabels && isSelected && (
        <text
          x={group.x}
          y={group.y - 5}
          fontSize={10}
          fill="rgb(59, 130, 246)"
          fontFamily="monospace"
          style={{ pointerEvents: 'none' }}
        >
          Group ({group.children?.length || 0} items)
        </text>
      )}
    </g>
  );
}