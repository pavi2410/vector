import { useStore } from '@nanostores/react';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignVerticalJustifyStart, 
  AlignVerticalJustifyCenter, 
  AlignVerticalJustifyEnd,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter
} from 'lucide-react';
import { canvasStore, updateMultipleShapes } from '@/stores/canvas';
import { selectionStore } from '@/stores/selection';
import { Button } from '@/components/ui/button';
import { 
  alignLeft, 
  alignCenter, 
  alignRight, 
  alignTop, 
  alignMiddle, 
  alignBottom,
  distributeHorizontally,
  distributeVertically
} from '@/utils/alignment';

export function AlignmentSection() {
  const { frame } = useStore(canvasStore);
  const { selectedIds } = useStore(selectionStore);
  
  const selectedShapes = frame.shapes.filter(shape => selectedIds.includes(shape.id));

  if (selectedShapes.length < 1) {
    return null;
  }

  const handleAlignment = (alignmentFn: typeof alignLeft) => {
    const updates = alignmentFn(selectedShapes, frame);
    if (updates.length > 0) {
      updateMultipleShapes(updates);
    }
  };

  const canDistribute = selectedShapes.length >= 3;

  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-muted-foreground">Alignment</div>
      
      {/* Horizontal Alignment */}
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleAlignment(alignLeft)}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleAlignment(alignCenter)}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleAlignment(alignRight)}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Vertical Alignment */}
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleAlignment(alignTop)}
          title="Align Top"
        >
          <AlignVerticalJustifyStart className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleAlignment(alignMiddle)}
          title="Align Middle"
        >
          <AlignVerticalJustifyCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleAlignment(alignBottom)}
          title="Align Bottom"
        >
          <AlignVerticalJustifyEnd className="h-4 w-4" />
        </Button>
      </div>

      {/* Distribution (only show when 3+ shapes selected) */}
      {canDistribute && (
        <>
          <div className="text-xs font-medium text-muted-foreground">Distribution</div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleAlignment(distributeHorizontally)}
              title="Distribute Horizontally"
            >
              <AlignHorizontalDistributeCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleAlignment(distributeVertically)}
              title="Distribute Vertically"
            >
              <AlignVerticalDistributeCenter className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}