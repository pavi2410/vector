import { map } from 'nanostores';

export const uiStore = map({
  showLayers: true,
  showProperties: true,
  showGrid: false,
  showRulers: false,
  showGuides: true,
  showOutlines: false,
});

export const togglePanel = (key: keyof typeof uiStore.value) => {
  uiStore.setKey(key, !uiStore.get()[key]);
};