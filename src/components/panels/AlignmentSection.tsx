import { useStore } from '@nanostores/react';
import {
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconLayoutAlignTop,
  IconLayoutAlignMiddle,
  IconLayoutAlignBottom,
  IconLayoutDistributeHorizontal,
  IconLayoutDistributeVertical
} from '@tabler/icons-react';
import { canvasStore, updateMultipleShapes } from '@/stores/canvas';
import { editorStore } from '@/stores/editorState';
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
  const { selectedIds } = useStore(editorStore);
  
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
      {/* Horizontal Alignment */}
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleAlignment(alignLeft)}
          title="Align Left"
        >
          <IconAlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleAlignment(alignCenter)}
          title="Align Center"
        >
          <IconAlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleAlignment(alignRight)}
          title="Align Right"
        >
          <IconAlignRight className="h-4 w-4" />
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
          <IconLayoutAlignTop className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleAlignment(alignMiddle)}
          title="Align Middle"
        >
          <IconLayoutAlignMiddle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleAlignment(alignBottom)}
          title="Align Bottom"
        >
          <IconLayoutAlignBottom className="h-4 w-4" />
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
              <IconLayoutDistributeHorizontal className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleAlignment(distributeVertically)}
              title="Distribute Vertically"
            >
              <IconLayoutDistributeVertical className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}