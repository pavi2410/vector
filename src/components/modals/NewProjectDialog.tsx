import { useState } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { createNewProject, hasUnsavedChanges } from '@/stores/project';

interface NewProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_SIZES = [
  { name: 'Web (1920×1080)', width: 1920, height: 1080 },
  { name: 'Mobile (375×812)', width: 375, height: 812 },
  { name: 'Tablet (768×1024)', width: 768, height: 1024 },
  { name: 'Desktop (1440×900)', width: 1440, height: 900 },
  { name: 'Print A4 (210×297mm)', width: 794, height: 1123 }, // 210×297mm at 96 DPI
  { name: 'Square (1080×1080)', width: 1080, height: 1080 },
];

export function NewProjectDialog({ onClose }: NewProjectDialogProps) {
  const [projectName, setProjectName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customWidth, setCustomWidth] = useState(512);
  const [customHeight, setCustomHeight] = useState(512);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  const handleCreate = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedWarning(true);
      return;
    }
    
    createProject();
  };

  const handleForceCreate = () => {
    createProject();
  };

  const createProject = () => {
    const name = projectName.trim() || 'Untitled Project';
    
    createNewProject(name);
    
    // Recent files will be automatically updated when project is saved to localStorage

    onClose();
    resetForm();
  };

  const resetForm = () => {
    setProjectName('');
    setSelectedPreset(0);
    setCustomWidth(512);
    setCustomHeight(512);
    setShowUnsavedWarning(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (showUnsavedWarning) {
    return (
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogDescription>
            You have unsaved changes in your current project. Creating a new project will discard these changes.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowUnsavedWarning(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleForceCreate}>
            Discard Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogDescription>
          Start a new vector project with your preferred dimensions.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="project-name">Project Name</Label>
          <Input
            id="project-name"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <Label>Canvas Size</Label>
          
          <div className="grid grid-cols-2 gap-3">
            {PRESET_SIZES.map((preset, index) => (
              <Button
                key={preset.name}
                variant={selectedPreset === index ? "default" : "outline"}
                className="justify-start h-auto p-4"
                onClick={() => setSelectedPreset(index)}
              >
                <div className="text-left">
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {preset.width} × {preset.height}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="width">Custom Width</Label>
              <Input
                id="width"
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value))}
                min="1"
                max="10000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Custom Height</Label>
              <Input
                id="height"
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(Number(e.target.value))}
                min="1"
                max="10000"
              />
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleCreate}>
          Create Project
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}