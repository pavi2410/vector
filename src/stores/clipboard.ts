import { atom } from 'nanostores';
import type { Shape } from '../types/canvas';

export interface ClipboardState {
  shapes: Shape[];
}

export const clipboardStore = atom<ClipboardState>({
  shapes: []
});

export const copyShapesToClipboard = (shapes: Shape[]) => {
  clipboardStore.set({ shapes: [...shapes] });
};

export const clearClipboard = () => {
  clipboardStore.set({ shapes: [] });
};
