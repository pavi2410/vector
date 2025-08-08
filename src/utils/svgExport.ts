import type { CanvasState, Shape, Frame } from '@/types/canvas';

/**
 * Generate SVG markup for a single shape
 */
function renderShapeToSVG(shape: Shape): string {
  const commonAttrs = {
    fill: shape.fill || 'transparent',
    stroke: shape.stroke || '#000000',
    'stroke-width': shape.strokeWidth || 1,
    opacity: shape.opacity || 1,
  };

  const attrsString = Object.entries(commonAttrs)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  switch (shape.type) {
    case 'rectangle':
      return `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" ${attrsString} />`;

    case 'circle':
      const cx = shape.x + shape.width / 2;
      const cy = shape.y + shape.height / 2;
      const rx = shape.width / 2;
      const ry = shape.height / 2;
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${attrsString} />`;

    case 'line':
      const x1 = shape.x;
      const y1 = shape.y;
      const x2 = shape.x + shape.width;
      const y2 = shape.y + shape.height;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${attrsString} />`;

    case 'text':
      const textAttrs = Object.entries({
        ...commonAttrs,
        fill: shape.fill || '#000000',
        'font-size': '16'
      })
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
      return `<text x="${shape.x}" y="${shape.y + 16}" ${textAttrs}>Text</text>`;

    default:
      return '';
  }
}

/**
 * Generate SVG markup for a frame background
 */
function renderFrameToSVG(frame: Frame): string {
  return `<rect x="0" y="0" width="${frame.width}" height="${frame.height}" fill="${frame.backgroundColor || '#ffffff'}" stroke="none" />`;
}

/**
 * Generate complete SVG content from canvas state
 */
export function generateSVGFromCanvas(
  canvas: CanvasState,
  options: {
    width?: number;
    height?: number;
    viewBox?: string;
    includeBackground?: boolean;
    selectedOnly?: boolean;
    selectedIds?: string[];
  } = {}
): string {
  const {
    width = canvas.frame.width,
    height = canvas.frame.height,
    viewBox = `0 0 ${canvas.frame.width} ${canvas.frame.height}`,
    includeBackground = true,
    selectedOnly = false,
    selectedIds = []
  } = options;

  // Filter shapes if selectedOnly is true
  const shapesToRender = selectedOnly 
    ? canvas.frame.shapes.filter(shape => selectedIds.includes(shape.id))
    : canvas.frame.shapes;

  // Generate frame background
  const frameElement = includeBackground 
    ? renderFrameToSVG(canvas.frame)
    : '';

  // Generate shape elements
  const shapeElements = shapesToRender
    .map(shape => renderShapeToSVG(shape))
    .join('\n  ');

  // Combine all elements
  const content = [frameElement, shapeElements]
    .filter(Boolean)
    .join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">
  ${content}
</svg>`;
}

/**
 * Create a thumbnail SVG with smaller dimensions for project gallery
 */
export function createThumbnailSVG(
  canvas: CanvasState,
  options: {
    width?: number;
    height?: number;
    includeBackground?: boolean;
  } = {}
): string {
  const {
    width = 200,
    height = 150,
    includeBackground = true
  } = options;

  return generateSVGFromCanvas(canvas, {
    width,
    height,
    includeBackground,
    selectedOnly: false
  });
}

/**
 * Convert SVG string to data URL for storage
 */
export function svgToDataUrl(svgString: string): string {
  const base64 = btoa(unescape(encodeURIComponent(svgString)));
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Get SVG content from current canvas state with export options
 */
export function exportCanvasToSVG(
  canvas: CanvasState,
  exportOptions: {
    includeBackground?: boolean;
    selectedOnly?: boolean;
    selectedIds?: string[];
  } = {}
): string {
  return generateSVGFromCanvas(canvas, {
    width: canvas.frame.width,
    height: canvas.frame.height,
    ...exportOptions
  });
}