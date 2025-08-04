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
import { selectionStore, clearSelection, selectMultiple } from '@/stores/selection';
import { canvasStore, removeShape, addShapes } from '@/stores/canvas';
import { clipboardStore, copyShapesToClipboard } from '@/stores/clipboard';

export function EditMenu() {
  const { selectedIds } = useStore(selectionStore);
  const { shapes } = useStore(canvasStore);
  const { shapes: clipboardShapes } = useStore(clipboardStore);
  
  const selectedShapes = shapes.filter(shape => selectedIds.includes(shape.id));
  
  const handleUndo = () => {
    console.log('Undo action');
  };

  const handleRedo = () => {
    console.log('Redo action');
  };

  const handleCut = () => {
    if (selectedShapes.length > 0) {
      // Copy selected shapes to clipboard
      copyShapesToClipboard(selectedShapes);
      // Remove selected shapes from canvas
      selectedIds.forEach(id => removeShape(id));
      clearSelection();
    }
  };

  const handleCopy = () => {
    if (selectedShapes.length > 0) {
      copyShapesToClipboard(selectedShapes);
    }
  };

  const handlePaste = () => {
    if (clipboardShapes.length > 0) {
      // Generate new IDs for pasted shapes and offset their position
      const offset = 20; // Offset pasted shapes by 20px
      const pastedShapes = clipboardShapes.map((shape, index) => ({
        ...shape,
        id: `${shape.type}-${Date.now()}-${index}`,
        x: shape.x + offset,
        y: shape.y + offset,
      }));
      
      // Add pasted shapes to canvas
      addShapes(pastedShapes);
      
      // Select the pasted shapes
      const pastedIds = pastedShapes.map(shape => shape.id);
      selectMultiple(pastedIds);
    }
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

      <MenubarItem onClick={handleCut} disabled={selectedShapes.length === 0}>
        <Scissors className="w-4 h-4 mr-2" />
        Cut
        <MenubarShortcut>⌘X</MenubarShortcut>
      </MenubarItem>

      <MenubarItem onClick={handleCopy} disabled={selectedShapes.length === 0}>
        <Copy className="w-4 h-4 mr-2" />
        Copy
        <MenubarShortcut>⌘C</MenubarShortcut>
      </MenubarItem>

      <MenubarItem onClick={handlePaste} disabled={clipboardShapes.length === 0}>
        <Clipboard className="w-4 h-4 mr-2" />
        Paste
        <MenubarShortcut>⌘V</MenubarShortcut>
      </MenubarItem>

      <MenubarSeparator />

      <MenubarItem onClick={handleDelete} disabled={selectedShapes.length === 0}>
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