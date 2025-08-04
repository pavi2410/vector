import { atom } from 'nanostores';
import type { CanvasState, Shape, Frame } from '../types/canvas';

export const canvasStore = atom<CanvasState>({
  shapes: [],
  frames: [
    {
      id: 'frame-1',
      name: 'Frame 1',
      x: 0,
      y: 0,
      width: 512,
      height: 512,
      backgroundColor: '#ffffff'
    }
  ],
  viewBox: { x: 0, y: 0, width: 512, height: 512 },
  zoom: 1
});

export const addShape = (shape: Shape) => {
  const current = canvasStore.get();
  canvasStore.set({
    ...current,
    shapes: [...current.shapes, shape]
  });
};

export const updateShape = (id: string, updates: Partial<Shape>) => {
  const current = canvasStore.get();
  canvasStore.set({
    ...current,
    shapes: current.shapes.map(shape => 
      shape.id === id ? { ...shape, ...updates } : shape
    )
  });
};

export const removeShape = (id: string) => {
  const current = canvasStore.get();
  canvasStore.set({
    ...current,
    shapes: current.shapes.filter(shape => shape.id !== id)
  });
};

export const setZoom = (zoom: number) => {
  const current = canvasStore.get();
  canvasStore.set({
    ...current,
    zoom: Math.max(0.1, Math.min(10, zoom))
  });
};

export const setViewBox = (x: number, y: number, width: number, height: number) => {
  const current = canvasStore.get();
  canvasStore.set({
    ...current,
    viewBox: { x, y, width, height }
  });
};

export const updateFrame = (id: string, updates: Partial<Omit<Frame, 'id'>>) => {
  const current = canvasStore.get();
  canvasStore.set({
    ...current,
    frames: current.frames.map(frame => 
      frame.id === id ? { ...frame, ...updates } : frame
    )
  });
};

export const addFrame = (frame: Frame) => {
  const current = canvasStore.get();
  canvasStore.set({
    ...current,
    frames: [...current.frames, frame]
  });
};

export const removeFrame = (id: string) => {
  const current = canvasStore.get();
  canvasStore.set({
    ...current,
    frames: current.frames.filter(frame => frame.id !== id)
  });
};

