import {
  MenubarContent,
  MenubarCheckboxItem,
  MenubarSeparator,
} from '@/components/ui/menubar';
import { IconBug, IconTags, IconSquare, IconHash } from '@tabler/icons-react';
import { useStore } from '@nanostores/react';
import { debugStore, toggleDebugInfo, toggleGroupLabels, toggleBounds, toggleZIndex } from '@/stores/debug';

export function DebugMenu() {
  const { showDebugInfo, showGroupLabels, showBounds, showZIndex } = useStore(debugStore);

  return (
    <MenubarContent align="start" className="w-56">
      <MenubarCheckboxItem
        checked={showDebugInfo}
        onCheckedChange={toggleDebugInfo}
      >
        <IconBug className="w-4 h-4 mr-2" />
        Show Debug Info
      </MenubarCheckboxItem>
      
      <MenubarSeparator />
      
      <MenubarCheckboxItem
        checked={showGroupLabels}
        onCheckedChange={toggleGroupLabels}
      >
        <IconTags className="w-4 h-4 mr-2" />
        Show Group Labels
      </MenubarCheckboxItem>
      
      <MenubarCheckboxItem
        checked={showBounds}
        onCheckedChange={toggleBounds}
      >
        <IconSquare className="w-4 h-4 mr-2" />
        Show Shape Bounds
      </MenubarCheckboxItem>
      
      <MenubarCheckboxItem
        checked={showZIndex}
        onCheckedChange={toggleZIndex}
      >
        <IconHash className="w-4 h-4 mr-2" />
        Show Z-Index
      </MenubarCheckboxItem>
    </MenubarContent>
  );
}