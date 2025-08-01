import { useStore } from '@nanostores/react';
import { canvasStore } from '@/stores/canvas';
import { selectionStore, selectShape } from '@/stores/selection';
import { cn } from '@/lib/utils';
import { Eye, Unlock } from 'lucide-react';

export function LayersPanel() {
  const { shapes } = useStore(canvasStore);
  const { selectedIds } = useStore(selectionStore);

  return (
    <div className="p-4">
      <div className="text-sm font-medium mb-3">Layers</div>
      <div className="space-y-1">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className={cn(
              "flex items-center justify-between p-2 rounded-md cursor-pointer",
              "hover:bg-accent hover:text-accent-foreground text-sm",
              selectedIds.includes(shape.id) && "bg-accent text-accent-foreground"
            )}
            onClick={() => selectShape(shape.id)}
          >
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary/20 rounded-sm border" />
              <span className="capitalize">{shape.type}</span>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-1 hover:bg-background rounded">
                <Eye size={12} />
              </button>
              <button className="p-1 hover:bg-background rounded">
                <Unlock size={12} />
              </button>
            </div>
          </div>
        ))}
        {shapes.length === 0 && (
          <div className="text-muted-foreground text-sm py-4 text-center">
            No layers yet
          </div>
        )}
      </div>
    </div>
  );
}