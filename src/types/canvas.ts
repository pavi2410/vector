export interface Shape {
  id: string;
  type: 'rectangle' | 'circle' | 'line' | 'text' | 'path' | 'group';
  x: number;
  y: number;
  width: number;
  height: number;
  z: number; // Z-index for layering (higher = on top)
  parentId?: string; // ID of parent group
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  rotation?: number;
  filters?: string[];
  // Group-specific properties
  children?: string[]; // IDs of child shapes (only for groups)
  expanded?: boolean; // UI state for group expansion in layer tree
  // Text-specific properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: 'start' | 'middle' | 'end';
  // Visibility and interaction
  visible?: boolean;
  locked?: boolean;
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

// Layer tree types for UI
export interface LayerTreeItem {
  id: string;
  shape: Shape;
  children: LayerTreeItem[];
  depth: number;
}

// Helper type for group operations
export type Group = Shape & {
  type: 'group';
  children: string[];
};