import type { Shape, Group } from '@/types/canvas';
import { ShapeRenderer } from './ShapeRenderer';
import { getRenderableShapes } from '@/utils/zIndex';

interface GroupRendererProps {
  group: Group;
  shapes: Shape[];
  isPreview?: boolean;
  _visited?: Set<string>; // internal: tracks ancestor IDs to break circular references
}

export function GroupRenderer({ group, shapes, isPreview = false, _visited }: GroupRendererProps) {
  const visited = _visited ?? new Set<string>();

  // Guard against circular group references — break the cycle immediately
  if (visited.has(group.id)) {
    console.warn(`[GroupRenderer] Circular group reference detected for id="${group.id}". Skipping render.`);
    return null;
  }

  const nextVisited = new Set(visited);
  nextVisited.add(group.id);

  const childShapes = shapes.filter(s => group.children?.includes(s.id));
  const sortedChildren = getRenderableShapes(childShapes);

  const transform = group.rotation
    ? `rotate(${group.rotation} ${group.x + group.width / 2} ${group.y + group.height / 2})`
    : undefined;

  return (
    <g
      data-shape-id={group.id}
      transform={transform}
      opacity={group.opacity ?? 1}
      style={isPreview ? { opacity: 0.7 } : undefined}
    >
      {sortedChildren.map((child) => {
        if (child.type === 'group') {
          return (
            <GroupRenderer
              key={child.id}
              group={child as Group}
              shapes={shapes}
              isPreview={isPreview}
              _visited={nextVisited}
            />
          );
        } else {
          return <ShapeRenderer key={child.id} shape={child} isPreview={isPreview} />;
        }
      })}
    </g>
  );
}
