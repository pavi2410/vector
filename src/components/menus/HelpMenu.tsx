import { useState } from 'react';
import {
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from '@/components/ui/menubar';
import { IconKeyboard, IconFileText, IconBug, IconInfoCircle, IconExternalLink } from '@tabler/icons-react';
import { KeyboardShortcuts } from '../modals/KeyboardShortcuts';
import { About } from '../modals/About';

export function HelpMenu() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleDocumentation = () => {
    window.open('https://github.com/pavi2410/vector/blob/main/USER_GUIDE.md', '_blank');
  };

  const handleReportIssue = () => {
    window.open('https://github.com/pavi2410/vector/issues', '_blank');
  };

  return (
    <>
      <MenubarContent align="start" className="w-56">
        <MenubarItem onClick={() => setShowShortcuts(true)}>
          <IconKeyboard className="mr-2 h-4 w-4" />
          Keyboard Shortcuts
        </MenubarItem>
        
        <MenubarItem onClick={handleDocumentation}>
          <IconFileText className="mr-2 h-4 w-4" />
          Documentation
          <IconExternalLink className="ml-auto h-3 w-3" />
        </MenubarItem>
        
        <MenubarSeparator />
        
        <MenubarItem onClick={handleReportIssue}>
          <IconBug className="mr-2 h-4 w-4" />
          Report Issue
          <IconExternalLink className="ml-auto h-3 w-3" />
        </MenubarItem>
        
        <MenubarSeparator />
        
        <MenubarItem onClick={() => setShowAbout(true)}>
          <IconInfoCircle className="mr-2 h-4 w-4" />
          About Vector
        </MenubarItem>
      </MenubarContent>

      <KeyboardShortcuts 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
      
      <About 
        isOpen={showAbout} 
        onClose={() => setShowAbout(false)} 
      />
    </>
  );
}
