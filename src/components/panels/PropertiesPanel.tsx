import { useStore } from '@nanostores/react';
import { canvasStore, updateShape } from '@/stores/canvas';
import { editorStore, updateToolSettings } from '@/stores/editorState';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlignmentSection } from './AlignmentSection';
import { ChevronDown, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';

export function PropertiesPanel() {
  const { frame } = useStore(canvasStore);
  const { shapes } = frame;
  const { selectedIds, toolSettings } = useStore(editorStore);

  const selectedShapes = shapes.filter(shape => selectedIds.includes(shape.id));
  const selectedShape = selectedIds.length === 1 
    ? shapes.find(shape => shape.id === selectedIds[0])
    : null;

  // Multi-selection view (2 or more shapes)
  if (selectedShapes.length >= 2) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 pb-0">
          <div className="text-sm font-medium">
            {selectedShapes.length} shapes selected
          </div>
        </div>
        <ScrollArea className="flex-1 px-4 h-full">
          <div className="space-y-4 py-4">
            <AlignmentSection />
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Single selection view
  if (selectedShape) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 pb-0">
          <div className="text-sm font-medium">Properties</div>
        </div>
        <ScrollArea className="flex-1 px-4 h-full">
          <div className="space-y-4 py-4">
            {/* Alignment Controls */}
            <AlignmentSection />
            
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

            {/* Text-specific controls */}
            {selectedShape.type === 'text' && (
              <>
                {/* Text Content */}
                <div>
                  <Label htmlFor="text" className="text-xs">Text</Label>
                  <Input
                    id="text"
                    type="text"
                    value={selectedShape.text || 'Text'}
                    onChange={(e) => updateShape(selectedShape.id, { text: e.target.value })}
                    className="h-8"
                  />
                </div>

                {/* Font Size */}
                <div>
                  <Label htmlFor="fontSize" className="text-xs">Font Size</Label>
                  <Slider
                    value={[selectedShape.fontSize ?? 16]}
                    onValueChange={([value]) => updateShape(selectedShape.id, { fontSize: value })}
                    max={72}
                    min={8}
                    step={1}
                    className="mt-2"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedShape.fontSize ?? 16}px
                  </div>
                </div>

                {/* Font Family */}
                <div>
                  <Label className="text-xs">Font Family</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-8 w-full justify-between">
                        {selectedShape.fontFamily || 'Inter'}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {['Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New'].map((font) => (
                        <DropdownMenuItem 
                          key={font}
                          onClick={() => updateShape(selectedShape.id, { fontFamily: font })}
                        >
                          {font}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Font Style Controls */}
                <div>
                  <Label className="text-xs">Style</Label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      variant={selectedShape.fontWeight === 'bold' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateShape(selectedShape.id, { 
                        fontWeight: selectedShape.fontWeight === 'bold' ? 'normal' : 'bold' 
                      })}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={selectedShape.fontStyle === 'italic' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateShape(selectedShape.id, { 
                        fontStyle: selectedShape.fontStyle === 'italic' ? 'normal' : 'italic' 
                      })}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Text Alignment */}
                <div>
                  <Label className="text-xs">Alignment</Label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      variant={selectedShape.textAlign === 'start' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateShape(selectedShape.id, { textAlign: 'start' })}
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={selectedShape.textAlign === 'middle' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateShape(selectedShape.id, { textAlign: 'middle' })}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={selectedShape.textAlign === 'end' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateShape(selectedShape.id, { textAlign: 'end' })}
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}

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
                value={[selectedShape.strokeWidth ?? 2]}
                onValueChange={([value]) => updateShape(selectedShape.id, { strokeWidth: value })}
                max={20}
                min={0}
                step={1}
                className="mt-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {selectedShape.strokeWidth ?? 2}px
              </div>
            </div>

            {/* Opacity */}
            <div>
              <Label htmlFor="opacity" className="text-xs">Opacity</Label>
              <Slider
                value={[(selectedShape.opacity ?? 1) * 100]}
                onValueChange={([value]) => updateShape(selectedShape.id, { opacity: value / 100 })}
                max={100}
                min={0}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // No selection - show tool settings
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 pb-0">
        <div className="text-sm font-medium">Tool Settings</div>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
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
            <div className="text-xs text-muted-foreground mt-1">
              {toolSettings.strokeWidth}px
            </div>
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

          {/* Text Tool Settings */}
          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-3">Text Tool Settings</div>
            
            {/* Font Size */}
            <div>
              <Label htmlFor="toolFontSize" className="text-xs">Font Size</Label>
              <Slider
                value={[toolSettings.fontSize ?? 16]}
                onValueChange={([value]) => updateToolSettings({ fontSize: value })}
                max={72}
                min={8}
                step={1}
                className="mt-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {toolSettings.fontSize ?? 16}px
              </div>
            </div>

            {/* Font Family */}
            <div>
              <Label className="text-xs">Font Family</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 w-full justify-between">
                    {toolSettings.fontFamily?.split(',')[0] || 'Inter'}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {['Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New'].map((font) => (
                    <DropdownMenuItem 
                      key={font}
                      onClick={() => updateToolSettings({ fontFamily: font === 'Inter' ? 'Inter, system-ui, sans-serif' : font })}
                    >
                      {font}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}