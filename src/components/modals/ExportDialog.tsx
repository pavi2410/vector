import { useState } from 'react';
import { useStore } from '@nanostores/react';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { currentProjectStore } from '@/stores/project';
import { selectionStore } from '@/stores/selection';
import type { ExportOptions } from '@/types/project';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const EXPORT_FORMATS = [
  { value: 'svg', label: 'SVG', description: 'Vector format, best for web and print' },
  { value: 'png', label: 'PNG', description: 'High quality raster with transparency' },
  { value: 'jpeg', label: 'JPEG', description: 'Compressed raster, smaller file size' },
  { value: 'pdf', label: 'PDF', description: 'Print-ready document format' },
] as const;

export function ExportDialog({ onClose }: ExportDialogProps) {
  const currentProject = useStore(currentProjectStore);
  const selection = useStore(selectionStore);
  
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'svg',
    quality: 90,
    scale: 1,
    includeBackground: true,
    selectedOnly: false
  });
  const [fileName, setFileName] = useState(currentProject?.name || 'untitled');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // TODO: Implement actual export functionality
      console.log('Exporting with options:', { fileName, ...exportOptions });
      
      if (exportOptions.format === 'svg') {
        await exportSVG();
      } else if (exportOptions.format === 'png') {
        await exportPNG();
      } else if (exportOptions.format === 'jpeg') {
        await exportJPEG();
      } else if (exportOptions.format === 'pdf') {
        await exportPDF();
      }
      
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      // TODO: Show error toast
    } finally {
      setIsExporting(false);
    }
  };

  const exportSVG = async () => {
    // Create SVG content from canvas
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <!-- TODO: Implement actual SVG generation -->
      <rect width="100%" height="100%" fill="${exportOptions.includeBackground ? '#ffffff' : 'none'}"/>
    </svg>`;
    
    downloadFile(svgContent, `${fileName}.svg`, 'image/svg+xml');
  };

  const exportPNG = async () => {
    // TODO: Implement PNG export using canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = 512 * exportOptions.scale!;
    canvas.height = 512 * exportOptions.scale!;

    if (exportOptions.includeBackground) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };

  const exportJPEG = async () => {
    // Similar to PNG but with quality setting
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = 512 * exportOptions.scale!;
    canvas.height = 512 * exportOptions.scale!;

    // JPEG always needs a background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/jpeg', exportOptions.quality! / 100);
  };

  const exportPDF = async () => {
    // TODO: Implement PDF export
    console.log('PDF export not yet implemented');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const updateOption = <K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  const hasSelection = selection.selectedIds.length > 0;

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Export</DialogTitle>
        <DialogDescription>
          Export your project in various formats.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="export-filename">File Name</Label>
          <Input
            id="export-filename"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            disabled={isExporting}
          />
        </div>

        <div className="space-y-3">
          <Label>Format</Label>
          <div className="grid grid-cols-2 gap-2">
            {EXPORT_FORMATS.map((format) => (
              <Button
                key={format.value}
                variant={exportOptions.format === format.value ? "default" : "outline"}
                className="justify-start h-auto p-3"
                onClick={() => updateOption('format', format.value)}
                disabled={isExporting}
              >
                <div className="text-left">
                  <div className="font-medium">{format.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {format.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {(exportOptions.format === 'png' || exportOptions.format === 'jpeg') && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Scale: {exportOptions.scale}x</Label>
              <Slider
                value={[exportOptions.scale!]}
                onValueChange={([value]) => updateOption('scale', value)}
                min={0.5}
                max={4}
                step={0.5}
                disabled={isExporting}
              />
              <div className="text-xs text-muted-foreground">
                Higher scales produce larger, higher quality images
              </div>
            </div>
          </div>
        )}

        {exportOptions.format === 'jpeg' && (
          <div className="space-y-2">
            <Label>Quality: {exportOptions.quality}%</Label>
            <Slider
              value={[exportOptions.quality!]}
              onValueChange={([value]) => updateOption('quality', value)}
              min={10}
              max={100}
              step={5}
              disabled={isExporting}
            />
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <Label>Options</Label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={exportOptions.includeBackground}
                onChange={(e) => updateOption('includeBackground', e.target.checked)}
                disabled={isExporting || exportOptions.format === 'jpeg'}
                className="rounded"
              />
              <span className="text-sm">Include background</span>
            </label>
            
            {hasSelection && (
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions.selectedOnly}
                  onChange={(e) => updateOption('selectedOnly', e.target.checked)}
                  disabled={isExporting}
                  className="rounded"
                />
                <span className="text-sm">Export selected objects only</span>
              </label>
            )}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isExporting}>
          Cancel
        </Button>
        <Button 
          onClick={handleExport}
          disabled={isExporting || !fileName.trim()}
        >
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}