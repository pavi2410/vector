import { atom } from 'nanostores';

export interface MouseState {
  x: number;
  y: number;
  screenX: number;
  screenY: number;
}

export const mouseStore = atom<MouseState>({
  x: 0,
  y: 0,
  screenX: 0,
  screenY: 0
});

export const setMousePosition = (x: number, y: number, screenX: number, screenY: number) => {
  mouseStore.set({ x, y, screenX, screenY });
};
