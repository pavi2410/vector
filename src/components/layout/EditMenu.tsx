import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

export function EditMenu() {
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
    console.log('Delete action');
  };

  const handleSelectAll = () => {
    console.log('Select All action');
  };

  const handleDuplicate = () => {
    console.log('Duplicate action');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-3 py-1 text-sm font-medium hover:bg-muted rounded transition-colors">
        Edit
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={handleUndo}>
          <Undo2 className="w-4 h-4 mr-2" />
          Undo
          <span className="ml-auto text-xs text-muted-foreground">⌘Z</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleRedo}>
          <Redo2 className="w-4 h-4 mr-2" />
          Redo
          <span className="ml-auto text-xs text-muted-foreground">⌘⇧Z</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCut}>
          <Scissors className="w-4 h-4 mr-2" />
          Cut
          <span className="ml-auto text-xs text-muted-foreground">⌘X</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopy}>
          <Copy className="w-4 h-4 mr-2" />
          Copy
          <span className="ml-auto text-xs text-muted-foreground">⌘C</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handlePaste}>
          <Clipboard className="w-4 h-4 mr-2" />
          Paste
          <span className="ml-auto text-xs text-muted-foreground">⌘V</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
          <span className="ml-auto text-xs text-muted-foreground">Del</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDuplicate}>
          <Square className="w-4 h-4 mr-2" />
          Duplicate
          <span className="ml-auto text-xs text-muted-foreground">⌘D</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSelectAll}>
          <MousePointer className="w-4 h-4 mr-2" />
          Select All
          <span className="ml-auto text-xs text-muted-foreground">⌘A</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}