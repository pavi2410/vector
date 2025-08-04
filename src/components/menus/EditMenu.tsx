import {
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from '@/components/ui/menubar';
import { 
  Undo2, 
  Redo2, 
  Copy, 
  Scissors, 
  Clipboard,
  Trash2,
  MousePointer,
  Square
} from 'lucide-react';
import { useStore } from '@nanostores/react';
import { selectionStore, clearSelection } from '@/stores/selection';
import { removeShape } from '@/stores/canvas';

export function EditMenu() {
  const { selectedIds } = useStore(selectionStore);
  
  const handleUndo = () => {
    console.log('Undo action');
  };

  const handleRedo = () => {
    console.log('Redo action');
  };

  const handleCut = () => {
    console.log('Cut action');
  };

  const handleCopy = () => {
    console.log('Copy action');
  };

  const handlePaste = () => {
    console.log('Paste action');
  };

  const handleDelete = () => {
    selectedIds.forEach(id => removeShape(id));
    clearSelection();
  };

  const handleSelectAll = () => {
    console.log('Select All action');
  };

  const handleDuplicate = () => {
    console.log('Duplicate action');
  };

  return (
    <MenubarContent align="start" className="w-56">
      <MenubarItem onClick={handleUndo}>
        <Undo2 className="w-4 h-4 mr-2" />
        Undo
        <MenubarShortcut>⌘Z</MenubarShortcut>
      </MenubarItem>
      
      <MenubarItem onClick={handleRedo}>
        <Redo2 className="w-4 h-4 mr-2" />
        Redo
        <MenubarShortcut>⌘⇧Z</MenubarShortcut>
      </MenubarItem>

      <MenubarSeparator />

      <MenubarItem onClick={handleCut}>
        <Scissors className="w-4 h-4 mr-2" />
        Cut
        <MenubarShortcut>⌘X</MenubarShortcut>
      </MenubarItem>

      <MenubarItem onClick={handleCopy}>
        <Copy className="w-4 h-4 mr-2" />
        Copy
        <MenubarShortcut>⌘C</MenubarShortcut>
      </MenubarItem>

      <MenubarItem onClick={handlePaste}>
        <Clipboard className="w-4 h-4 mr-2" />
        Paste
        <MenubarShortcut>⌘V</MenubarShortcut>
      </MenubarItem>

      <MenubarSeparator />

      <MenubarItem onClick={handleDelete}>
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
        <MenubarShortcut>Del</MenubarShortcut>
      </MenubarItem>

      <MenubarItem onClick={handleDuplicate}>
        <Square className="w-4 h-4 mr-2" />
        Duplicate
        <MenubarShortcut>⌘D</MenubarShortcut>
      </MenubarItem>

      <MenubarSeparator />

      <MenubarItem onClick={handleSelectAll}>
        <MousePointer className="w-4 h-4 mr-2" />
        Select All
        <MenubarShortcut>⌘A</MenubarShortcut>
      </MenubarItem>
    </MenubarContent>
  );
}