import { atom } from 'nanostores';
import type { EditorState, UIPanel } from '../types/editor';
import type { ToolType, TransformHandle } from '../types/tools';

export const editorStore = atom<EditorState>({
  // Selection state
  selectedIds: [],
  selectedFrameIds: [],
  transformHandle: null,
  
  // Interaction state
  hoveredId: null,
  editingTextId: null,
  
  // Tool state
  activeTool: 'select',
  toolSettings: {
    fill: '#3b82f6',
    stroke: '#1e40af',
    strokeWidth: 0,
    opacity: 1,
    // Text-specific defaults
    fontSize: 16,
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'start'
  },
  
  // UI state
  showLayers: true,
  showProperties: true,
  showGrid: false,
  showRulers: false,
  showGuides: true,
  showOutlines: false,
});

// Selection functions
export const selectShape = (id: string, addToSelection = false) => {
  const current = editorStore.get();
  if (addToSelection) {
    editorStore.set({
      ...current,
      selectedIds: current.selectedIds.includes(id) 
        ? current.selectedIds.filter(selectedId => selectedId !== id)
        : [...current.selectedIds, id],
      selectedFrameIds: [] // Clear frame selection when selecting shapes
    });
  } else {
    editorStore.set({
      ...current,
      selectedIds: [id],
      selectedFrameIds: [] // Clear frame selection when selecting shapes
    });
  }
};

export const selectMultiple = (ids: string[]) => {
  const current = editorStore.get();
  editorStore.set({
    ...current,
    selectedIds: ids,
    selectedFrameIds: [] // Clear frame selection when selecting shapes
  });
};

export const clearSelection = () => {
  const current = editorStore.get();
  editorStore.set({
    ...current,
    selectedIds: [],
    selectedFrameIds: [],
    transformHandle: null
  });
};

export const selectFrame = (id: string, addToSelection = false) => {
  const current = editorStore.get();
  if (addToSelection) {
    editorStore.set({
      ...current,
      selectedFrameIds: current.selectedFrameIds.includes(id) 
        ? current.selectedFrameIds.filter(selectedId => selectedId !== id)
        : [...current.selectedFrameIds, id],
      selectedIds: [] // Clear shape selection when selecting frames
    });
  } else {
    editorStore.set({
      ...current,
      selectedFrameIds: [id],
      selectedIds: [] // Clear shape selection when selecting frames
    });
  }
};

export const setTransformHandle = (handle: TransformHandle | null) => {
  const current = editorStore.get();
  editorStore.set({
    ...current,
    transformHandle: handle
  });
};

// Interaction functions
export const setHoveredShape = (id: string | null) => {
  const current = editorStore.get();
  editorStore.set({
    ...current,
    hoveredId: id
  });
};

export const setTextEditing = (shapeId: string | null) => {
  const current = editorStore.get();
  editorStore.set({
    ...current,
    editingTextId: shapeId
  });
};

// Tool functions
export const setActiveTool = (tool: ToolType) => {
  const current = editorStore.get();
  editorStore.set({
    ...current,
    activeTool: tool
  });
};

export const updateToolSettings = (settings: Record<string, any>) => {
  const current = editorStore.get();
  editorStore.set({
    ...current,
    toolSettings: { ...current.toolSettings, ...settings }
  });
};

// UI functions
export const togglePanel = (key: UIPanel) => {
  const current = editorStore.get();
  editorStore.set({
    ...current,
    [key]: !current[key]
  });
};

export const setPanelVisibility = (key: UIPanel, visible: boolean) => {
  const current = editorStore.get();
  editorStore.set({
    ...current,
    [key]: visible
  });
};