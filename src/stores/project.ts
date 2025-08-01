import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import type { Project, ProjectSettings } from '../types/project';
import { DEFAULT_PROJECT_SETTINGS, PROJECT_VERSION } from '../types/project';
import { canvasStore } from './canvas';

// Current project state
export const currentProjectStore = atom<Project | null>(null);

// Project settings with persistence
export const projectSettingsStore = persistentAtom<ProjectSettings>('vector-project-settings', DEFAULT_PROJECT_SETTINGS, {
  encode: JSON.stringify,
  decode: JSON.parse
});

// Auto-save enabled state
export const autoSaveEnabledStore = atom<boolean>(true);

// Generate unique project ID
const generateProjectId = (): string => {
  return `project-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Create a new project
export const createNewProject = (name: string = 'Untitled Project'): Project => {
  const now = new Date();
  const canvas = canvasStore.get();
  
  const newProject: Project = {
    id: generateProjectId(),
    name,
    createdAt: now,
    modifiedAt: now,
    canvas,
    settings: projectSettingsStore.get(),
    version: PROJECT_VERSION
  };

  currentProjectStore.set(newProject);
  return newProject;
};

// Load project and sync with canvas
export const loadProject = (project: Project) => {
  currentProjectStore.set(project);
  canvasStore.set(project.canvas);
  projectSettingsStore.set(project.settings);
};

// Save current project state
export const saveCurrentProject = () => {
  const currentProject = currentProjectStore.get();
  if (!currentProject) return null;

  const updatedProject: Project = {
    ...currentProject,
    modifiedAt: new Date(),
    canvas: canvasStore.get(),
    settings: projectSettingsStore.get()
  };

  currentProjectStore.set(updatedProject);
  return updatedProject;
};

// Update project metadata
export const updateProjectName = (name: string) => {
  const currentProject = currentProjectStore.get();
  if (!currentProject) return;

  const updatedProject: Project = {
    ...currentProject,
    name,
    modifiedAt: new Date()
  };

  currentProjectStore.set(updatedProject);
};

// Check if project has unsaved changes
export const hasUnsavedChanges = (): boolean => {
  const currentProject = currentProjectStore.get();
  if (!currentProject) return false;

  const currentCanvas = canvasStore.get();
  return JSON.stringify(currentProject.canvas) !== JSON.stringify(currentCanvas);
};

// Auto-save functionality
let autoSaveInterval: NodeJS.Timeout | null = null;

const startAutoSave = () => {
  if (autoSaveInterval) clearInterval(autoSaveInterval);
  
  autoSaveInterval = setInterval(() => {
    const isEnabled = autoSaveEnabledStore.get();
    const hasProject = currentProjectStore.get() !== null;
    
    if (isEnabled && hasProject && hasUnsavedChanges()) {
      saveCurrentProject();
    }
  }, 5000); // Auto-save every 5 seconds
};

const stopAutoSave = () => {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
  }
};

// Initialize auto-save when settings change
projectSettingsStore.subscribe((settings) => {
  if (settings.autoSave) {
    startAutoSave();
  } else {
    stopAutoSave();
  }
});

// Start auto-save initially if enabled
if (projectSettingsStore.get().autoSave) {
  startAutoSave();
}

// Export project data for saving to file
export const exportProjectData = (project?: Project): string => {
  const projectToExport = project || currentProjectStore.get();
  if (!projectToExport) throw new Error('No project to export');
  
  return JSON.stringify(projectToExport, null, 2);
};

// Import project data from file
export const importProjectData = (jsonData: string): Project => {
  try {
    const project = JSON.parse(jsonData) as Project;
    
    // Validate required fields
    if (!project.id || !project.name || !project.canvas) {
      throw new Error('Invalid project file format');
    }

    // Ensure dates are Date objects
    project.createdAt = new Date(project.createdAt);
    project.modifiedAt = new Date(project.modifiedAt);

    // Set version if missing
    if (!project.version) {
      project.version = PROJECT_VERSION;
    }

    // Merge with default settings for missing properties
    project.settings = { ...DEFAULT_PROJECT_SETTINGS, ...project.settings };

    return project;
  } catch (error) {
    throw new Error(`Failed to parse project file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};