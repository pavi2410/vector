import { type ReactNode, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

export interface TreeItem {
  id: string;
  children: TreeItem[];
  depth: number;
}

export interface SortableTreeItemProps<T extends TreeItem> {
  item: T;
  onRenderItem: (item: T) => ReactNode;
  onRenderChildren?: (children: T[]) => ReactNode;
}

function SortableTreeItem<T extends TreeItem>({ 
  item, 
  onRenderItem, 
  onRenderChildren 
}: SortableTreeItemProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {onRenderItem(item)}
      {onRenderChildren && item.children.length > 0 && (
        <div className="ml-4">
          {onRenderChildren(item.children as T[])}
        </div>
      )}
    </div>
  );
}

export interface SortableTreeProps<T extends TreeItem> {
  items: T[];
  onDragEnd?: (event: DragEndEvent) => void;
  onRenderItem: (item: T) => ReactNode;
  className?: string;
  emptyMessage?: string;
  activationDistance?: number;
}

export function SortableTree<T extends TreeItem>({
  items,
  onDragEnd,
  onRenderItem,
  className,
  emptyMessage = "No items",
  activationDistance = 8
}: SortableTreeProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: activationDistance,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Extract all items for sortable context (flattened)
  const allItems = useMemo(() => {
    const result: T[] = [];
    const traverse = (item: T) => {
      result.push(item);
      item.children.forEach(child => traverse(child as T));
    };
    items.forEach(traverse);
    return result;
  }, [items]);

  const handleDragEnd = (event: DragEndEvent) => {
    onDragEnd?.(event);
  };

  const renderChildren = (children: T[]): ReactNode => {
    return (children as T[]).map((child) => (
      <SortableTreeItem
        key={child.id}
        item={child}
        onRenderItem={onRenderItem}
        onRenderChildren={renderChildren}
      />
    ));
  };

  if (items.length === 0) {
    return (
      <div className={cn("text-muted-foreground text-sm py-4 text-center", className)}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={allItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
        <div className={cn("space-y-1", className)}>
          {items.map((item) => (
            <SortableTreeItem
              key={item.id}
              item={item}
              onRenderItem={onRenderItem}
              onRenderChildren={renderChildren}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}