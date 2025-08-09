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
  // Text-specific properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: 'start' | 'middle' | 'end';
}

export interface Frame {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor?: string;
  shapes: Shape[];
}


export interface CanvasState {
  frame: Frame;
}