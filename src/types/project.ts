import type { CanvasState } from './canvas';

export interface ProjectSettings {
  autoSave: boolean;
  gridVisible: boolean;
  snapToGrid: boolean;
  gridSize: number;
  theme: 'light' | 'dark' | 'auto';
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  modifiedAt: Date;
  canvas: CanvasState;
  settings: ProjectSettings;
  version: string;
}

export interface RecentFile {
  id: string;
  name: string;
  lastOpened: Date;
  thumbnail?: string; // base64 encoded thumbnail
}

export interface ExportOptions {
  format: 'svg' | 'png' | 'jpeg' | 'pdf';
  quality?: number; // for JPEG
  scale?: number; // for PNG/JPEG
  includeBackground?: boolean;
  selectedOnly?: boolean;
}

export interface ImportOptions {
  format: 'svg';
  replaceCanvas?: boolean;
  preserveIds?: boolean;
}

export const DEFAULT_PROJECT_SETTINGS: ProjectSettings = {
  autoSave: true,
  gridVisible: false,
  snapToGrid: false,
  gridSize: 10,
  theme: 'auto'
};

export const PROJECT_VERSION = '1.0.0';