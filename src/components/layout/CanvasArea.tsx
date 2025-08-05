import { useState } from 'react';
import { ToolPanel } from '../panels/ToolPanel';
import { FilterPanel } from '../panels/FilterPanel';
import { SVGFrame } from '../canvas/SVGFrame';
import { cn } from '@/lib/utils';

export function CanvasArea() {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  return (
    <div className="h-full flex flex-col relative">
      {/* Floating Tool Panel */}
      <div className="absolute top-8 left-1/2 -translate-1/2 z-10 bg-background border border-border rounded-md shadow-lg [[data-appearance=blur]_&]:backdrop-blur-md [[data-appearance=blur]_&]:bg-background/80">
        <ToolPanel />
      </div>

      <div className="flex-1 w-full h-full relative">
        <SVGFrame />
      </div>

      {/* Filter Pipeline Panel */}
      <div className={cn(
        "border-t border-border bg-muted transition-all duration-300",
        "[[data-appearance=blur]_&]:backdrop-blur-md [[data-appearance=blur]_&]:bg-muted/80",
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
  );
}