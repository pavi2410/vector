import {
  MenubarContent,
  MenubarCheckboxItem,
} from '@/components/ui/menubar';
import { Bug } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { debugStore, toggleDebugInfo } from '@/stores/debug';

export function DebugMenu() {
  const { showDebugInfo } = useStore(debugStore);

  return (
    <MenubarContent align="start" className="w-56">
      <MenubarCheckboxItem
        checked={showDebugInfo}
        onCheckedChange={toggleDebugInfo}
      >
        <Bug className="w-4 h-4 mr-2" />
        Show Debug Info
      </MenubarCheckboxItem>
    </MenubarContent>
  );
}