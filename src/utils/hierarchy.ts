import type { Shape, LayerTreeItem } from '@/types/canvas';

/**
 * Build a hierarchical tree structure from flat shapes array
 */
export function buildLayerTree(shapes: Shape[]): LayerTreeItem[] {
  const shapeMap = new Map(shapes.map(s => [s.id, s]));
  const tree: LayerTreeItem[] = [];
  
  // Get root level shapes (no parentId)
  const rootShapes = shapes.filter(s => !s.parentId);
  
  // Sort root shapes by z-index (reversed for UI - higher z on top)
  const sortedRoots = [...rootShapes].sort((a, b) => b.z - a.z);
  
  function buildSubtree(shape: Shape, depth: number): LayerTreeItem {
    const children: LayerTreeItem[] = [];
    
    if (shape.type === 'group' && shape.children) {
      // Get child shapes and sort by z-index (reversed)
      const childShapes = shape.children
        .map(id => shapeMap.get(id))
        .filter((s): s is Shape => s !== undefined)
        .sort((a, b) => b.z - a.z);
      
      children.push(...childShapes.map(child => buildSubtree(child, depth + 1)));
    }
    
    return {
      id: shape.id,
      shape,
      children,
      depth
    };
  }
  
  tree.push(...sortedRoots.map(shape => buildSubtree(shape, 0)));
  
  return tree;
}

/**
 * Flatten hierarchy back to array maintaining z-order
 */
export function flattenHierarchy(tree: LayerTreeItem[]): Shape[] {
  const result: Shape[] = [];
  
  function flatten(items: LayerTreeItem[]) {
    // Process in reverse order to maintain z-index
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      result.push(item.shape);
      if (item.children.length > 0) {
        flatten(item.children);
      }
    }
  }
  
  flatten(tree);
  return result.reverse(); // Reverse to get proper z-order
}

/**
 * Get all children (recursive) of a shape
 */
export function getAllChildren(shapes: Shape[], parentId: string): Shape[] {
  const parent = shapes.find(s => s.id === parentId);
  if (!parent || parent.type !== 'group' || !parent.children) {
    return [];
  }
  
  const directChildren = shapes.filter(s => parent.children!.includes(s.id));
  const allChildren: Shape[] = [...directChildren];
  
  // Recursively get children of child groups
  directChildren.forEach(child => {
    if (child.type === 'group') {
      allChildren.push(...getAllChildren(shapes, child.id));
    }
  });
  
  return allChildren;
}

/**
 * Get direct children of a group
 */
export function getDirectChildren(shapes: Shape[], parentId: string): Shape[] {
  const parent = shapes.find(s => s.id === parentId);
  if (!parent || parent.type !== 'group' || !parent.children) {
    return [];
  }
  
  return shapes.filter(s => parent.children!.includes(s.id));
}

/**
 * Check if a shape can be dropped into a target (no circular references)
 */
export function canDropIntoTarget(shapes: Shape[], dragId: string, targetId: string): boolean {
  // Can't drop into itself
  if (dragId === targetId) return false;
  
  // Can't drop a parent into its own child
  const allChildren = getAllChildren(shapes, dragId);
  return !allChildren.some(child => child.id === targetId);
}

/**
 * Get the path from root to a shape (for breadcrumb display)
 */
export function getShapePath(shapes: Shape[], shapeId: string): Shape[] {
  const shapeMap = new Map(shapes.map(s => [s.id, s]));
  const path: Shape[] = [];
  
  let currentShape = shapeMap.get(shapeId);
  while (currentShape) {
    path.unshift(currentShape);
    currentShape = currentShape.parentId ? shapeMap.get(currentShape.parentId) : undefined;
  }
  
  return path;
}

/**
 * Find the root parent of a shape
 */
export function getRootParent(shapes: Shape[], shapeId: string): Shape {
  const shapeMap = new Map(shapes.map(s => [s.id, s]));
  let currentShape = shapeMap.get(shapeId);
  
  while (currentShape?.parentId) {
    const parent = shapeMap.get(currentShape.parentId);
    if (!parent) break;
    currentShape = parent;
  }
  
  return currentShape!;
}

/**
 * Validate hierarchy for circular references and orphaned children
 */
export function validateHierarchy(shapes: Shape[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const shapeMap = new Map(shapes.map(s => [s.id, s]));
  
  for (const shape of shapes) {
    // Check for circular references
    if (shape.parentId) {
      const visited = new Set<string>();
      let current = shape;
      
      while (current.parentId) {
        if (visited.has(current.id)) {
          errors.push(`Circular reference detected involving shape ${current.id}`);
          break;
        }
        
        visited.add(current.id);
        const parent = shapeMap.get(current.parentId);
        if (!parent) {
          errors.push(`Shape ${current.id} references non-existent parent ${current.parentId}`);
          break;
        }
        current = parent;
      }
    }
    
    // Check group children references
    if (shape.type === 'group' && shape.children) {
      for (const childId of shape.children) {
        const child = shapeMap.get(childId);
        if (!child) {
          errors.push(`Group ${shape.id} references non-existent child ${childId}`);
        } else if (child.parentId !== shape.id) {
          errors.push(`Child ${childId} doesn't reference parent group ${shape.id}`);
        }
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get siblings of a shape (shapes with same parent)
 */
export function getSiblings(shapes: Shape[], shapeId: string): Shape[] {
  const shape = shapes.find(s => s.id === shapeId);
  if (!shape) return [];
  
  return shapes.filter(s => 
    s.id !== shapeId && 
    s.parentId === shape.parentId
  );
}

/**
 * Get the insertion index for dropping a shape into a group
 */
export function getInsertionIndex(
  shapes: Shape[], 
  targetGroupId: string, 
  dropY: number, 
  itemHeight: number
): number {
  const children = getDirectChildren(shapes, targetGroupId);
  const sortedChildren = [...children].sort((a, b) => b.z - a.z);
  
  // Calculate which position to insert at based on Y coordinate
  const insertIndex = Math.floor(dropY / itemHeight);
  return Math.max(0, Math.min(insertIndex, sortedChildren.length));
}

/**
 * Check if a shape is an ancestor of another shape
 */
export function isAncestor(shapes: Shape[], ancestorId: string, descendantId: string): boolean {
  const shapeMap = new Map(shapes.map(s => [s.id, s]));
  let current = shapeMap.get(descendantId);
  
  while (current?.parentId) {
    if (current.parentId === ancestorId) return true;
    current = shapeMap.get(current.parentId);
  }
  
  return false;
}