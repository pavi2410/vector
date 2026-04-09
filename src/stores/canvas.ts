import { atom } from 'nanostores';
import type { CanvasState, Shape, Frame, Group } from '../types/canvas';
import { getNextZIndex, moveShapeZ, assignGroupZIndices } from '../utils/zIndex';

export const canvasStore = atom<CanvasState>({
  frame: {
    id: 'frame-1',
    name: 'Frame 1',
    width: 512,
    height: 512,
    backgroundColor: '#ffffff',
    shapes: []
  }
});

export const addShape = (shape: Shape) => {
  const current = canvasStore.get();
  const shapeWithZ = {
    ...shape,
    z: shape.z ?? getNextZIndex(current.frame.shapes),
    visible: shape.visible ?? true,
    locked: shape.locked ?? false
  };
  
  canvasStore.set({
    ...current,
    frame: {
      ...current.frame,
      shapes: [...current.frame.shapes, shapeWithZ]
    }
  });
};

export const addShapes = (shapes: Shape[]) => {
  const current = canvasStore.get();
  const shapesWithZ = shapes.map(shape => ({
    ...shape,
    z: shape.z ?? getNextZIndex([...current.frame.shapes, ...shapes.slice(0, shapes.indexOf(shape))]),
    visible: shape.visible ?? true,
    locked: shape.locked ?? false
  }));
  
  canvasStore.set({
    ...current,
    frame: {
      ...current.frame,
      shapes: [...current.frame.shapes, ...shapesWithZ]
    }
  });
};

export const updateShape = (id: string, updates: Partial<Shape>) => {
  const current = canvasStore.get();
  canvasStore.set({
    ...current,
    frame: {
      ...current.frame,
      shapes: current.frame.shapes.map(shape => 
        shape.id === id ? { ...shape, ...updates } : shape
      )
    }
  });
};

export const updateMultipleShapes = (updates: Array<{ id: string; updates: Partial<Shape> }>) => {
  const current = canvasStore.get();
  const updateMap = new Map(updates.map(({ id, updates }) => [id, updates]));
  
  canvasStore.set({
    ...current,
    frame: {
      ...current.frame,
      shapes: current.frame.shapes.map(shape => {
        const shapeUpdates = updateMap.get(shape.id);
        return shapeUpdates ? { ...shape, ...shapeUpdates } : shape;
      })
    }
  });
};

export const removeShape = (id: string) => {
  const current = canvasStore.get();
  canvasStore.set({
    ...current,
    frame: {
      ...current.frame,
      shapes: current.frame.shapes.filter(shape => shape.id !== id)
    }
  });
};

export const updateFrame = (updates: Partial<Omit<Frame, 'id' | 'shapes'>>) => {
  const current = canvasStore.get();
  canvasStore.set({
    ...current,
    frame: {
      ...current.frame,
      ...updates
    }
  });
};

export const setFrame = (frame: Frame) => {
  canvasStore.set({
    frame
  });
};

// Group operations
export const createGroup = (shapeIds: string[]): string => {
  if (shapeIds.length < 2) {
    throw new Error('Cannot create group with less than 2 shapes');
  }
  
  const current = canvasStore.get();
  const shapes = current.frame.shapes;
  const selectedShapes = shapes.filter(s => shapeIds.includes(s.id));
  
  if (selectedShapes.length !== shapeIds.length) {
    throw new Error('Some shapes not found');
  }
  
  // Calculate group bounds
  const bounds = selectedShapes.reduce(
    (acc, shape) => ({
      left: Math.min(acc.left, shape.x),
      top: Math.min(acc.top, shape.y),
      right: Math.max(acc.right, shape.x + shape.width),
      bottom: Math.max(acc.bottom, shape.y + shape.height),
    }),
    {
      left: Infinity,
      top: Infinity,
      right: -Infinity,
      bottom: -Infinity,
    }
  );
  
  const groupId = `group-${Date.now()}`;
  const groupZ = Math.max(...selectedShapes.map(s => s.z)) + 1;
  
  // Create group shape
  const group: Group = {
    id: groupId,
    type: 'group',
    x: bounds.left,
    y: bounds.top,
    width: bounds.right - bounds.left,
    height: bounds.bottom - bounds.top,
    z: groupZ,
    children: shapeIds,
    expanded: true,
    visible: true,
    locked: false,
  };
  
  // Update children to reference parent and assign sub z-indices
  const updatedShapes = assignGroupZIndices(
    shapes.map(shape => {
      if (shapeIds.includes(shape.id)) {
        return { ...shape, parentId: groupId };
      }
      return shape;
    }),
    groupId,
    shapeIds
  );
  
  canvasStore.set({
    ...current,
    frame: {
      ...current.frame,
      shapes: [...updatedShapes, group]
    }
  });
  
  return groupId;
};

export const ungroup = (groupId: string): string[] => {
  const current = canvasStore.get();
  const shapes = current.frame.shapes;
  const group = shapes.find(s => s.id === groupId);
  
  if (!group || group.type !== 'group' || !group.children) {
    throw new Error('Group not found or invalid');
  }
  
  const childIds = group.children;
  const groupZ = group.z;
  
  // Remove group and update children
  const updatedShapes = shapes
    .filter(s => s.id !== groupId)
    .map(shape => {
      if (childIds.includes(shape.id)) {
        return {
          ...shape,
          parentId: group.parentId, // Inherit group's parent
          z: groupZ // Move to group's z-level
        };
      }
      return shape;
    });
  
  canvasStore.set({
    ...current,
    frame: {
      ...current.frame,
      shapes: updatedShapes
    }
  });
  
  return childIds;
};

export const addToGroup = (groupId: string, shapeIds: string[]): void => {
  const current = canvasStore.get();
  const shapes = current.frame.shapes;
  const group = shapes.find(s => s.id === groupId) as Group;
  
  if (!group || group.type !== 'group') {
    throw new Error('Group not found');
  }
  
  const newChildren = [...(group.children || []), ...shapeIds];
  
  // Update group bounds and children
  const allChildren = shapes.filter(s => newChildren.includes(s.id));
  const bounds = allChildren.reduce(
    (acc, shape) => ({
      left: Math.min(acc.left, shape.x),
      top: Math.min(acc.top, shape.y),
      right: Math.max(acc.right, shape.x + shape.width),
      bottom: Math.max(acc.bottom, shape.y + shape.height),
    }),
    {
      left: Infinity,
      top: Infinity,
      right: -Infinity,
      bottom: -Infinity,
    }
  );
  
  const updatedShapes = assignGroupZIndices(
    shapes.map(shape => {
      if (shape.id === groupId) {
        return {
          ...shape,
          children: newChildren,
          x: bounds.left,
          y: bounds.top,
          width: bounds.right - bounds.left,
          height: bounds.bottom - bounds.top,
        };
      }
      if (shapeIds.includes(shape.id)) {
        return { ...shape, parentId: groupId };
      }
      return shape;
    }),
    groupId,
    newChildren
  );
  
  canvasStore.set({
    ...current,
    frame: {
      ...current.frame,
      shapes: updatedShapes
    }
  });
};

export const removeFromGroup = (shapeIds: string[]): void => {
  const current = canvasStore.get();
  const shapes = current.frame.shapes;
  
  // Find shapes to remove and their parent groups
  const shapesToRemove = shapes.filter(s => shapeIds.includes(s.id));
  const affectedGroups = new Set(shapesToRemove.map(s => s.parentId).filter(Boolean));
  
  const updatedShapes = shapes.map(shape => {
    // Remove parent reference from shapes
    if (shapeIds.includes(shape.id)) {
      return { ...shape, parentId: undefined };
    }
    
    // Update group children arrays and recalculate bounds
    if (affectedGroups.has(shape.id) && shape.type === 'group' && shape.children) {
      const newChildren = shape.children.filter(id => !shapeIds.includes(id));
      if (newChildren.length === 0) {
        // Empty group — remove it entirely below
        return { ...shape, children: newChildren };
      }
      // Recalculate group bounds based on remaining children
      const remainingChildren = shapes.filter(s => newChildren.includes(s.id));
      const bounds = remainingChildren.reduce(
        (acc, s) => ({
          left: Math.min(acc.left, s.x),
          top: Math.min(acc.top, s.y),
          right: Math.max(acc.right, s.x + s.width),
          bottom: Math.max(acc.bottom, s.y + s.height),
        }),
        { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
      );
      return {
        ...shape,
        children: newChildren,
        x: bounds.left,
        y: bounds.top,
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top,
      };
    }
    
    return shape;
  });

  // Remove groups that are now empty
  const shapesWithoutEmptyGroups = updatedShapes.filter(
    s => !(s.type === 'group' && s.children && s.children.length === 0)
  );
  
  canvasStore.set({
    ...current,
    frame: {
      ...current.frame,
      shapes: shapesWithoutEmptyGroups
    }
  });
};

// Layer arrangement operations
export const moveToFront = (shapeIds: string[]): void => {
  const current = canvasStore.get();
  let shapes = current.frame.shapes;
  
  shapeIds.forEach(id => {
    shapes = moveShapeZ(shapes, id, 'front');
  });
  
  canvasStore.set({
    ...current,
    frame: {
      ...current.frame,
      shapes
    }
  });
};

export const moveToBack = (shapeIds: string[]): void => {
  const current = canvasStore.get();
  let shapes = current.frame.shapes;
  
  shapeIds.forEach(id => {
    shapes = moveShapeZ(shapes, id, 'back');
  });
  
  canvasStore.set({
    ...current,
    frame: {
      ...current.frame,
      shapes
    }
  });
};

export const moveForward = (shapeIds: string[]): void => {
  const current = canvasStore.get();
  let shapes = current.frame.shapes;
  
  shapeIds.forEach(id => {
    shapes = moveShapeZ(shapes, id, 'forward');
  });
  
  canvasStore.set({
    ...current,
    frame: {
      ...current.frame,
      shapes
    }
  });
};

export const moveBackward = (shapeIds: string[]): void => {
  const current = canvasStore.get();
  let shapes = current.frame.shapes;
  
  shapeIds.forEach(id => {
    shapes = moveShapeZ(shapes, id, 'backward');
  });
  
  canvasStore.set({
    ...current,
    frame: {
      ...current.frame,
      shapes
    }
  });
};

// Shape visibility and locking
export const toggleShapeVisibility = (shapeId: string): void => {
  const current = canvasStore.get();
  updateShape(shapeId, { 
    visible: !(current.frame.shapes.find(s => s.id === shapeId)?.visible ?? true)
  });
};

export const toggleShapeLock = (shapeId: string): void => {
  const current = canvasStore.get();
  updateShape(shapeId, { 
    locked: !(current.frame.shapes.find(s => s.id === shapeId)?.locked ?? false)
  });
};

export const toggleGroupExpansion = (groupId: string): void => {
  const current = canvasStore.get();
  const group = current.frame.shapes.find(s => s.id === groupId);
  if (group && group.type === 'group') {
    updateShape(groupId, { expanded: !group.expanded });
  }
};

