import { atom } from 'nanostores';
import type { TransformHandle } from '../types/tools';

export interface SelectionState {
  selectedIds: string[];
  selectedFrameIds: string[];
  transformHandle: TransformHandle | null;
}

export const selectionStore = atom<SelectionState>({
  selectedIds: [],
  selectedFrameIds: [],
  transformHandle: null
});

export const selectShape = (id: string, addToSelection = false) => {
  const current = selectionStore.get();
  if (addToSelection) {
    selectionStore.set({
      ...current,
      selectedIds: current.selectedIds.includes(id) 
        ? current.selectedIds.filter(selectedId => selectedId !== id)
        : [...current.selectedIds, id]
    });
  } else {
    selectionStore.set({
      ...current,
      selectedIds: [id]
    });
  }
};

export const selectMultiple = (ids: string[]) => {
  const current = selectionStore.get();
  selectionStore.set({
    ...current,
    selectedIds: ids
  });
};

export const clearSelection = () => {
  selectionStore.set({
    selectedIds: [],
    selectedFrameIds: [],
    transformHandle: null
  });
};

export const selectFrame = (id: string, addToSelection = false) => {
  const current = selectionStore.get();
  if (addToSelection) {
    selectionStore.set({
      ...current,
      selectedFrameIds: current.selectedFrameIds.includes(id) 
        ? current.selectedFrameIds.filter(selectedId => selectedId !== id)
        : [...current.selectedFrameIds, id],
      selectedIds: [] // Clear shape selection when selecting frames
    });
  } else {
    selectionStore.set({
      ...current,
      selectedFrameIds: [id],
      selectedIds: [] // Clear shape selection when selecting frames
    });
  }
};

export const setTransformHandle = (handle: TransformHandle | null) => {
  const current = selectionStore.get();
  selectionStore.set({
    ...current,
    transformHandle: handle
  });
};