import { useStore } from '@nanostores/react';
import { canvasStore, transformStore } from '@/stores/canvas';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useControls } from 'react-zoom-pan-pinch';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Focus,
} from 'lucide-react';

export function CanvasControls() {
  const { frames } = useStore(canvasStore);
  const { scale } = useStore(transformStore);
  const { zoomIn, zoomOut, centerView, instance } = useControls();

  const handleZoomIn = () => {
    zoomIn(0.2);
  };

  const handleZoomOut = () => {
    zoomOut(0.2);
  };

  const zoomToFit = () => {
    if (frames.length === 0) return;

    // Calculate bounding box of all frames
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    frames.forEach(frame => {
      minX = Math.min(minX, frame.x);
      minY = Math.min(minY, frame.y);
      maxX = Math.max(maxX, frame.x + frame.width);
      maxY = Math.max(maxY, frame.y + frame.height);
    });

    const padding = 50;
    const boundsWidth = maxX - minX + padding * 2;
    const boundsHeight = maxY - minY + padding * 2;

    const wrapper = instance.wrapperComponent?.getBoundingClientRect();
    if (!wrapper) return;

    // Calculate scale to fit
    const containerWidth = wrapper.width;
    const containerHeight = wrapper.height;
    const scaleX = containerWidth / boundsWidth;
    const scaleY = containerHeight / boundsHeight;
    const newScale = Math.min(scaleX, scaleY, 1);

    // Center the content
    centerView(1 / newScale);
  };


  const zoomTo100 = () => {
    centerView(1);
  };

  const zoomPercentage = Math.round(scale * 100);

  return (
    <TooltipProvider>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 bg-background border border-border rounded-md p-2 shadow-lg">
        {/* Zoom Out */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom Out</p>
          </TooltipContent>
        </Tooltip>

        {/* Zoom to 100% */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-mono"
              onClick={zoomTo100}
            >
              {zoomPercentage}%
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom to 100%</p>
          </TooltipContent>
        </Tooltip>

        {/* Zoom In */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom In</p>
          </TooltipContent>
        </Tooltip>

        {/* Separator */}
        <div className="w-px h-6 bg-border mx-1" />

        {/* Zoom to Fit */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={zoomToFit}
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom to Fit</p>
          </TooltipContent>
        </Tooltip>

        {/* Center View */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => centerView()}
              className="h-8 w-8 p-0"
            >
              <Focus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Center View</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}