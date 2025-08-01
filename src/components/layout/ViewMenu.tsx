import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Grid3X3,
  Eye,
  Layers,
  Settings,
  Palette
} from 'lucide-react';
import { useState } from 'react';

export function ViewMenu() {
  const [showGrid, setShowGrid] = useState(false);
  const [showRulers, setShowRulers] = useState(false);
  const [showLayers, setShowLayers] = useState(true);
  const [showProperties, setShowProperties] = useState(true);

  const handleZoomIn = () => {
    console.log('Zoom In action');
  };

  const handleZoomOut = () => {
    console.log('Zoom Out action');
  };

  const handleZoomToFit = () => {
    console.log('Zoom to Fit action');
  };

  const handleActualSize = () => {
    console.log('Actual Size action');
  };

  const handleFullscreen = () => {
    console.log('Fullscreen action');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-3 py-1 text-sm font-medium hover:bg-muted rounded transition-colors">
        View
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={handleZoomIn}>
          <ZoomIn className="w-4 h-4 mr-2" />
          Zoom In
          <span className="ml-auto text-xs text-muted-foreground">⌘+</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleZoomOut}>
          <ZoomOut className="w-4 h-4 mr-2" />
          Zoom Out
          <span className="ml-auto text-xs text-muted-foreground">⌘-</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleZoomToFit}>
          <Maximize className="w-4 h-4 mr-2" />
          Zoom to Fit
          <span className="ml-auto text-xs text-muted-foreground">⌘0</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleActualSize}>
          <Eye className="w-4 h-4 mr-2" />
          Actual Size
          <span className="ml-auto text-xs text-muted-foreground">⌘1</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem
          checked={showGrid}
          onCheckedChange={setShowGrid}
        >
          <Grid3X3 className="w-4 h-4 mr-2" />
          Show Grid
          <span className="ml-auto text-xs text-muted-foreground">⌘;</span>
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={showRulers}
          onCheckedChange={setShowRulers}
        >
          <Settings className="w-4 h-4 mr-2" />
          Show Rulers
          <span className="ml-auto text-xs text-muted-foreground">⌘R</span>
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem
          checked={showLayers}
          onCheckedChange={setShowLayers}
        >
          <Layers className="w-4 h-4 mr-2" />
          Layers Panel
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={showProperties}
          onCheckedChange={setShowProperties}
        >
          <Palette className="w-4 h-4 mr-2" />
          Properties Panel
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleFullscreen}>
          <Maximize className="w-4 h-4 mr-2" />
          Enter Fullscreen
          <span className="ml-auto text-xs text-muted-foreground">F11</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}