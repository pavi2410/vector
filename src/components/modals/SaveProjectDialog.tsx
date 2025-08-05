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
import { 
  currentProjectStore, 
  saveCurrentProject, 
  updateProjectName,
  exportProjectData,
  saveProjectToLocalStorage
} from '@/stores/project';

interface SaveProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SaveProjectDialog({ onClose }: SaveProjectDialogProps) {
  const currentProject = useStore(currentProjectStore);
  const [projectName, setProjectName] = useState(currentProject?.name || 'Untitled Project');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update project name if changed
      if (currentProject && projectName !== currentProject.name) {
        updateProjectName(projectName);
      }

      // Save the project
      const savedProject = saveCurrentProject();
      
      if (savedProject) {
        // Export project data as JSON file
        const projectData = exportProjectData(savedProject);
        const blob = new Blob([projectData], { type: 'application/json' });
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${projectName}.vector`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Recent files will be automatically updated via computed store

        onClose();
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      // TODO: Show error toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveToLocalStorage = () => {
    setIsSaving(true);
    
    try {
      // Update project name if changed
      if (currentProject && projectName !== currentProject.name) {
        updateProjectName(projectName);
      }

      // Save the project to localStorage with thumbnail generation
      const savedProject = saveProjectToLocalStorage();
      
      if (savedProject) {
        // Recent files will be automatically updated via computed store

        onClose();
      }
    } catch (error) {
      console.error('Failed to save project to localStorage:', error);
      // TODO: Show error toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
    setProjectName(currentProject?.name || 'Untitled Project');
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Save Project</DialogTitle>
        <DialogDescription>
          Save your project to continue working on it later.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="save-project-name">Project Name</Label>
          <Input
            id="save-project-name"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            disabled={isSaving}
          />
        </div>

        <div className="text-sm text-muted-foreground">
          You can save to a file for sharing or backup, or save to browser storage for quick access.
        </div>
      </div>

      <DialogFooter className="flex-col gap-2 sm:flex-row">
        <Button variant="outline" onClick={handleClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleSaveToLocalStorage}
          disabled={isSaving || !projectName.trim()}
        >
          {isSaving ? 'Saving...' : 'Save to Browser'}
        </Button>
        <Button 
          onClick={handleSave}
          disabled={isSaving || !projectName.trim()}
        >
          {isSaving ? 'Saving...' : 'Download File'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}