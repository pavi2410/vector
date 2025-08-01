export type ToolType = 'select' | 'rectangle' | 'circle' | 'line' | 'text' | 'path';

export interface ToolState {
  activeTool: ToolType;
  toolSettings: Record<string, any>;
}

export interface TransformHandle {
  type: 'resize' | 'rotate' | 'move';
  direction?: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';
}