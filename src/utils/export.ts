import type { Shape, CanvasState } from '../types/canvas';
import type { ExportOptions } from '../types/project';

// Convert shapes to SVG elements
const shapeToSVG = (shape: Shape): string => {
  const { x, y, width, height, fill = '#000000', stroke, strokeWidth = 0, opacity = 1, rotation = 0 } = shape;
  
  const transform = rotation !== 0 ? `transform="rotate(${rotation} ${x + width/2} ${y + height/2})"` : '';
  const fillAttr = fill ? `fill="${fill}"` : 'fill="none"';
  const strokeAttr = stroke ? `stroke="${stroke}" stroke-width="${strokeWidth}"` : '';
  const opacityAttr = opacity !== 1 ? `opacity="${opacity}"` : '';
  
  const commonAttrs = `${transform} ${fillAttr} ${strokeAttr} ${opacityAttr}`.trim();

  switch (shape.type) {
    case 'rectangle':
      return `<rect x="${x}" y="${y}" width="${width}" height="${height}" ${commonAttrs} />`;
    
    case 'circle':
      const radius = Math.min(width, height) / 2;
      const cx = x + width / 2;
      const cy = y + height / 2;
      return `<circle cx="${cx}" cy="${cy}" r="${radius}" ${commonAttrs} />`;
    
    case 'line':
      return `<line x1="${x}" y1="${y}" x2="${x + width}" y2="${y + height}" ${strokeAttr} ${opacityAttr} />`;
    
    case 'text':
      // TODO: Implement text rendering with proper font handling
      return `<text x="${x}" y="${y}" ${fillAttr} ${opacityAttr}>Text Content</text>`;
    
    case 'path':
      // TODO: Implement path data rendering
      return `<path d="M${x},${y} L${x + width},${y + height}" ${commonAttrs} />`;
    
    default:
      return '';
  }
};

// Generate SVG content from canvas state
export const generateSVG = (
  canvasState: CanvasState,
  options: ExportOptions = { format: 'svg', includeBackground: true, selectedOnly: false }
): string => {
  const { shapes, frames, viewBox } = canvasState;
  const { includeBackground, selectedOnly } = options;
  
  // Use first frame or fallback to viewBox
  const frame = frames[0];
  const width = frame?.width || viewBox.width;
  const height = frame?.height || viewBox.height;
  const bgColor = frame?.backgroundColor || '#ffffff';
  
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`;
  
  // Add background if requested
  if (includeBackground) {
    svgContent += `\n  <rect width="100%" height="100%" fill="${bgColor}" />`;
  }
  
  // Add shapes
  const shapesToExport = selectedOnly ? shapes.filter(() => {
    // TODO: Filter by selection - need to integrate with selection store
    return true; // For now, export all shapes
  }) : shapes;
  
  shapesToExport.forEach(shape => {
    const svgElement = shapeToSVG(shape);
    if (svgElement) {
      svgContent += `\n  ${svgElement}`;
    }
  });
  
  svgContent += '\n</svg>';
  
  return svgContent;
};

// Create canvas for raster export
const createRasterCanvas = (
  canvasState: CanvasState,
  options: ExportOptions
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not create canvas context');
  
  const { shapes, frames } = canvasState;
  const { scale = 1, includeBackground = true } = options;
  
  const frame = frames[0];
  const width = (frame?.width || 512) * scale;
  const height = (frame?.height || 512) * scale;

  canvas.width = width;
  canvas.height = height;
  
  // Set high quality scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // Add background
  if (includeBackground) {
    ctx.fillStyle = frame?.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }
  
  // Draw shapes
  shapes.forEach(shapeItem => {
    drawShapeToCanvas(ctx, shapeItem, scale);
  });
  
  return canvas;
};

// Draw individual shape to canvas
const drawShapeToCanvas = (ctx: CanvasRenderingContext2D, shape: Shape, scale: number = 1) => {
  const { x, y, width, height, fill, stroke, strokeWidth = 0, opacity = 1, rotation = 0 } = shape;
  
  ctx.save();
  
  // Apply transformations
  ctx.globalAlpha = opacity;
  ctx.scale(scale, scale);
  
  if (rotation !== 0) {
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-(x + width / 2), -(y + height / 2));
  }
  
  // Set styles
  if (fill) {
    ctx.fillStyle = fill;
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
  }
  
  // Draw shape
  switch (shape.type) {
    case 'rectangle':
      if (fill) ctx.fillRect(x, y, width, height);
      if (stroke && strokeWidth > 0) ctx.strokeRect(x, y, width, height);
      break;
    
    case 'circle':
      const radius = Math.min(width, height) / 2;
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      if (fill) ctx.fill();
      if (stroke && strokeWidth > 0) ctx.stroke();
      break;
    
    case 'line':
      if (stroke && strokeWidth > 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y + height);
        ctx.stroke();
      }
      break;
    
    case 'text':
      // TODO: Implement text rendering
      if (fill) {
        ctx.font = '16px Arial'; // Default font
        ctx.fillText('Text Content', x, y + 16);
      }
      break;
    
    case 'path':
      // TODO: Implement path rendering
      break;
  }
  
  ctx.restore();
};

// Export as PNG
export const exportPNG = (
  canvasState: CanvasState,
  options: ExportOptions,
  filename: string = 'export.png'
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = createRasterCanvas(canvasState, options);
      
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create PNG blob'));
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        resolve();
      }, 'image/png');
    } catch (error) {
      reject(error);
    }
  });
};

// Export as JPEG
export const exportJPEG = (
  canvasState: CanvasState,
  options: ExportOptions,
  filename: string = 'export.jpg'
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = createRasterCanvas(canvasState, options);
      const quality = (options.quality || 90) / 100;
      
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create JPEG blob'));
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        resolve();
      }, 'image/jpeg', quality);
    } catch (error) {
      reject(error);
    }
  });
};

// Export as PDF (basic implementation)
export const exportPDF = async (
  canvasState: CanvasState,
  options: ExportOptions,
  filename: string = 'export.pdf'
): Promise<void> => {
  // For now, we'll create a simple PDF with the SVG content
  // In a real implementation, you'd use a library like jsPDF or PDFKit
  
  const svgContent = generateSVG(canvasState, options);
  
  // Convert SVG to data URL
  const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgBlob);
  
  // Create a simple HTML page with the SVG for printing to PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { margin: 0; padding: 0; }
          img { width: 100%; height: 100vh; object-fit: contain; }
        </style>
      </head>
      <body>
        <img src="${svgUrl}" alt="Vector Export" />
      </body>
    </html>
  `;
  
  const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
  const htmlUrl = URL.createObjectURL(htmlBlob);
  
  // Open in new window for printing
  const printWindow = window.open(htmlUrl, '_blank');
  if (printWindow) {
    printWindow.addEventListener('load', () => {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
        URL.revokeObjectURL(svgUrl);
        URL.revokeObjectURL(htmlUrl);
      }, 1000);
    });
  }
};