import type { Shape } from '@/types/canvas';

interface ShapeRendererProps {
  shape: Shape;
  isPreview?: boolean;
}

export function ShapeRenderer({ shape, isPreview = false }: ShapeRendererProps) {
  const commonProps = {
    fill: shape.fill || 'transparent',
    stroke: shape.stroke || '#000000',
    strokeWidth: shape.strokeWidth ?? 1,
    opacity: shape.opacity ?? 1,
    style: isPreview ? { pointerEvents: 'none' as const, opacity: 0.7 } : undefined,
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

    case 'text': {
      const fontSize = shape.fontSize ?? 16;
      const fontFamily = shape.fontFamily || 'Inter, system-ui, sans-serif';
      const fontWeight = shape.fontWeight || 'normal';
      const fontStyle = shape.fontStyle || 'normal';
      const textAlign = shape.textAlign || 'start';
      const text = shape.text || 'Text';

      let textAnchor: 'start' | 'middle' | 'end' = 'start';
      let adjustedX = shape.x;

      if (textAlign === 'middle') {
        textAnchor = 'middle';
        adjustedX = shape.x + shape.width / 2;
      } else if (textAlign === 'end') {
        textAnchor = 'end';
        adjustedX = shape.x + shape.width;
      }

      return (
        <text
          x={adjustedX}
          y={shape.y + shape.height / 2}
          fontSize={fontSize}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          fontStyle={fontStyle}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          {...commonProps}
          fill={shape.fill || '#000000'}
        >
          {text}
        </text>
      );
    }

    default:
      return null;
  }
}
