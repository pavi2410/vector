import { useState } from 'react';
import {
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from '@/components/ui/menubar';
import { 
  Keyboard, 
  FileText, 
  Bug, 
  Info,
  ExternalLink 
} from 'lucide-react';
import { KeyboardShortcuts } from '../modals/KeyboardShortcuts';
import { About } from '../modals/About';

export function HelpMenu() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleDocumentation = () => {
    window.open('https://github.com/pavi2410/vector', '_blank');
  };

  const handleReportIssue = () => {
    window.open('https://github.com/pavi2410/vector/issues', '_blank');
  };

  return (
    <>
      <MenubarContent align="start" className="w-56">
        <MenubarItem onClick={() => setShowShortcuts(true)}>
          <Keyboard className="mr-2 h-4 w-4" />
          Keyboard Shortcuts
        </MenubarItem>
        
        <MenubarItem onClick={handleDocumentation}>
          <FileText className="mr-2 h-4 w-4" />
          Documentation
          <ExternalLink className="ml-auto h-3 w-3" />
        </MenubarItem>
        
        <MenubarSeparator />
        
        <MenubarItem onClick={handleReportIssue}>
          <Bug className="mr-2 h-4 w-4" />
          Report Issue
          <ExternalLink className="ml-auto h-3 w-3" />
        </MenubarItem>
        
        <MenubarSeparator />
        
        <MenubarItem onClick={() => setShowAbout(true)}>
          <Info className="mr-2 h-4 w-4" />
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
