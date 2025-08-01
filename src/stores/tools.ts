import { atom } from 'nanostores';
import type { ToolState, ToolType } from '../types/tools';

export const toolStore = atom<ToolState>({
  activeTool: 'select',
  toolSettings: {
    fill: '#3b82f6',
    stroke: '#1e40af',
    strokeWidth: 2,
    opacity: 1
  }
});

export const setActiveTool = (tool: ToolType) => {
  const current = toolStore.get();
  toolStore.set({
    ...current,
    activeTool: tool
  });
};

export const updateToolSettings = (settings: Record<string, any>) => {
  const current = toolStore.get();
  toolStore.set({
    ...current,
    toolSettings: { ...current.toolSettings, ...settings }
  });
};