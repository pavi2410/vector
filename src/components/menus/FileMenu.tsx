import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { useFileShortcuts } from '@/hooks/useFileShortcuts';
import {
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarShortcut,
} from '@/components/ui/menubar';
import { Dialog } from '@/components/ui/dialog';
import { NewProjectDialog } from '../modals/NewProjectDialog';
import { SaveProjectDialog } from '../modals/SaveProjectDialog';
import { ExportDialog } from '../modals/ExportDialog';
import { OpenProjectDialog } from '../modals/OpenProjectDialog';
import { 
  currentProjectStore, 
  hasUnsavedChanges,
  recentFilesStore,
  loadProjectFromLocalStorage,
  saveProjectToLocalStorage,
  isProjectSavedInLocalStorage
} from '@/stores/project';
import { 
  FileText, 
  FolderOpen, 
  Save, 
  Download, 
  Upload, 
  History
} from 'lucide-react';

export function FileMenu() {
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [openProjectOpen, setOpenProjectOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  
  const currentProject = useStore(currentProjectStore);
  const recentFiles = useStore(recentFilesStore);
  
  const handleNewProject = () => {
    if (hasUnsavedChanges()) {
      // TODO: Show unsaved changes dialog
      console.warn('Unsaved changes detected');
    }
    setNewProjectOpen(true);
  };

  const handleSave = () => {
    if (currentProject && isProjectSavedInLocalStorage(currentProject.id)) {
      // Project exists in localStorage, save directly
      saveProjectToLocalStorage();
    } else {
      // New project or not in localStorage, open save dialog
      setSaveDialogOpen(true);
    }
  };

  const handleSaveAs = () => {
    setSaveDialogOpen(true);
  };

  const handleOpenProject = () => {
    setOpenProjectOpen(true);
  };

  const handleExport = () => {
    setExportDialogOpen(true);
  };
  
  // Connect file shortcuts to dialog handlers
  useFileShortcuts({
    onNewProject: handleNewProject,
    onOpenProject: handleOpenProject,
    onSaveProject: handleSaveAs,
    onExportProject: handleExport
  });

  const handleOpenRecent = (fileId: string) => {
    loadProjectFromLocalStorage(fileId);
  };

  const handleImport = () => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.vector,.svg';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // TODO: Implement file import
        console.log('Importing file:', file.name);
      }
    };
    input.click();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <MenubarContent align="start" className="w-56">
        <MenubarItem onClick={handleNewProject}>
          <FileText className="w-4 h-4 mr-2" />
          New Project
          <MenubarShortcut>⌘N</MenubarShortcut>
        </MenubarItem>
        
        <MenubarItem onClick={handleOpenProject}>
          <FolderOpen className="w-4 h-4 mr-2" />
          Open Project
          <MenubarShortcut>⌘O</MenubarShortcut>
        </MenubarItem>

        {recentFiles.length > 0 && (
          <MenubarSub>
            <MenubarSubTrigger>
              <History className="w-4 h-4 mr-2" />
              Recent Files
            </MenubarSubTrigger>
            <MenubarSubContent className="w-64">
              {recentFiles.slice(0, 8).map((file) => (
                <MenubarItem 
                  key={file.id}
                  onClick={() => handleOpenRecent(file.id)}
                  className="flex flex-col items-start py-2"
                >
                  <span className="font-medium truncate w-full">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(file.lastOpened)}
                  </span>
                </MenubarItem>
              ))}
            </MenubarSubContent>
          </MenubarSub>
        )}

        <MenubarSeparator />

        <MenubarItem 
          onClick={handleSave}
          disabled={!currentProject && !hasUnsavedChanges()}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
          <MenubarShortcut>⌘S</MenubarShortcut>
        </MenubarItem>

        <MenubarItem onClick={handleSaveAs}>
          <Save className="w-4 h-4 mr-2" />
          Save As...
          <MenubarShortcut>⌘⇧S</MenubarShortcut>
        </MenubarItem>

        <MenubarSeparator />

        <MenubarItem onClick={handleImport}>
          <Upload className="w-4 h-4 mr-2" />
          Import
        </MenubarItem>

        <MenubarItem onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
          <MenubarShortcut>⌘E</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>

      <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
        <NewProjectDialog 
          isOpen={newProjectOpen}
          onClose={() => setNewProjectOpen(false)}
        />
      </Dialog>

      <Dialog open={openProjectOpen} onOpenChange={setOpenProjectOpen}>
        <OpenProjectDialog 
          isOpen={openProjectOpen}
          onClose={() => setOpenProjectOpen(false)}
        />
      </Dialog>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <SaveProjectDialog 
          isOpen={saveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
        />
      </Dialog>

      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <ExportDialog 
          isOpen={exportDialogOpen}
          onClose={() => setExportDialogOpen(false)}
        />
      </Dialog>
    </>
  );
}