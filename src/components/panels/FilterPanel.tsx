import { useStore } from '@nanostores/react';
import { filterStore } from '@/stores/filters';

export function FilterPanel() {
  const { activePipeline, previewEnabled } = useStore(filterStore);

  return (
    <div className="h-full bg-background rounded-md border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Filter Pipeline</h3>
        <div className="flex items-center space-x-2">
          <label className="text-xs">
            <input
              type="checkbox"
              checked={previewEnabled}
              onChange={() => {/* TODO: implement toggle */}}
              className="mr-1"
            />
            Preview
          </label>
        </div>
      </div>
      
      {!activePipeline ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          No filter pipeline selected
        </div>
      ) : (
        <div className="h-32 bg-muted/50 rounded border-2 border-dashed border-border flex items-center justify-center">
          <div className="text-muted-foreground text-sm">
            React Flow will be integrated here
          </div>
        </div>
      )}
    </div>
  );
}