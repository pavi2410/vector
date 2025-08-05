import { useStore } from '@nanostores/react';
import { appearanceStore } from '@/stores/appearance';

export function useAppearance() {
  const appearance = useStore(appearanceStore);
  
  return {
    theme: appearance.theme,
    blur: appearance.blur,
  };
}