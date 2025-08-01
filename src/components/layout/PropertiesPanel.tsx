import { useStore } from '@nanostores/react';
import { canvasStore, updateShape } from '@/stores/canvas';
import { selectionStore } from '@/stores/selection';
import { toolStore, updateToolSettings } from '@/stores/tools';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

export function PropertiesPanel() {
  const { shapes } = useStore(canvasStore);
  const { selectedIds } = useStore(selectionStore);
  const { toolSettings } = useStore(toolStore);

  const selectedShape = selectedIds.length === 1 
    ? shapes.find(shape => shape.id === selectedIds[0])
    : null;

  if (selectedShape) {
    return (
      <div className="p-4">
        <div className="text-sm font-medium mb-3">Properties</div>
        <div className="space-y-4">
          {/* Position */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="x" className="text-xs">X</Label>
              <Input
                id="x"
                type="number"
                value={selectedShape.x}
                onChange={(e) => updateShape(selectedShape.id, { x: Number(e.target.value) })}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="y" className="text-xs">Y</Label>
              <Input
                id="y"
                type="number"
                value={selectedShape.y}
                onChange={(e) => updateShape(selectedShape.id, { y: Number(e.target.value) })}
                className="h-8"
              />
            </div>
          </div>

          {/* Size */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="width" className="text-xs">Width</Label>
              <Input
                id="width"
                type="number"
                value={selectedShape.width}
                onChange={(e) => updateShape(selectedShape.id, { width: Number(e.target.value) })}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs">Height</Label>
              <Input
                id="height"
                type="number"
                value={selectedShape.height}
                onChange={(e) => updateShape(selectedShape.id, { height: Number(e.target.value) })}
                className="h-8"
              />
            </div>
          </div>

          {/* Fill */}
          <div>
            <Label htmlFor="fill" className="text-xs">Fill</Label>
            <Input
              id="fill"
              type="color"
              value={selectedShape.fill || '#3b82f6'}
              onChange={(e) => updateShape(selectedShape.id, { fill: e.target.value })}
              className="h-8"
            />
          </div>

          {/* Stroke */}
          <div>
            <Label htmlFor="stroke" className="text-xs">Stroke</Label>
            <Input
              id="stroke"
              type="color"
              value={selectedShape.stroke || '#1e40af'}
              onChange={(e) => updateShape(selectedShape.id, { stroke: e.target.value })}
              className="h-8"
            />
          </div>

          {/* Stroke Width */}
          <div>
            <Label htmlFor="strokeWidth" className="text-xs">Stroke Width</Label>
            <Slider
              value={[selectedShape.strokeWidth || 2]}
              onValueChange={([value]) => updateShape(selectedShape.id, { strokeWidth: value })}
              max={20}
              min={0}
              step={1}
              className="mt-2"
            />
          </div>

          {/* Opacity */}
          <div>
            <Label htmlFor="opacity" className="text-xs">Opacity</Label>
            <Slider
              value={[(selectedShape.opacity || 1) * 100]}
              onValueChange={([value]) => updateShape(selectedShape.id, { opacity: value / 100 })}
              max={100}
              min={0}
              step={1}
              className="mt-2"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-sm font-medium mb-3">Tool Settings</div>
      <div className="space-y-4">
        {/* Fill */}
        <div>
          <Label htmlFor="toolFill" className="text-xs">Fill</Label>
          <Input
            id="toolFill"
            type="color"
            value={toolSettings.fill}
            onChange={(e) => updateToolSettings({ fill: e.target.value })}
            className="h-8"
          />
        </div>

        {/* Stroke */}
        <div>
          <Label htmlFor="toolStroke" className="text-xs">Stroke</Label>
          <Input
            id="toolStroke"
            type="color"
            value={toolSettings.stroke}
            onChange={(e) => updateToolSettings({ stroke: e.target.value })}
            className="h-8"
          />
        </div>

        {/* Stroke Width */}
        <div>
          <Label htmlFor="toolStrokeWidth" className="text-xs">Stroke Width</Label>
          <Slider
            value={[toolSettings.strokeWidth]}
            onValueChange={([value]) => updateToolSettings({ strokeWidth: value })}
            max={20}
            min={0}
            step={1}
            className="mt-2"
          />
        </div>

        {/* Opacity */}
        <div>
          <Label htmlFor="toolOpacity" className="text-xs">Opacity</Label>
          <Slider
            value={[toolSettings.opacity * 100]}
            onValueChange={([value]) => updateToolSettings({ opacity: value / 100 })}
            max={100}
            min={0}
            step={1}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}