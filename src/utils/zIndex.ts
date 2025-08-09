import type { Shape } from '@/types/canvas';

// Z-index constants
export const Z_INDEX_STEP = 100; // Space between z-indices for easy insertion
export const Z_INDEX_GROUP_OFFSET = 0.1; // Offset for children within groups

/**
 * Sort shapes by z-index in ascending order (bottom to top)
 */
export function sortShapesByZ(shapes: Shape[]): Shape[] {
  return [...shapes].sort((a, b) => a.z - b.z);
}

/**
 * Get the range of z-indices for a set of shapes
 */
export function getZRange(shapes: Shape[]): { min: number; max: number } {
  if (shapes.length === 0) return { min: 0, max: 0 };
  
  const zValues = shapes.map(s => s.z);
  return {
    min: Math.min(...zValues),
    max: Math.max(...zValues)
  };
}

/**
 * Get the next available z-index (highest + step)
 */
export function getNextZIndex(shapes: Shape[]): number {
  if (shapes.length === 0) return Z_INDEX_STEP;
  
  const { max } = getZRange(shapes);
  return max + Z_INDEX_STEP;
}

/**
 * Clean up and reassign z-indices with proper gaps
 */
export function reassignZIndices(shapes: Shape[]): Shape[] {
  const sorted = sortShapesByZ(shapes);
  return sorted.map((shape, index) => ({
    ...shape,
    z: (index + 1) * Z_INDEX_STEP
  }));
}

/**
 * Move a shape to a specific z-position relative to others
 */
export function moveShapeZ(
  shapes: Shape[], 
  shapeId: string, 
  direction: 'front' | 'back' | 'forward' | 'backward'
): Shape[] {
  const shapeIndex = shapes.findIndex(s => s.id === shapeId);
  if (shapeIndex === -1) return shapes;
  
  const shape = shapes[shapeIndex];
  const { min, max } = getZRange(shapes);
  
  let newZ: number;
  
  switch (direction) {
    case 'front':
      newZ = max + Z_INDEX_STEP;
      break;
    case 'back':
      newZ = min - Z_INDEX_STEP;
      break;
    case 'forward': {
      // Find the next higher z-value
      const sorted = sortShapesByZ(shapes.filter(s => s.id !== shapeId));
      const higherShapes = sorted.filter(s => s.z > shape.z);
      if (higherShapes.length === 0) {
        newZ = max + Z_INDEX_STEP;
      } else {
        const nextZ = higherShapes[0].z;
        newZ = nextZ + Z_INDEX_STEP;
      }
      break;
    }
    case 'backward': {
      // Find the next lower z-value
      const sorted = sortShapesByZ(shapes.filter(s => s.id !== shapeId));
      const lowerShapes = sorted.filter(s => s.z < shape.z);
      if (lowerShapes.length === 0) {
        newZ = min - Z_INDEX_STEP;
      } else {
        const prevZ = lowerShapes[lowerShapes.length - 1].z;
        newZ = prevZ - Z_INDEX_STEP;
      }
      break;
    }
    default:
      return shapes;
  }
  
  return shapes.map(s => 
    s.id === shapeId ? { ...s, z: newZ } : s
  );
}

/**
 * Assign z-indices to shapes being grouped
 * Group gets a z-index, children get sub-indices within the group range
 */
export function assignGroupZIndices(
  shapes: Shape[],
  groupId: string,
  childIds: string[]
): Shape[] {
  const groupShape = shapes.find(s => s.id === groupId);
  if (!groupShape) return shapes;
  
  const groupZ = groupShape.z;
  
  return shapes.map(shape => {
    if (shape.id === groupId) {
      return shape; // Group keeps its z-index
    }
    
    if (childIds.includes(shape.id)) {
      // Children get sub-indices within the group range
      const childIndex = childIds.indexOf(shape.id);
      return {
        ...shape,
        z: groupZ + (childIndex + 1) * Z_INDEX_GROUP_OFFSET
      };
    }
    
    return shape;
  });
}

/**
 * Get shapes that should be rendered (visible and not children of collapsed groups)
 */
export function getVisibleShapes(shapes: Shape[]): Shape[] {
  const shapeMap = new Map(shapes.map(s => [s.id, s]));
  
  return shapes.filter(shape => {
    // Skip if explicitly hidden
    if (shape.visible === false) return false;
    
    // If shape has a parent, check if parent chain is visible and expanded
    let currentParentId = shape.parentId;
    while (currentParentId) {
      const parent = shapeMap.get(currentParentId);
      if (!parent) break;
      
      // If parent is hidden or collapsed, this shape is not visible
      if (parent.visible === false || parent.expanded === false) {
        return false;
      }
      
      currentParentId = parent.parentId;
    }
    
    return true;
  });
}

/**
 * Get shapes sorted by z-index and filtered for visibility
 */
export function getRenderableShapes(shapes: Shape[]): Shape[] {
  const visibleShapes = getVisibleShapes(shapes);
  return sortShapesByZ(visibleShapes);
}