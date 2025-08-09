import type { ToolType, TransformHandle } from './tools';

export interface EditorState {
  // Selection state
  selectedIds: string[];
  selectedFrameIds: string[];
  transformHandle: TransformHandle | null;
  
  // Interaction state
  hoveredId: string | null;
  editingTextId: string | null;
  
  // Tool state
  activeTool: ToolType;
  toolSettings: Record<string, any>;
  
  // UI state
  showLayers: boolean;
  showProperties: boolean;
  showGrid: boolean;
  showRulers: boolean;
  showGuides: boolean;
  showOutlines: boolean;
}

export type UIPanel = 'showLayers' | 'showProperties' | 'showGrid' | 'showRulers' | 'showGuides' | 'showOutlines';