import { atom } from 'nanostores';

export interface DebugState {
  showDebugInfo: boolean;
}

export const debugStore = atom<DebugState>({
  showDebugInfo: false,
});

export const toggleDebugInfo = () => {
  const current = debugStore.get();
  debugStore.set({
    ...current,
    showDebugInfo: !current.showDebugInfo,
  });
};