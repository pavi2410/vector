import {
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from '@/components/ui/menubar';
import { 
  Group, 
  Ungroup, 
  Lock, 
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';

export function ObjectMenu() {
  const handleGroup = () => console.log('Group action');
  const handleUngroup = () => console.log('Ungroup action');
  const handleLock = () => console.log('Lock action');
  const handleUnlock = () => console.log('Unlock action');
  const handleHide = () => console.log('Hide action');
  const handleShow = () => console.log('Show action');

  return (
    <MenubarContent align="start" className="w-56">
      <MenubarItem onClick={handleGroup}>
        <Group className="w-4 h-4 mr-2" />
        Group
        <MenubarShortcut>⌘G</MenubarShortcut>
      </MenubarItem>
      
      <MenubarItem onClick={handleUngroup}>
        <Ungroup className="w-4 h-4 mr-2" />
        Ungroup
        <MenubarShortcut>⌘⇧G</MenubarShortcut>
      </MenubarItem>

      <MenubarSeparator />

      <MenubarItem onClick={handleLock}>
        <Lock className="w-4 h-4 mr-2" />
        Lock
        <MenubarShortcut>⌘L</MenubarShortcut>
      </MenubarItem>

      <MenubarItem onClick={handleUnlock}>
        <Unlock className="w-4 h-4 mr-2" />
        Unlock
        <MenubarShortcut>⌘⇧L</MenubarShortcut>
      </MenubarItem>

      <MenubarSeparator />

      <MenubarItem onClick={handleHide}>
        <EyeOff className="w-4 h-4 mr-2" />
        Hide
        <MenubarShortcut>⌘H</MenubarShortcut>
      </MenubarItem>

      <MenubarItem onClick={handleShow}>
        <Eye className="w-4 h-4 mr-2" />
        Show All
        <MenubarShortcut>⌘⇧H</MenubarShortcut>
      </MenubarItem>
    </MenubarContent>
  );
}
