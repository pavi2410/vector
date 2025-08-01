import { useState } from 'react';
import { ToolPanel } from './ToolPanel';
import { LayersPanel } from './LayersPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { FilterPanel } from './FilterPanel';
import { FileMenu } from './FileMenu';
import { EditMenu } from './EditMenu';
import { ViewMenu } from './ViewMenu';
import { ObjectMenu } from './ObjectMenu';
import { FilterMenu } from './FilterMenu';
import { AppearanceMenuContent } from './AppearanceMenu';
import { HelpMenu } from './HelpMenu';
import { SVGCanvas } from '../canvas/SVGCanvas';
import { cn } from '@/lib/utils';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';

export function MainLayout() {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Menu Bar */}
      <div className="h-10 bg-muted border-b border-border flex items-center px-4 text-sm">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <FileMenu />
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <EditMenu />
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <ViewMenu />
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Object</MenubarTrigger>
            <ObjectMenu />
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Filter</MenubarTrigger>
            <FilterMenu />
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Appearance</MenubarTrigger>
            <AppearanceMenuContent />
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Help</MenubarTrigger>
            <HelpMenu />
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Layers */}
        <div className="w-80 bg-muted border-r border-border">
          <LayersPanel />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Horizontal Tool Panel */}
          <div className="h-16 bg-muted border-b border-border">
            <ToolPanel />
          </div>
          
          <div className="flex-1 bg-background">
            <SVGCanvas />
          </div>
          
          {/* Filter Pipeline Panel */}
          <div className={cn(
            "border-t border-border bg-muted transition-all duration-300",
            isFilterPanelOpen ? "h-80" : "h-10"
          )}>
            <div className="h-10 flex items-center px-4 border-b border-border">
              <button
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className="text-sm font-medium hover:text-foreground"
              >
                Filter Pipeline Editor
              </button>
            </div>
            {isFilterPanelOpen && (
              <div className="h-70 p-4">
                <FilterPanel />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Properties */}
        <div className="w-80 bg-muted border-l border-border">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}