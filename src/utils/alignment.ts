import type { Shape, Frame } from '@/types/canvas';

export interface AlignmentBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

export function getShapeBounds(shape: Shape): AlignmentBounds {
  const left = shape.x;
  const right = shape.x + shape.width;
  const top = shape.y;
  const bottom = shape.y + shape.height;
  const centerX = shape.x + shape.width / 2;
  const centerY = shape.y + shape.height / 2;

  return {
    left,
    right,
    top,
    bottom,
    centerX,
    centerY,
    width: shape.width,
    height: shape.height
  };
}

export function getCollectiveBounds(shapes: Shape[]): AlignmentBounds {
  if (shapes.length === 0) {
    return { left: 0, right: 0, top: 0, bottom: 0, centerX: 0, centerY: 0, width: 0, height: 0 };
  }

  const bounds = shapes.map(getShapeBounds);
  const left = Math.min(...bounds.map(b => b.left));
  const right = Math.max(...bounds.map(b => b.right));
  const top = Math.min(...bounds.map(b => b.top));
  const bottom = Math.max(...bounds.map(b => b.bottom));
  const width = right - left;
  const height = bottom - top;
  const centerX = left + width / 2;
  const centerY = top + height / 2;

  return {
    left,
    right,
    top,
    bottom,
    centerX,
    centerY,
    width,
    height
  };
}

export function alignLeft(shapes: Shape[], frame?: Frame): Array<{ id: string; updates: Partial<Shape> }> {
  // For single shape, align to frame left edge
  if (shapes.length === 1 && frame) {
    return [{
      id: shapes[0].id,
      updates: { x: 0 }
    }];
  }

  // For multiple shapes, align to collective bounds
  const collectiveBounds = getCollectiveBounds(shapes);
  const targetX = collectiveBounds.left;

  return shapes.map(shape => ({
    id: shape.id,
    updates: { x: targetX }
  }));
}

export function alignCenter(shapes: Shape[], frame?: Frame): Array<{ id: string; updates: Partial<Shape> }> {
  // For single shape, align to frame center
  if (shapes.length === 1 && frame) {
    return [{
      id: shapes[0].id,
      updates: { x: frame.width / 2 - shapes[0].width / 2 }
    }];
  }

  // For multiple shapes, align to collective bounds center
  const collectiveBounds = getCollectiveBounds(shapes);
  const targetCenterX = collectiveBounds.centerX;

  return shapes.map(shape => ({
    id: shape.id,
    updates: { x: targetCenterX - shape.width / 2 }
  }));
}

export function alignRight(shapes: Shape[], frame?: Frame): Array<{ id: string; updates: Partial<Shape> }> {
  // For single shape, align to frame right edge
  if (shapes.length === 1 && frame) {
    return [{
      id: shapes[0].id,
      updates: { x: frame.width - shapes[0].width }
    }];
  }

  // For multiple shapes, align to collective bounds right
  const collectiveBounds = getCollectiveBounds(shapes);
  const targetX = collectiveBounds.right;

  return shapes.map(shape => ({
    id: shape.id,
    updates: { x: targetX - shape.width }
  }));
}

export function alignTop(shapes: Shape[], frame?: Frame): Array<{ id: string; updates: Partial<Shape> }> {
  // For single shape, align to frame top edge
  if (shapes.length === 1 && frame) {
    return [{
      id: shapes[0].id,
      updates: { y: 0 }
    }];
  }

  // For multiple shapes, align to collective bounds top
  const collectiveBounds = getCollectiveBounds(shapes);
  const targetY = collectiveBounds.top;

  return shapes.map(shape => ({
    id: shape.id,
    updates: { y: targetY }
  }));
}

export function alignMiddle(shapes: Shape[], frame?: Frame): Array<{ id: string; updates: Partial<Shape> }> {
  // For single shape, align to frame middle
  if (shapes.length === 1 && frame) {
    return [{
      id: shapes[0].id,
      updates: { y: frame.height / 2 - shapes[0].height / 2 }
    }];
  }

  // For multiple shapes, align to collective bounds middle
  const collectiveBounds = getCollectiveBounds(shapes);
  const targetCenterY = collectiveBounds.centerY;

  return shapes.map(shape => ({
    id: shape.id,
    updates: { y: targetCenterY - shape.height / 2 }
  }));
}

export function alignBottom(shapes: Shape[], frame?: Frame): Array<{ id: string; updates: Partial<Shape> }> {
  // For single shape, align to frame bottom edge
  if (shapes.length === 1 && frame) {
    return [{
      id: shapes[0].id,
      updates: { y: frame.height - shapes[0].height }
    }];
  }

  // For multiple shapes, align to collective bounds bottom
  const collectiveBounds = getCollectiveBounds(shapes);
  const targetY = collectiveBounds.bottom;

  return shapes.map(shape => ({
    id: shape.id,
    updates: { y: targetY - shape.height }
  }));
}

export function distributeHorizontally(shapes: Shape[]): Array<{ id: string; updates: Partial<Shape> }> {
  if (shapes.length < 3) return [];

  const sortedShapes = [...shapes].sort((a, b) => a.x - b.x);
  const collectiveBounds = getCollectiveBounds(shapes);
  const leftmostShape = sortedShapes[0];
  
  const totalWidth = sortedShapes.reduce((sum, shape) => sum + shape.width, 0);
  const availableSpace = collectiveBounds.width - totalWidth;
  const spacing = availableSpace / (sortedShapes.length - 1);

  const updates: Array<{ id: string; updates: Partial<Shape> }> = [];
  let currentX = leftmostShape.x;

  sortedShapes.forEach((shape, index) => {
    if (index === 0) {
      // Keep leftmost shape in place
      return;
    }
    
    if (index === sortedShapes.length - 1) {
      // Keep rightmost shape in place
      return;
    }

    currentX += sortedShapes[index - 1].width + spacing;
    updates.push({
      id: shape.id,
      updates: { x: currentX }
    });
  });

  return updates;
}

export function distributeVertically(shapes: Shape[]): Array<{ id: string; updates: Partial<Shape> }> {
  if (shapes.length < 3) return [];

  const sortedShapes = [...shapes].sort((a, b) => a.y - b.y);
  const collectiveBounds = getCollectiveBounds(shapes);
  const topmostShape = sortedShapes[0];
  
  const totalHeight = sortedShapes.reduce((sum, shape) => sum + shape.height, 0);
  const availableSpace = collectiveBounds.height - totalHeight;
  const spacing = availableSpace / (sortedShapes.length - 1);

  const updates: Array<{ id: string; updates: Partial<Shape> }> = [];
  let currentY = topmostShape.y;

  sortedShapes.forEach((shape, index) => {
    if (index === 0) {
      // Keep topmost shape in place
      return;
    }
    
    if (index === sortedShapes.length - 1) {
      // Keep bottommost shape in place
      return;
    }

    currentY += sortedShapes[index - 1].height + spacing;
    updates.push({
      id: shape.id,
      updates: { y: currentY }
    });
  });

  return updates;
}