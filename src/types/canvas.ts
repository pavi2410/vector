export interface Shape {
  id: string;
  type: 'rectangle' | 'circle' | 'line' | 'text' | 'path';
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  rotation?: number;
  filters?: string[];
}

export interface Frame {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor?: string;
}

export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasState {
  shapes: Shape[];
  frames: Frame[];
  viewBox: ViewBox;
  zoom: number;
}