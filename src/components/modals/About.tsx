import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Github } from 'lucide-react';

interface AboutProps {
  isOpen: boolean;
  onClose: () => void;
}

export function About({ isOpen, onClose }: AboutProps) {
  const handleGitHubClick = () => {
    window.open('https://github.com/pavi2410/vector', '_blank');
  };

  const handleReactFlowClick = () => {
    window.open('https://reactflow.dev', '_blank');
  };

  const handleShadcnClick = () => {
    window.open('https://ui.shadcn.com', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center">
            About Vector
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold">Vector</h2>
            <p className="text-sm text-muted-foreground">Version 0.1.0</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A modern, local-first SVG editor built with React 19, featuring 
              first-class support for SVG filters through a visual node-based 
              pipeline editor.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium mb-2">Built with</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>React 19</span>
                <span>Frontend Framework</span>
              </div>
              <div className="flex items-center justify-between">
                <span>React Flow</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={handleReactFlowClick}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>shadcn/ui</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={handleShadcnClick}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Tailwind CSS</span>
                <span>Styling</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGitHubClick}
              className="flex items-center space-x-2"
            >
              <Github className="w-4 h-4" />
              <span>View on GitHub</span>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Vibed by{' '}
              <a
                href="https://pavi2410.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline hover:text-foreground transition-colors"
              >
                pavi2410
              </a>
              {' '}and coded by Claude.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}