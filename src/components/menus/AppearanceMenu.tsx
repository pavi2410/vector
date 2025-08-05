import { useStore } from '@nanostores/react';
import {
  MenubarContent,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarCheckboxItem,
  MenubarSeparator,
} from '@/components/ui/menubar';
import { 
  Sun,
  Moon,
  Monitor,
  Palette,
  Sparkles
} from 'lucide-react';
import { appearanceStore, setTheme, setBlur, type Theme } from '@/stores/appearance';

const themeOptions = [
  { value: 'light' as Theme, label: 'Light', icon: Sun },
  { value: 'dark' as Theme, label: 'Dark', icon: Moon },
  { value: 'auto' as Theme, label: 'Auto', icon: Monitor },
];

export function AppearanceMenuContent() {
  const appearance = useStore(appearanceStore);

  const handleThemeChange = (value: string) => {
    setTheme(value as Theme);
  };

  const handleBlurToggle = (checked: boolean) => {
    setBlur(checked);
  };

  return (
    <MenubarContent align="start" className="w-48">
      <MenubarSub>
        <MenubarSubTrigger>
          <Palette className="mr-2 h-4 w-4" />
          Theme
        </MenubarSubTrigger>
        <MenubarSubContent>
          <MenubarRadioGroup value={appearance.theme} onValueChange={handleThemeChange}>
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <MenubarRadioItem key={value} value={value}>
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </MenubarRadioItem>
            ))}
          </MenubarRadioGroup>
        </MenubarSubContent>
      </MenubarSub>
      
      <MenubarSeparator />
      
      <MenubarCheckboxItem
        checked={appearance.blur}
        onCheckedChange={handleBlurToggle}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Blur
      </MenubarCheckboxItem>
    </MenubarContent>
  );
}
