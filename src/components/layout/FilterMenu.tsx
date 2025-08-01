import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Filter, 
  Brush,
  Sparkles,
  Sun,
  Droplets,
  Contrast,
  Palette,
  Lightbulb,
  Wind,
  Eye,
  Zap
} from 'lucide-react';

export function FilterMenu() {
  const handleAddFilter = (filterType: string) => {
    console.log(`Add ${filterType} filter`);
  };

  const handleRemoveFilters = () => {
    console.log('Remove all filters');
  };

  const handleShowFilterPanel = () => {
    console.log('Show filter panel');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-3 py-1 text-sm font-medium hover:bg-muted rounded transition-colors">
        Filter
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={handleShowFilterPanel}>
          <Filter className="w-4 h-4 mr-2" />
          Show Filter Panel
          <span className="ml-auto text-xs text-muted-foreground">⌘F</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Brush className="w-4 h-4 mr-2" />
            Blur & Sharpen
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handleAddFilter('Gaussian Blur')}>
              <Wind className="w-4 h-4 mr-2" />
              Gaussian Blur
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddFilter('Motion Blur')}>
              <Zap className="w-4 h-4 mr-2" />
              Motion Blur
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddFilter('Sharpen')}>
              <Sparkles className="w-4 h-4 mr-2" />
              Sharpen
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="w-4 h-4 mr-2" />
            Color Effects
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handleAddFilter('Hue/Saturation')}>
              <Palette className="w-4 h-4 mr-2" />
              Hue/Saturation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddFilter('Brightness/Contrast')}>
              <Contrast className="w-4 h-4 mr-2" />
              Brightness/Contrast
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddFilter('Color Matrix')}>
              <Sun className="w-4 h-4 mr-2" />
              Color Matrix
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddFilter('Invert')}>
              <Eye className="w-4 h-4 mr-2" />
              Invert Colors
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Lightbulb className="w-4 h-4 mr-2" />
            Lighting
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handleAddFilter('Drop Shadow')}>
              <Droplets className="w-4 h-4 mr-2" />
              Drop Shadow
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddFilter('Inner Shadow')}>
              <Droplets className="w-4 h-4 mr-2" />
              Inner Shadow
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddFilter('Glow')}>
              <Lightbulb className="w-4 h-4 mr-2" />
              Outer Glow
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddFilter('Inner Glow')}>
              <Lightbulb className="w-4 h-4 mr-2" />
              Inner Glow
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Wind className="w-4 h-4 mr-2" />
            Distortion
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => handleAddFilter('Displacement Map')}>
              <Wind className="w-4 h-4 mr-2" />
              Displacement Map
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddFilter('Turbulence')}>
              <Sparkles className="w-4 h-4 mr-2" />
              Turbulence
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleRemoveFilters}>
          <Filter className="w-4 h-4 mr-2" />
          Remove All Filters
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}