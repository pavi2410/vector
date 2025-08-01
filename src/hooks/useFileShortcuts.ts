import { useHotkeys } from 'react-hotkeys-hook';
import { useStore } from '@nanostores/react';
import { 
  createNewProject, 
  saveCurrentProject, 
  hasUnsavedChanges, 
  currentProjectStore 
} from '@/stores/project';

interface FileShortcutsOptions {
  onNewProject?: () => void;
  onSaveProject?: () => void;
  onExportProject?: () => void;
}

export function useFileShortcuts(options: FileShortcutsOptions = {}) {
  const currentProject = useStore(currentProjectStore);

  // Cmd+N / Ctrl+N - New Project
  useHotkeys('ctrl+n, cmd+n', (event) => {
    event.preventDefault();
    if (options.onNewProject) {
      options.onNewProject();
    } else if (hasUnsavedChanges()) {
      console.warn('Unsaved changes detected');
    } else {
      createNewProject();
    }
  }, {
    enableOnFormTags: false,
  });

  // Cmd+S / Ctrl+S - Save Project
  useHotkeys('ctrl+s, cmd+s', (event) => {
    event.preventDefault();
    if (options.onSaveProject) {
      options.onSaveProject();
    } else if (currentProject) {
      saveCurrentProject();
    }
  }, {
    enableOnFormTags: false,
  });

  // Cmd+Shift+S / Ctrl+Shift+S - Save As
  useHotkeys('ctrl+shift+s, cmd+shift+s', (event) => {
    event.preventDefault();
    options.onSaveProject?.();
  }, {
    enableOnFormTags: false,
  });

  // Cmd+E / Ctrl+E - Export Project
  useHotkeys('ctrl+e, cmd+e', (event) => {
    event.preventDefault();
    options.onExportProject?.();
  }, {
    enableOnFormTags: false,
  });
}