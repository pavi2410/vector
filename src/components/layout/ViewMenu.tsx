import {
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarCheckboxItem,
  MenubarShortcut,
} from '@/components/ui/menubar';
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
    <MenubarContent align="start" className="w-56">
      <MenubarItem onClick={handleZoomIn}>
        <ZoomIn className="w-4 h-4 mr-2" />
        Zoom In
        <MenubarShortcut>⌘+</MenubarShortcut>
      </MenubarItem>
      
      <MenubarItem onClick={handleZoomOut}>
        <ZoomOut className="w-4 h-4 mr-2" />
        Zoom Out
        <MenubarShortcut>⌘-</MenubarShortcut>
      </MenubarItem>

      <MenubarItem onClick={handleZoomToFit}>
        <Maximize className="w-4 h-4 mr-2" />
        Zoom to Fit
        <MenubarShortcut>⌘0</MenubarShortcut>
      </MenubarItem>

      <MenubarItem onClick={handleActualSize}>
        <Eye className="w-4 h-4 mr-2" />
        Actual Size
        <MenubarShortcut>⌘1</MenubarShortcut>
      </MenubarItem>

      <MenubarSeparator />

      <MenubarCheckboxItem
        checked={showGrid}
        onCheckedChange={setShowGrid}
      >
        <Grid3X3 className="w-4 h-4 mr-2" />
        Show Grid
        <MenubarShortcut>⌘;</MenubarShortcut>
      </MenubarCheckboxItem>

      <MenubarCheckboxItem
        checked={showRulers}
        onCheckedChange={setShowRulers}
      >
        <Settings className="w-4 h-4 mr-2" />
        Show Rulers
        <MenubarShortcut>⌘R</MenubarShortcut>
      </MenubarCheckboxItem>

      <MenubarSeparator />

      <MenubarCheckboxItem
        checked={showLayers}
        onCheckedChange={setShowLayers}
      >
        <Layers className="w-4 h-4 mr-2" />
        Layers Panel
      </MenubarCheckboxItem>

      <MenubarCheckboxItem
        checked={showProperties}
        onCheckedChange={setShowProperties}
      >
        <Palette className="w-4 h-4 mr-2" />
        Properties Panel
      </MenubarCheckboxItem>

      <MenubarSeparator />

      <MenubarItem onClick={handleFullscreen}>
        <Maximize className="w-4 h-4 mr-2" />
        Enter Fullscreen
        <MenubarShortcut>F11</MenubarShortcut>
      </MenubarItem>
    </MenubarContent>
  );
}