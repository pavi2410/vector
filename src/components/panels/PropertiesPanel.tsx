import { useStore } from '@nanostores/react';
import { canvasStore, updateShape } from '@/stores/canvas';
import { editorStore, updateToolSettings } from '@/stores/editorState';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
        <div className="px-4 py-3">
          <div className="text-sm font-medium">
            {selectedShapes.length} shapes selected
          </div>
        </div>
        <ScrollArea className="flex-1 h-full">
          <div className="flex flex-col">
            <div className="px-4 pb-4">
              <div className="text-sm font-medium mb-3">Position</div>
              <AlignmentSection />
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Single selection view
  if (selectedShape) {
    return (
      <div className="h-full flex flex-col">
        <ScrollArea className="flex-1 h-full">
          <div className="flex flex-col">
            
            {/* Position Section */}
            <div className="px-4 py-4">
              <div className="text-sm font-medium mb-3">Position</div>
              <div className="flex flex-col gap-3">
                <AlignmentSection />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="x" className="text-xs text-muted-foreground">X</Label>
                    <Input
                      id="x"
                      type="number"
                      value={selectedShape.x}
                      onChange={(e) => updateShape(selectedShape.id, { x: Number(e.target.value) })}
                      className="h-8 mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="y" className="text-xs text-muted-foreground">Y</Label>
                    <Input
                      id="y"
                      type="number"
                      value={selectedShape.y}
                      onChange={(e) => updateShape(selectedShape.id, { y: Number(e.target.value) })}
                      className="h-8 mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />

            {/* Layout Section */}
            <div className="px-4 py-4">
              <div className="text-sm font-medium mb-3">Layout</div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="width" className="text-xs text-muted-foreground">W</Label>
                  <Input
                    id="width"
                    type="number"
                    value={selectedShape.width}
                    onChange={(e) => updateShape(selectedShape.id, { width: Number(e.target.value) })}
                    className="h-8 mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="height" className="text-xs text-muted-foreground">H</Label>
                  <Input
                    id="height"
                    type="number"
                    value={selectedShape.height}
                    onChange={(e) => updateShape(selectedShape.id, { height: Number(e.target.value) })}
                    className="h-8 mt-1"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Appearance Section */}
            <div className="px-4 py-4">
              <div className="text-sm font-medium mb-3">Appearance</div>
              <div>
                <Label htmlFor="opacity" className="text-xs text-muted-foreground">Opacity</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Slider
                    value={[(selectedShape.opacity ?? 1) * 100]}
                    onValueChange={([value]) => updateShape(selectedShape.id, { opacity: value / 100 })}
                    max={100}
                    min={0}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {Math.round((selectedShape.opacity ?? 1) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Fill Section */}
            <div className="px-4 py-4">
              <div className="text-sm font-medium mb-3">Fill</div>
              <Input
                id="fill"
                type="color"
                value={selectedShape.fill || '#3b82f6'}
                onChange={(e) => updateShape(selectedShape.id, { fill: e.target.value })}
                className="h-8 w-full"
              />
            </div>

            <Separator />

            {/* Stroke Section */}
            <div className="px-4 py-4">
              <div className="text-sm font-medium mb-3">Stroke</div>
              <div className="flex flex-col gap-3">
                <div>
                  <Label htmlFor="stroke" className="text-xs text-muted-foreground">Color</Label>
                  <Input
                    id="stroke"
                    type="color"
                    value={selectedShape.stroke || '#1e40af'}
                    onChange={(e) => updateShape(selectedShape.id, { stroke: e.target.value })}
                    className="h-8 w-full mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="strokeWidth" className="text-xs text-muted-foreground">Width</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Slider
                      value={[selectedShape.strokeWidth ?? 2]}
                      onValueChange={([value]) => updateShape(selectedShape.id, { strokeWidth: value })}
                      max={20}
                      min={0}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {selectedShape.strokeWidth ?? 2}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Section - Only for text shapes */}
            {selectedShape.type === 'text' && (
              <>
                <Separator />
                <div className="px-4 py-4">
                  <div className="text-sm font-medium mb-3">Text</div>
                  <div className="flex flex-col gap-3">
                    
                    {/* Text Content */}
                    <div>
                      <Label htmlFor="text" className="text-xs text-muted-foreground">Content</Label>
                      <Input
                        id="text"
                        type="text"
                        value={selectedShape.text || 'Text'}
                        onChange={(e) => updateShape(selectedShape.id, { text: e.target.value })}
                        className="h-8 mt-1"
                      />
                    </div>

                    {/* Font Size */}
                    <div>
                      <Label htmlFor="fontSize" className="text-xs text-muted-foreground">Font Size</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Slider
                          value={[selectedShape.fontSize ?? 16]}
                          onValueChange={([value]) => updateShape(selectedShape.id, { fontSize: value })}
                          max={72}
                          min={8}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {selectedShape.fontSize ?? 16}px
                        </span>
                      </div>
                    </div>

                    {/* Font Family */}
                    <div>
                      <Label className="text-xs text-muted-foreground">Font Family</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="h-8 w-full justify-between mt-1">
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

                    {/* Font Style */}
                    <div>
                      <Label className="text-xs text-muted-foreground">Style</Label>
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
                      <Label className="text-xs text-muted-foreground">Alignment</Label>
                      <div className="flex gap-1 mt-1">
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
                  </div>
                </div>
              </>
            )}
            
          </div>
        </ScrollArea>
      </div>
    );
  }

  // No selection - show tool settings
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3">
        <div className="text-sm font-medium">Tool Settings</div>
      </div>
      <ScrollArea className="flex-1 h-full">
        <div className="flex flex-col">
          
          {/* Fill Section */}
          <div className="px-4 py-4">
            <div className="text-sm font-medium mb-3">Fill</div>
            <Input
              id="toolFill"
              type="color"
              value={toolSettings.fill}
              onChange={(e) => updateToolSettings({ fill: e.target.value })}
              className="h-8 w-full"
            />
          </div>

          <Separator />

          {/* Stroke Section */}
          <div className="px-4 py-4">
            <div className="text-sm font-medium mb-3">Stroke</div>
            <div className="flex flex-col gap-3">
              <div>
                <Label htmlFor="toolStroke" className="text-xs text-muted-foreground">Color</Label>
                <Input
                  id="toolStroke"
                  type="color"
                  value={toolSettings.stroke}
                  onChange={(e) => updateToolSettings({ stroke: e.target.value })}
                  className="h-8 w-full mt-1"
                />
              </div>
              <div>
                <Label htmlFor="toolStrokeWidth" className="text-xs text-muted-foreground">Width</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Slider
                    value={[toolSettings.strokeWidth]}
                    onValueChange={([value]) => updateToolSettings({ strokeWidth: value })}
                    max={20}
                    min={0}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {toolSettings.strokeWidth}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Appearance Section */}
          <div className="px-4 py-4">
            <div className="text-sm font-medium mb-3">Appearance</div>
            <div>
              <Label htmlFor="toolOpacity" className="text-xs text-muted-foreground">Opacity</Label>
              <div className="flex items-center gap-2 mt-1">
                <Slider
                  value={[toolSettings.opacity * 100]}
                  onValueChange={([value]) => updateToolSettings({ opacity: value / 100 })}
                  max={100}
                  min={0}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {Math.round(toolSettings.opacity * 100)}%
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Text Tool Settings */}
          <div className="px-4 py-4">
            <div className="text-sm font-medium mb-3">Text</div>
            <div className="flex flex-col gap-3">
              
              {/* Font Size */}
              <div>
                <Label htmlFor="toolFontSize" className="text-xs text-muted-foreground">Font Size</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Slider
                    value={[toolSettings.fontSize ?? 16]}
                    onValueChange={([value]) => updateToolSettings({ fontSize: value })}
                    max={72}
                    min={8}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {toolSettings.fontSize ?? 16}px
                  </span>
                </div>
              </div>

              {/* Font Family */}
              <div>
                <Label className="text-xs text-muted-foreground">Font Family</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-8 w-full justify-between mt-1">
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

              {/* Font Style - NOW INCLUDED IN TOOL SETTINGS */}
              <div>
                <Label className="text-xs text-muted-foreground">Style</Label>
                <div className="flex gap-2 mt-1">
                  <Button
                    variant={toolSettings.fontWeight === 'bold' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateToolSettings({ 
                      fontWeight: toolSettings.fontWeight === 'bold' ? 'normal' : 'bold' 
                    })}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={toolSettings.fontStyle === 'italic' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateToolSettings({ 
                      fontStyle: toolSettings.fontStyle === 'italic' ? 'normal' : 'italic' 
                    })}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Text Alignment for Tool Settings */}
              <div>
                <Label className="text-xs text-muted-foreground">Alignment</Label>
                <div className="flex gap-1 mt-1">
                  <Button
                    variant={toolSettings.textAlign === 'start' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateToolSettings({ textAlign: 'start' })}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={toolSettings.textAlign === 'middle' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateToolSettings({ textAlign: 'middle' })}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={toolSettings.textAlign === 'end' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateToolSettings({ textAlign: 'end' })}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </ScrollArea>
    </div>
  );
}