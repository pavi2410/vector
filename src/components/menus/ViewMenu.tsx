import {
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarCheckboxItem,
  MenubarShortcut,
} from '@/components/ui/menubar';
import { IconZoomIn, IconZoomOut, IconMaximize, IconGrid3x3, IconEye, IconLayersIntersect, IconSettings, IconPalette, IconTarget, IconNavigation } from '@tabler/icons-react';
import { useStore } from '@nanostores/react';
import { editorStore, togglePanel } from '@/stores/editorState';
import { eventBus } from '@/utils/eventBus';

export function ViewMenu() {
  const ui = useStore(editorStore);

  const handleZoomIn = () => {
    eventBus.emit('zoom:in');
  };

  const handleZoomOut = () => {
    eventBus.emit('zoom:out');
  };

  const handleZoomToFit = () => {
    eventBus.emit('zoom:fit');
  };

  const handleActualSize = () => {
    eventBus.emit('zoom:actual');
  };

  const handleCenterCanvas = () => {
    eventBus.emit('canvas:center');
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <MenubarContent align="start" className="w-56">
      <MenubarItem onClick={handleZoomIn}>
        <IconZoomIn className="w-4 h-4 mr-2" />
        Zoom In
        <MenubarShortcut>⌘+</MenubarShortcut>
      </MenubarItem>
      
      <MenubarItem onClick={handleZoomOut}>
        <IconZoomOut className="w-4 h-4 mr-2" />
        Zoom Out
        <MenubarShortcut>⌘-</MenubarShortcut>
      </MenubarItem>

      <MenubarItem onClick={handleZoomToFit}>
        <IconMaximize className="w-4 h-4 mr-2" />
        Zoom to Fit
        <MenubarShortcut>⌘0</MenubarShortcut>
      </MenubarItem>

      <MenubarItem onClick={handleActualSize}>
        <IconEye className="w-4 h-4 mr-2" />
        Actual Size
        <MenubarShortcut>⌘1</MenubarShortcut>
      </MenubarItem>

      <MenubarItem onClick={handleCenterCanvas}>
        <IconTarget className="w-4 h-4 mr-2" />
        Center Canvas
        <MenubarShortcut>⌘2</MenubarShortcut>
      </MenubarItem>

      <MenubarSeparator />

      <MenubarCheckboxItem
        checked={ui.showGrid}
        onCheckedChange={() => togglePanel('showGrid')}
      >
        <IconGrid3x3 className="w-4 h-4 mr-2" />
        Show Grid
        <MenubarShortcut>⌘;</MenubarShortcut>
      </MenubarCheckboxItem>

      <MenubarCheckboxItem
        checked={ui.showRulers}
        onCheckedChange={() => togglePanel('showRulers')}
      >
        <IconSettings className="w-4 h-4 mr-2" />
        Show Rulers
        <MenubarShortcut>⌘R</MenubarShortcut>
      </MenubarCheckboxItem>

      <MenubarCheckboxItem
        checked={ui.showGuides}
        onCheckedChange={() => togglePanel('showGuides')}
      >
        <IconNavigation className="w-4 h-4 mr-2" />
        Show Guides
        <MenubarShortcut>⌘'</MenubarShortcut>
      </MenubarCheckboxItem>

      <MenubarCheckboxItem
        checked={ui.showOutlines}
        onCheckedChange={() => togglePanel('showOutlines')}
      >
        <IconEye className="w-4 h-4 mr-2" />
        Show Outlines
        <MenubarShortcut>⌘Y</MenubarShortcut>
      </MenubarCheckboxItem>

      <MenubarSeparator />

      <MenubarCheckboxItem
        checked={ui.showLayers}
        onCheckedChange={() => togglePanel('showLayers')}
      >
        <IconLayersIntersect className="w-4 h-4 mr-2" />
        Layers Panel
      </MenubarCheckboxItem>

      <MenubarCheckboxItem
        checked={ui.showProperties}
        onCheckedChange={() => togglePanel('showProperties')}
      >
        <IconPalette className="w-4 h-4 mr-2" />
        Properties Panel
      </MenubarCheckboxItem>

      <MenubarSeparator />

      <MenubarItem onClick={handleFullscreen}>
        <IconMaximize className="w-4 h-4 mr-2" />
        Enter Fullscreen
        <MenubarShortcut>F11</MenubarShortcut>
      </MenubarItem>
    </MenubarContent>
  );
}