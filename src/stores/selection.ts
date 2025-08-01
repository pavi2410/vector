import { atom } from 'nanostores';
import type { TransformHandle } from '../types/tools';

export interface SelectionState {
  selectedIds: string[];
  transformHandle: TransformHandle | null;
}

export const selectionStore = atom<SelectionState>({
  selectedIds: [],
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
    transformHandle: null
  });
};

export const setTransformHandle = (handle: TransformHandle | null) => {
  const current = selectionStore.get();
  selectionStore.set({
    ...current,
    transformHandle: handle
  });
};