import { useStore } from '@nanostores/react';
import {
  MenubarContent,
  MenubarRadioGroup,
  MenubarRadioItem,
} from '@/components/ui/menubar';
import { 
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { themeStore, setTheme, type Theme } from '@/stores/theme';

const themeOptions = [
  { value: 'light' as Theme, label: 'Light', icon: Sun },
  { value: 'dark' as Theme, label: 'Dark', icon: Moon },
  { value: 'auto' as Theme, label: 'Auto', icon: Monitor },
];

export function AppearanceMenuContent() {
  const theme = useStore(themeStore);

  const handleThemeChange = (value: string) => {
    setTheme(value as Theme);
  };

  return (
    <MenubarContent align="start" className="w-48">
      <MenubarRadioGroup value={theme} onValueChange={handleThemeChange}>
        {themeOptions.map(({ value, label, icon: Icon }) => (
          <MenubarRadioItem key={value} value={value}>
            <Icon className="mr-2 h-4 w-4" />
            {label}
          </MenubarRadioItem>
        ))}
      </MenubarRadioGroup>
    </MenubarContent>
  );
}
