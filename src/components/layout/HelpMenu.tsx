import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  HelpCircle, 
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
      <DropdownMenu>
        <DropdownMenuTrigger className="font-medium hover:text-foreground transition-colors outline-none">
          Help
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem 
            onClick={() => setShowShortcuts(true)}
            className="cursor-pointer"
          >
            <Keyboard className="mr-2 h-4 w-4" />
            Keyboard Shortcuts
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleDocumentation}
            className="cursor-pointer"
          >
            <FileText className="mr-2 h-4 w-4" />
            Documentation
            <ExternalLink className="ml-auto h-3 w-3" />
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleReportIssue}
            className="cursor-pointer"
          >
            <Bug className="mr-2 h-4 w-4" />
            Report Issue
            <ExternalLink className="ml-auto h-3 w-3" />
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setShowAbout(true)}
            className="cursor-pointer"
          >
            <Info className="mr-2 h-4 w-4" />
            About Vector
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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