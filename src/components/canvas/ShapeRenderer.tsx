import type { Shape } from '@/types/canvas';
import { cn } from '@/lib/utils';

interface ShapeRendererProps {
  shape: Shape;
  isSelected: boolean;
  isPreview?: boolean;
}

export function ShapeRenderer({ shape, isSelected, isPreview = false }: ShapeRendererProps) {
  const commonProps = {
    fill: shape.fill || 'transparent',
    stroke: shape.stroke || '#000000',
    strokeWidth: shape.strokeWidth || 1,
    opacity: shape.opacity || 1,
    className: cn(
      isPreview && "pointer-events-none opacity-70",
      isSelected && "stroke-blue-500"
    )
  };

  switch (shape.type) {
    case 'rectangle':
      return (
        <rect
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          {...commonProps}
        />
      );

    case 'circle':
      return (
        <ellipse
          cx={shape.x + shape.width / 2}
          cy={shape.y + shape.height / 2}
          rx={shape.width / 2}
          ry={shape.height / 2}
          {...commonProps}
        />
      );

    case 'line':
      return (
        <line
          x1={shape.x}
          y1={shape.y}
          x2={shape.x + shape.width}
          y2={shape.y + shape.height}
          {...commonProps}
          fill="none"
        />
      );

    case 'text':
      return (
        <text
          x={shape.x}
          y={shape.y + 16} // Approximate baseline adjustment
          fontSize="16"
          {...commonProps}
          fill={shape.fill || '#000000'}
        >
          Text
        </text>
      );

    default:
      return null;
  }
}