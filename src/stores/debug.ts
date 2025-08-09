import { atom } from 'nanostores';

export interface DebugState {
  showDebugInfo: boolean;
  showGroupLabels: boolean;
  showBounds: boolean;
  showZIndex: boolean;
}

export const debugStore = atom<DebugState>({
  showDebugInfo: false,
  showGroupLabels: false,
  showBounds: false,
  showZIndex: false,
});

export const toggleDebugInfo = () => {
  const current = debugStore.get();
  debugStore.set({
    ...current,
    showDebugInfo: !current.showDebugInfo,
  });
};

export const toggleGroupLabels = () => {
  const current = debugStore.get();
  debugStore.set({
    ...current,
    showGroupLabels: !current.showGroupLabels,
  });
};

export const toggleBounds = () => {
  const current = debugStore.get();
  debugStore.set({
    ...current,
    showBounds: !current.showBounds,
  });
};

export const toggleZIndex = () => {
  const current = debugStore.get();
  debugStore.set({
    ...current,
    showZIndex: !current.showZIndex,
  });
};