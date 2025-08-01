import { useStore } from '@nanostores/react';
import { canvasStore, transformStore } from '@/stores/canvas';
import { selectionStore } from '@/stores/selection';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useControls } from 'react-zoom-pan-pinch';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Square, 
  RotateCcw,
  Home
} from 'lucide-react';

export function CanvasControls() {
  const { shapes, frames } = useStore(canvasStore);
  const { scale } = useStore(transformStore);
  const { selectedIds } = useStore(selectionStore);
  const { zoomIn, zoomOut, setTransform, instance } = useControls();

  const handleZoomChange = (value: number[]) => {
    setTransform(instance.transformState.positionX, instance.transformState.positionY, value[0] / 100);
  };

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
    
    // Calculate scale to fit
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const scaleX = containerWidth / boundsWidth;
    const scaleY = containerHeight / boundsHeight;
    const newScale = Math.min(scaleX, scaleY, 1);
    
    // Center the content
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const newX = containerWidth / 2 - centerX * newScale;
    const newY = containerHeight / 2 - centerY * newScale;
    
    setTransform(newX, newY, newScale);
  };

  const zoomToSelection = () => {
    if (selectedIds.length === 0) return;

    const selectedShapes = shapes.filter(shape => selectedIds.includes(shape.id));
    if (selectedShapes.length === 0) return;

    // Calculate bounding box of selected shapes
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    selectedShapes.forEach(shape => {
      minX = Math.min(minX, shape.x);
      minY = Math.min(minY, shape.y);
      maxX = Math.max(maxX, shape.x + shape.width);
      maxY = Math.max(maxY, shape.y + shape.height);
    });

    const padding = 50;
    const boundsWidth = maxX - minX + padding * 2;
    const boundsHeight = maxY - minY + padding * 2;
    
    // Calculate scale to fit selection
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const scaleX = containerWidth / boundsWidth;
    const scaleY = containerHeight / boundsHeight;
    const newScale = Math.min(scaleX, scaleY, 2);
    
    // Center the selection
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const newX = containerWidth / 2 - centerX * newScale;
    const newY = containerHeight / 2 - centerY * newScale;
    
    setTransform(newX, newY, newScale);
  };

  const zoomTo100 = () => {
    setTransform(instance.transformState.positionX, instance.transformState.positionY, 1);
  };

  const centerView = () => {
    if (frames.length === 0) return;
    
    const mainFrame = frames[0];
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    // Center the main frame
    const centerX = mainFrame.x + mainFrame.width / 2;
    const centerY = mainFrame.y + mainFrame.height / 2;
    const newX = containerWidth / 2 - centerX;
    const newY = containerHeight / 2 - centerY;
    
    setTransform(newX, newY, 1);
  };

  const zoomPercentage = Math.round(scale * 100);

  return (
    <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-background border border-border rounded-md p-2 shadow-lg">
      {/* Zoom Out Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomOut}
        className="h-8 w-8 p-0"
        title="Zoom Out (Ctrl + -)"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>

      {/* Zoom Slider */}
      <div className="flex items-center space-x-2 min-w-[120px]">
        <Slider
          value={[zoomPercentage]}
          onValueChange={handleZoomChange}
          min={10}
          max={500}
          step={5}
          className="flex-1"
        />
      </div>

      {/* Zoom Percentage Display */}
      <div className="min-w-[50px] text-center">
        <span className="text-xs font-mono">
          {zoomPercentage}%
        </span>
      </div>

      {/* Zoom In Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleZoomIn}
        className="h-8 w-8 p-0"
        title="Zoom In (Ctrl + +)"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>

      {/* Separator */}
      <div className="w-px h-6 bg-border" />

      {/* Zoom to 100% */}
      <Button
        variant="ghost"
        size="sm"
        onClick={zoomTo100}
        className="h-8 w-8 p-0"
        title="Zoom to 100% (Ctrl + 1)"
      >
        <Square className="h-4 w-4" />
      </Button>

      {/* Zoom to Fit */}
      <Button
        variant="ghost"
        size="sm"
        onClick={zoomToFit}
        className="h-8 w-8 p-0"
        title="Zoom to Fit (Ctrl + 0)"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>

      {/* Zoom to Selection */}
      <Button
        variant="ghost"
        size="sm"
        onClick={zoomToSelection}
        disabled={selectedIds.length === 0}
        className="h-8 w-8 p-0"
        title="Zoom to Selection (Ctrl + 2)"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>

      {/* Center View */}
      <Button
        variant="ghost"
        size="sm"
        onClick={centerView}
        className="h-8 w-8 p-0"
        title="Center View (Home)"
      >
        <Home className="h-4 w-4" />
      </Button>
    </div>
  );
}