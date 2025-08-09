import { atom } from 'nanostores';

interface TextEditingState {
  editingShapeId: string | null;
}

export const textEditingStore = atom<TextEditingState>({
  editingShapeId: null
});

export const setTextEditing = (shapeId: string | null) => {
  textEditingStore.set({ editingShapeId: shapeId });
};