import {
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from '@/components/ui/menubar';
import { IconFilter, IconWind, IconPalette, IconSparkles } from '@tabler/icons-react';

export function FilterMenu() {
  const handleAddFilter = (filterName: string) => {
    console.log(`Add ${filterName} filter`);
  };

  return (
    <MenubarContent align="start" className="w-56">
      <MenubarItem onClick={() => handleAddFilter('Blur')}>
        <IconWind className="w-4 h-4 mr-2" />
        Add Blur
      </MenubarItem>
      
      <MenubarItem onClick={() => handleAddFilter('Color Adjust')}>
        <IconPalette className="w-4 h-4 mr-2" />
        Color Adjust
      </MenubarItem>

      <MenubarItem onClick={() => handleAddFilter('Sharpen')}>
        <IconSparkles className="w-4 h-4 mr-2" />
        Sharpen
      </MenubarItem>

      <MenubarSeparator />

      <MenubarItem onClick={() => handleAddFilter('Remove All')}>
        <IconFilter className="w-4 h-4 mr-2" />
        Remove All Filters
      </MenubarItem>
    </MenubarContent>
  );
}
