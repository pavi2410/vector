import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Group, 
  Ungroup, 
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ArrowUpToLine,
  ArrowDownToLine,
  FlipHorizontal,
  FlipVertical,
  RotateCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';

export function ObjectMenu() {
  const handleGroup = () => {
    console.log('Group objects');
  };

  const handleUngroup = () => {
    console.log('Ungroup objects');
  };

  const handleLock = () => {
    console.log('Lock object');
  };

  const handleUnlock = () => {
    console.log('Unlock object');
  };

  const handleHide = () => {
    console.log('Hide object');
  };

  const handleShow = () => {
    console.log('Show object');
  };

  const handleBringToFront = () => {
    console.log('Bring to front');
  };

  const handleSendToBack = () => {
    console.log('Send to back');
  };

  const handleBringForward = () => {
    console.log('Bring forward');
  };

  const handleSendBackward = () => {
    console.log('Send backward');
  };

  const handleFlipHorizontal = () => {
    console.log('Flip horizontal');
  };

  const handleFlipVertical = () => {
    console.log('Flip vertical');
  };

  const handleRotate90 = () => {
    console.log('Rotate 90°');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-3 py-1 text-sm font-medium hover:bg-muted rounded transition-colors">
        Object
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={handleGroup}>
          <Group className="w-4 h-4 mr-2" />
          Group
          <span className="ml-auto text-xs text-muted-foreground">⌘G</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleUngroup}>
          <Ungroup className="w-4 h-4 mr-2" />
          Ungroup
          <span className="ml-auto text-xs text-muted-foreground">⌘⇧G</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLock}>
          <Lock className="w-4 h-4 mr-2" />
          Lock
          <span className="ml-auto text-xs text-muted-foreground">⌘L</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleUnlock}>
          <Unlock className="w-4 h-4 mr-2" />
          Unlock All
          <span className="ml-auto text-xs text-muted-foreground">⌘⇧L</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleHide}>
          <EyeOff className="w-4 h-4 mr-2" />
          Hide
          <span className="ml-auto text-xs text-muted-foreground">⌘H</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleShow}>
          <Eye className="w-4 h-4 mr-2" />
          Show All
          <span className="ml-auto text-xs text-muted-foreground">⌘⇧H</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ArrowUp className="w-4 h-4 mr-2" />
            Arrange
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={handleBringToFront}>
              <ArrowUpToLine className="w-4 h-4 mr-2" />
              Bring to Front
              <span className="ml-auto text-xs text-muted-foreground">⌘]</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBringForward}>
              <ArrowUp className="w-4 h-4 mr-2" />
              Bring Forward
              <span className="ml-auto text-xs text-muted-foreground">⌘⇧]</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSendBackward}>
              <ArrowDown className="w-4 h-4 mr-2" />
              Send Backward
              <span className="ml-auto text-xs text-muted-foreground">⌘⇧[</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSendToBack}>
              <ArrowDownToLine className="w-4 h-4 mr-2" />
              Send to Back
              <span className="ml-auto text-xs text-muted-foreground">⌘[</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <AlignCenter className="w-4 h-4 mr-2" />
            Align
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <AlignLeft className="w-4 h-4 mr-2" />
              Align Left
            </DropdownMenuItem>
            <DropdownMenuItem>
              <AlignCenter className="w-4 h-4 mr-2" />
              Align Center
            </DropdownMenuItem>
            <DropdownMenuItem>
              <AlignRight className="w-4 h-4 mr-2" />
              Align Right
            </DropdownMenuItem>
            <DropdownMenuItem>
              <AlignJustify className="w-4 h-4 mr-2" />
              Distribute Horizontally
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleFlipHorizontal}>
          <FlipHorizontal className="w-4 h-4 mr-2" />
          Flip Horizontal
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleFlipVertical}>
          <FlipVertical className="w-4 h-4 mr-2" />
          Flip Vertical
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleRotate90}>
          <RotateCw className="w-4 h-4 mr-2" />
          Rotate 90° CW
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}