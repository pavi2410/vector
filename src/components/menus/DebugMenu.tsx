import {
  MenubarContent,
  MenubarCheckboxItem,
  MenubarSeparator,
} from '@/components/ui/menubar';
import { Bug, Tags, Square, Hash } from 'lucide-react';
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
        <Bug className="w-4 h-4 mr-2" />
        Show Debug Info
      </MenubarCheckboxItem>
      
      <MenubarSeparator />
      
      <MenubarCheckboxItem
        checked={showGroupLabels}
        onCheckedChange={toggleGroupLabels}
      >
        <Tags className="w-4 h-4 mr-2" />
        Show Group Labels
      </MenubarCheckboxItem>
      
      <MenubarCheckboxItem
        checked={showBounds}
        onCheckedChange={toggleBounds}
      >
        <Square className="w-4 h-4 mr-2" />
        Show Shape Bounds
      </MenubarCheckboxItem>
      
      <MenubarCheckboxItem
        checked={showZIndex}
        onCheckedChange={toggleZIndex}
      >
        <Hash className="w-4 h-4 mr-2" />
        Show Z-Index
      </MenubarCheckboxItem>
    </MenubarContent>
  );
}