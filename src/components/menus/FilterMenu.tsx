import {
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from '@/components/ui/menubar';
import { 
  Filter,
  Wind,
  Palette,
  Sparkles
} from 'lucide-react';

export function FilterMenu() {
  const handleAddFilter = (filterName: string) => {
    console.log(`Add ${filterName} filter`);
  };

  return (
    <MenubarContent align="start" className="w-56">
      <MenubarItem onClick={() => handleAddFilter('Blur')}>
        <Wind className="w-4 h-4 mr-2" />
        Add Blur
      </MenubarItem>
      
      <MenubarItem onClick={() => handleAddFilter('Color Adjust')}>
        <Palette className="w-4 h-4 mr-2" />
        Color Adjust
      </MenubarItem>

      <MenubarItem onClick={() => handleAddFilter('Sharpen')}>
        <Sparkles className="w-4 h-4 mr-2" />
        Sharpen
      </MenubarItem>

      <MenubarSeparator />

      <MenubarItem onClick={() => handleAddFilter('Remove All')}>
        <Filter className="w-4 h-4 mr-2" />
        Remove All Filters
      </MenubarItem>
    </MenubarContent>
  );
}
