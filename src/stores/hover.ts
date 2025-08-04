import { atom } from 'nanostores';

export interface HoverState {
  hoveredId: string | null;
}

export const hoverStore = atom<HoverState>({
  hoveredId: null
});

export const setHoveredShape = (id: string | null) => {
  hoverStore.set({ hoveredId: id });
};
