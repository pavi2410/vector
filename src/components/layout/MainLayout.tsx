import { useState } from 'react';
import { ToolPanel } from './ToolPanel';
import { LayersPanel } from './LayersPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { FilterPanel } from './FilterPanel';
import { FileMenu } from './FileMenu';
import { HelpMenu } from './HelpMenu';
import { SVGCanvas } from '../canvas/SVGCanvas';
import { cn } from '@/lib/utils';

export function MainLayout() {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Menu Bar */}
      <div className="h-10 bg-muted border-b border-border flex items-center px-4 text-sm">
        <div className="flex space-x-4">
          <FileMenu />
          <span className="font-medium">Edit</span>
          <span className="font-medium">View</span>
          <span className="font-medium">Object</span>
          <span className="font-medium">Filter</span>
          <HelpMenu />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Tool Panel */}
        <div className="w-16 bg-muted border-r border-border">
          <ToolPanel />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col">
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

        {/* Right Panels */}
        <div className="w-80 bg-muted border-l border-border flex flex-col">
          <div className="flex-1 border-b border-border">
            <LayersPanel />
          </div>
          <div className="flex-1">
            <PropertiesPanel />
          </div>
        </div>
      </div>
    </div>
  );
}