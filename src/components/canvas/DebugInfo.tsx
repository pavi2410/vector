import { useStore } from '@nanostores/react';
import { editorStore } from '@/stores/editorState';
import { mouseStore } from '@/stores/mouse';

export function DebugInfo() {
  const { selectedIds, hoveredId, activeTool } = useStore(editorStore);
  const { x, y, screenX, screenY } = useStore(mouseStore);

  return (
    <div className="absolute top-4 right-4 bg-black/80 text-white text-xs p-3 rounded font-mono space-y-1 z-50">
      <div className="text-yellow-300 font-semibold">Debug Info:</div>
      <div>Tool: <span className="text-green-300">{activeTool}</span></div>
      <div>Selected: <span className="text-blue-300">[{selectedIds.join(', ')}]</span></div>
      <div>Hovered: <span className="text-purple-300">{hoveredId || 'none'}</span></div>
      <div className="border-t border-gray-600 pt-1">
        <div>Screen: <span className="text-gray-300">({screenX.toFixed(0)}, {screenY.toFixed(0)})</span></div>
        <div>SVG: <span className="text-green-300">({x.toFixed(1)}, {y.toFixed(1)})</span></div>
      </div>
    </div>
  );
}
