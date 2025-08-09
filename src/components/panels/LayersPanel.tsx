import { useStore } from '@nanostores/react';
import { canvasStore, removeShape } from '@/stores/canvas';
import { editorStore, selectShape, clearSelection } from '@/stores/editorState';
import { cn } from '@/lib/utils';
import { Eye, Unlock, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LayersPanel() {
  const { frame } = useStore(canvasStore);
  const { shapes } = frame;
  const { selectedIds } = useStore(editorStore);

  const handleDeleteShape = (shapeId: string) => {
    removeShape(shapeId);
    // Clear selection if the deleted shape was selected
    if (selectedIds.includes(shapeId)) {
      clearSelection();
    }
  };

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="p-1 hover:bg-background rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={12} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteShape(shape.id);
                    }}
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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