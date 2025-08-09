import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { type DragEndEvent } from '@dnd-kit/core';
import { canvasStore, removeShape, createGroup, ungroup, toggleShapeVisibility, toggleShapeLock, toggleGroupExpansion, moveToFront, moveToBack, moveForward, moveBackward } from '@/stores/canvas';
import { editorStore, selectShape, clearSelection, selectMultiple } from '@/stores/editorState';
import { buildLayerTree } from '@/utils/hierarchy';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Lock, Unlock, Trash2, MoreVertical, ChevronRight, ChevronDown, Folder, FolderOpen, Group as GroupIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { SortableTree } from '@/components/ui/SortableTree';
import type { LayerTreeItem, Shape } from '@/types/canvas';

interface LayerItemRendererProps {
  item: LayerTreeItem;
  selectedIds: string[];
  onSelect: (id: string, addToSelection?: boolean, mode?: 'single' | 'toggle' | 'range') => void;
  onToggleExpansion: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDelete: (id: string) => void;
  onGroup: (ids: string[]) => void;
  onUngroup: (id: string) => void;
  onSetRef?: (id: string, element: HTMLDivElement | null) => void;
}

function LayerItemRenderer({
  item,
  selectedIds,
  onSelect,
  onToggleExpansion,
  onToggleVisibility,
  onToggleLock,
  onDelete,
  onGroup,
  onUngroup,
  onSetRef,
}: LayerItemRendererProps) {
  const handleClick = (e: React.MouseEvent) => {
    const isModifierClick = e.metaKey || e.ctrlKey;
    const isShiftClick = e.shiftKey;
    
    if (isShiftClick && selectedIds.length > 0) {
      // Shift+Click: Range selection
      onSelect(item.id, false, 'range');
    } else if (isModifierClick) {
      // Cmd/Ctrl+Click: Toggle selection
      onSelect(item.id, true, 'toggle');
    } else {
      // Regular click: Single selection
      onSelect(item.id, false, 'single');
    }
  };

  const getShapeIcon = (shape: Shape) => {
    switch (shape.type) {
      case 'group':
        return shape.expanded ? <FolderOpen size={14} /> : <Folder size={14} />;
      case 'rectangle':
        return <div className="w-3 h-3 border border-current rounded-sm" />;
      case 'circle':
        return <div className="w-3 h-3 border border-current rounded-full" />;
      case 'line':
        return <div className="w-3 h-0 border-t border-current" />;
      case 'text':
        return <div className="text-xs font-bold">T</div>;
      default:
        return <div className="w-3 h-3 border border-current" />;
    }
  };

  const canGroup = selectedIds.length > 1 && selectedIds.includes(item.id);
  const canUngroup = item.shape.type === 'group' && selectedIds.includes(item.id);

  return (
    <div
      ref={(el) => onSetRef?.(item.id, el)}
      data-layer-item={item.id}
      className={cn(
        "flex items-center justify-between p-2 rounded-md cursor-pointer",
        "hover:bg-accent hover:text-accent-foreground text-sm",
        selectedIds.includes(item.id) && "bg-accent text-accent-foreground"
      )}
      style={{ paddingLeft: `${8 + item.depth * 16}px` }}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        {/* Expansion toggle for groups */}
        {item.shape.type === 'group' ? (
          <button
            className="p-0.5 hover:bg-background rounded"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpansion(item.id);
            }}
          >
            {item.shape.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>
        ) : (
          <div className="w-5" /> // Spacer for alignment
        )}
        
        {/* Shape icon */}
        <div className="flex-shrink-0 text-muted-foreground">
          {getShapeIcon(item.shape)}
        </div>
        
        {/* Shape name */}
        <span className="capitalize truncate">
          {item.shape.type === 'group' ? `Group (${item.shape.children?.length || 0})` : item.shape.type}
          {item.shape.type === 'text' && item.shape.text && `: ${item.shape.text}`}
        </span>
      </div>

      <div className="flex items-center space-x-1 flex-shrink-0">
        {/* Visibility toggle */}
        <button 
          className="p-1 hover:bg-background rounded"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(item.id);
          }}
          title={item.shape.visible === false ? "Show" : "Hide"}
        >
          {item.shape.visible === false ? <EyeOff size={12} /> : <Eye size={12} />}
        </button>
        
        {/* Lock toggle */}
        <button 
          className="p-1 hover:bg-background rounded"
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock(item.id);
          }}
          title={item.shape.locked ? "Unlock" : "Lock"}
        >
          {item.shape.locked ? <Lock size={12} /> : <Unlock size={12} />}
        </button>
        
        {/* More options menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="p-1 hover:bg-background rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical size={12} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canGroup && (
              <>
                <DropdownMenuItem onClick={() => onGroup(selectedIds)}>
                  <GroupIcon className="w-4 h-4 mr-2" />
                  Group
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            
            {canUngroup && (
              <>
                <DropdownMenuItem onClick={() => onUngroup(item.id)}>
                  <GroupIcon className="w-4 h-4 mr-2" />
                  Ungroup
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                Arrange
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => moveToFront(selectedIds)}>
                  Bring to Front
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => moveForward(selectedIds)}>
                  Bring Forward
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => moveBackward(selectedIds)}>
                  Send Backward
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => moveToBack(selectedIds)}>
                  Send to Back
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(item.id)}
              variant="destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// Utility to flatten layer tree for range selection
const getAllLayerItems = (items: LayerTreeItem[]): LayerTreeItem[] => {
  const result: LayerTreeItem[] = [];
  
  const traverse = (nodes: LayerTreeItem[]) => {
    for (const node of nodes) {
      result.push(node);
      if (node.children.length > 0) {
        traverse(node.children);
      }
    }
  };
  
  traverse(items);
  return result;
};

export function LayersPanel() {
  const { frame } = useStore(canvasStore);
  const { shapes } = frame;
  const { selectedIds } = useStore(editorStore);

  // Build hierarchical tree from flat shapes array
  const layerTree = buildLayerTree(shapes);
  
  // Box selection state
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Box selection handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start selection on empty area, not on items
    if ((e.target as HTMLElement).closest('[data-layer-item]')) {
      return;
    }
    
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const startPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    setSelectionStart(startPoint);
    setSelectionEnd(startPoint);
    setIsSelecting(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isSelecting) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const endPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    setSelectionEnd(endPoint);
    
    // Find items within selection box
    const selectionBox = {
      left: Math.min(selectionStart.x, endPoint.x),
      top: Math.min(selectionStart.y, endPoint.y),
      right: Math.max(selectionStart.x, endPoint.x),
      bottom: Math.max(selectionStart.y, endPoint.y)
    };
    
    const flatItems = getAllLayerItems(layerTree);
    const selectedInBox: string[] = [];
    
    flatItems.forEach(item => {
      const element = itemRefs.current.get(item.id);
      if (element) {
        const itemRect = element.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();
        
        const itemBox = {
          left: itemRect.left - containerRect.left,
          top: itemRect.top - containerRect.top,
          right: itemRect.right - containerRect.left,
          bottom: itemRect.bottom - containerRect.top
        };
        
        // Check if item intersects with selection box
        if (itemBox.right >= selectionBox.left &&
            itemBox.left <= selectionBox.right &&
            itemBox.bottom >= selectionBox.top &&
            itemBox.top <= selectionBox.bottom) {
          selectedInBox.push(item.id);
        }
      }
    });
    
    if (selectedInBox.length > 0) {
      selectMultiple(selectedInBox);
    }
  }, [isSelecting, selectionStart, layerTree]);

  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
  }, []);

  // Keyboard handlers for Select All
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
      e.preventDefault();
      const flatItems = getAllLayerItems(layerTree);
      const allIds = flatItems.map(item => item.id);
      selectMultiple(allIds);
    }
  }, [layerTree]);

  useEffect(() => {
    if (isSelecting) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isSelecting, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    // Add keyboard event listener for Select All
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // TODO: Implement drag reordering logic
      // This would involve updating z-indices and potentially parent-child relationships
      console.log('Drag from', active.id, 'to', over?.id);
    }
  };

  const handleSelect = (id: string, addToSelection = false, mode: 'single' | 'toggle' | 'range' = 'single') => {
    if (mode === 'range' && selectedIds.length > 0) {
      // Range selection: select from last selected to clicked item
      const flatItems = getAllLayerItems(layerTree);
      const currentIndex = flatItems.findIndex(item => item.id === id);
      const lastSelectedIndex = flatItems.findIndex(item => selectedIds.includes(item.id));
      
      if (currentIndex !== -1 && lastSelectedIndex !== -1) {
        const startIndex = Math.min(currentIndex, lastSelectedIndex);
        const endIndex = Math.max(currentIndex, lastSelectedIndex);
        const rangeIds = flatItems.slice(startIndex, endIndex + 1).map(item => item.id);
        selectMultiple(rangeIds);
      } else {
        selectShape(id, addToSelection);
      }
    } else {
      selectShape(id, addToSelection);
    }
  };

  const handleDeleteShape = (shapeId: string) => {
    removeShape(shapeId);
    if (selectedIds.includes(shapeId)) {
      clearSelection();
    }
  };

  const handleGroup = (ids: string[]) => {
    try {
      const groupId = createGroup(ids);
      selectShape(groupId);
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleUngroup = (groupId: string) => {
    try {
      const childIds = ungroup(groupId);
      selectMultiple(childIds);
    } catch (error) {
      console.error('Failed to ungroup:', error);
    }
  };

  const handleSetRef = useCallback((id: string, element: HTMLDivElement | null) => {
    if (element) {
      itemRefs.current.set(id, element);
    } else {
      itemRefs.current.delete(id);
    }
  }, []);

  const renderLayerItem = (item: LayerTreeItem) => (
    <LayerItemRenderer
      item={item}
      selectedIds={selectedIds}
      onSelect={handleSelect}
      onToggleExpansion={toggleGroupExpansion}
      onToggleVisibility={toggleShapeVisibility}
      onToggleLock={toggleShapeLock}
      onDelete={handleDeleteShape}
      onGroup={handleGroup}
      onUngroup={handleUngroup}
      onSetRef={handleSetRef}
    />
  );

  const selectionBoxStyle = isSelecting ? {
    position: 'absolute' as const,
    left: Math.min(selectionStart.x, selectionEnd.x),
    top: Math.min(selectionStart.y, selectionEnd.y),
    width: Math.abs(selectionEnd.x - selectionStart.x),
    height: Math.abs(selectionEnd.y - selectionStart.y),
    border: '1px solid rgb(59, 130, 246)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    pointerEvents: 'none' as const,
    zIndex: 1000,
  } : undefined;

  return (
    <div className="p-4">
      <div className="text-sm font-medium mb-3">Layers</div>
      
      <div 
        ref={containerRef}
        className="relative"
        onMouseDown={handleMouseDown}
        style={{ userSelect: 'none' }}
      >
        <SortableTree
          items={layerTree}
          onDragEnd={handleDragEnd}
          onRenderItem={renderLayerItem}
          emptyMessage="No layers yet"
          activationDistance={8}
        />
        
        {/* Selection box overlay */}
        {isSelecting && (
          <div style={selectionBoxStyle} />
        )}
      </div>
    </div>
  );
}