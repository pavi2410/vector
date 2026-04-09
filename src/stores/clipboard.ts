import { atom } from 'nanostores';
import type { Shape } from '../types/canvas';

export interface ClipboardState {
  shapes: Shape[];
}

export const clipboardStore = atom<ClipboardState>({
  shapes: []
});

export const copyShapesToClipboard = (shapes: Shape[]) => {
  // Deep-clone so that subsequent mutations to original shapes don't corrupt
  // the clipboard, and pasting doesn't share nested object references.
  clipboardStore.set({ shapes: structuredClone(shapes) });
};

export const clearClipboard = () => {
  clipboardStore.set({ shapes: [] });
};
