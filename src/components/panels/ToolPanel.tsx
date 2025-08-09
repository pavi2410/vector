import { useStore } from '@nanostores/react';
import { editorStore, setActiveTool } from '@/stores/editorState';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  MousePointer2, 
  Square, 
  Circle, 
  Minus, 
  Type, 
  Pen 
} from 'lucide-react';

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'line', icon: Minus, label: 'Line' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'path', icon: Pen, label: 'Path' },
] as const;

export function ToolPanel() {
  const { activeTool } = useStore(editorStore);

  return (
    <TooltipProvider>
      <div className="p-2 flex gap-2 items-center">
        {tools.map(({ id, icon: Icon, label }) => (
          <Tooltip key={id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setActiveTool(id)}
                className={cn(
                  "size-8 flex items-center justify-center rounded-md transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  activeTool === id && "bg-accent text-accent-foreground"
                )}
              >
                <Icon size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}