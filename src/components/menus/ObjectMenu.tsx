import { useStore } from '@nanostores/react';
import {
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from '@/components/ui/menubar';
import { IconStack2, IconStackPop, IconLock, IconLockOpen, IconEye, IconEyeOff, IconArrowUp, IconArrowDown, IconArrowBigUp, IconArrowBigDown } from '@tabler/icons-react';
import { canvasStore, createGroup, ungroup, moveToFront, moveToBack, moveForward, moveBackward, toggleShapeVisibility, toggleShapeLock } from '@/stores/canvas';
import { editorStore, selectShape, selectMultiple } from '@/stores/editorState';

export function ObjectMenu() {
  const { frame } = useStore(canvasStore);
  const { selectedIds } = useStore(editorStore);

  // Get selected shapes for context-aware menu items
  const selectedShapes = frame.shapes.filter(s => selectedIds.includes(s.id));
  const hasSelection = selectedIds.length > 0;
  const canGroup = selectedIds.length > 1;
  const canUngroup = selectedIds.length === 1 && selectedShapes[0]?.type === 'group';
  const hasHiddenShapes = selectedShapes.some(s => s.visible === false);
  const hasLockedShapes = selectedShapes.some(s => s.locked === true);

  const handleGroup = () => {
    if (canGroup) {
      try {
        const groupId = createGroup(selectedIds);
        selectShape(groupId);
      } catch (error) {
        console.error('Failed to create group:', error);
      }
    }
  };

  const handleUngroup = () => {
    if (canUngroup) {
      try {
        const childIds = ungroup(selectedIds[0]);
        selectMultiple(childIds);
      } catch (error) {
        console.error('Failed to ungroup:', error);
      }
    }
  };

  const handleToggleVisibility = () => {
    selectedIds.forEach(id => toggleShapeVisibility(id));
  };

  const handleToggleLock = () => {
    selectedIds.forEach(id => toggleShapeLock(id));
  };

  const handleBringToFront = () => moveToFront(selectedIds);
  const handleBringForward = () => moveForward(selectedIds);
  const handleSendBackward = () => moveBackward(selectedIds);
  const handleSendToBack = () => moveToBack(selectedIds);

  return (
    <MenubarContent align="start" className="w-56">
      <MenubarItem onClick={handleGroup} disabled={!canGroup}>
        <IconStack2 className="w-4 h-4 mr-2" />
        Group
        <MenubarShortcut>⌘G</MenubarShortcut>
      </MenubarItem>
      
      <MenubarItem onClick={handleUngroup} disabled={!canUngroup}>
        <IconStackPop className="w-4 h-4 mr-2" />
        Ungroup
        <MenubarShortcut>⌘⇧G</MenubarShortcut>
      </MenubarItem>

      <MenubarSeparator />

      {/* Arrange options - inlined for better UX */}
      <MenubarItem onClick={handleBringToFront} disabled={!hasSelection}>
        <IconArrowBigUp className="w-4 h-4 mr-2" />
        Bring to Front
        <MenubarShortcut>⌘⇧]</MenubarShortcut>
      </MenubarItem>
      <MenubarItem onClick={handleBringForward} disabled={!hasSelection}>
        <IconArrowUp className="w-4 h-4 mr-2" />
        Bring Forward
        <MenubarShortcut>⌘]</MenubarShortcut>
      </MenubarItem>
      <MenubarItem onClick={handleSendBackward} disabled={!hasSelection}>
        <IconArrowDown className="w-4 h-4 mr-2" />
        Send Backward
        <MenubarShortcut>⌘[</MenubarShortcut>
      </MenubarItem>
      <MenubarItem onClick={handleSendToBack} disabled={!hasSelection}>
        <IconArrowBigDown className="w-4 h-4 mr-2" />
        Send to Back
        <MenubarShortcut>⌘⇧[</MenubarShortcut>
      </MenubarItem>

      <MenubarSeparator />

      <MenubarItem onClick={handleToggleLock} disabled={!hasSelection}>
        {hasLockedShapes ? (
          <>
            <IconLockOpen className="w-4 h-4 mr-2" />
            Unlock
            <MenubarShortcut>⌘⇧L</MenubarShortcut>
          </>
        ) : (
          <>
            <IconLock className="w-4 h-4 mr-2" />
            Lock
            <MenubarShortcut>⌘L</MenubarShortcut>
          </>
        )}
      </MenubarItem>

      <MenubarSeparator />

      <MenubarItem onClick={handleToggleVisibility} disabled={!hasSelection}>
        {hasHiddenShapes ? (
          <>
            <IconEye className="w-4 h-4 mr-2" />
            Show
            <MenubarShortcut>⌘⇧H</MenubarShortcut>
          </>
        ) : (
          <>
            <IconEyeOff className="w-4 h-4 mr-2" />
            Hide
            <MenubarShortcut>⌘H</MenubarShortcut>
          </>
        )}
      </MenubarItem>
    </MenubarContent>
  );
}
