import { atom } from 'nanostores';
import type { CanvasState, Shape, Frame } from '../types/canvas';

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
  canvasStore.set({
    ...current,
    frame: {
      ...current.frame,
      shapes: [...current.frame.shapes, shape]
    }
  });
};

export const addShapes = (shapes: Shape[]) => {
  const current = canvasStore.get();
  canvasStore.set({
    ...current,
    frame: {
      ...current.frame,
      shapes: [...current.frame.shapes, ...shapes]
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

