import { useStore } from '@nanostores/react';
import { toolStore, setActiveTool } from '@/stores/tools';
import { cn } from '@/lib/utils';
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
  const { activeTool } = useStore(toolStore);

  return (
    <div className="p-2 space-y-2">
      {tools.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => setActiveTool(id)}
          className={cn(
            "w-12 h-12 flex items-center justify-center rounded-md transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            activeTool === id && "bg-accent text-accent-foreground"
          )}
          title={label}
        >
          <Icon size={20} />
        </button>
      ))}
    </div>
  );
}