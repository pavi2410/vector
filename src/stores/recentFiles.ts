import { persistentAtom } from '@nanostores/persistent';
import type { RecentFile } from '../types/project';

const MAX_RECENT_FILES = 10;

// Persistent store for recent files
export const recentFilesStore = persistentAtom<RecentFile[]>('vector-recent-files', [], {
  encode: JSON.stringify,
  decode: (str) => {
    try {
      const files = JSON.parse(str) as RecentFile[];
      // Ensure dates are Date objects
      return files.map(file => ({
        ...file,
        lastOpened: new Date(file.lastOpened)
      }));
    } catch {
      return [];
    }
  }
});

// Add file to recent files list
export const addToRecentFiles = (file: Omit<RecentFile, 'lastOpened'>) => {
  const currentFiles = recentFilesStore.get();
  const now = new Date();
  
  // Remove existing entry if it exists
  const filteredFiles = currentFiles.filter(f => f.id !== file.id);
  
  // Add new entry at the beginning
  const newRecentFile: RecentFile = {
    ...file,
    lastOpened: now
  };
  
  const updatedFiles = [newRecentFile, ...filteredFiles].slice(0, MAX_RECENT_FILES);
  recentFilesStore.set(updatedFiles);
};

// Remove file from recent files
export const removeFromRecentFiles = (fileId: string) => {
  const currentFiles = recentFilesStore.get();
  const updatedFiles = currentFiles.filter(f => f.id !== fileId);
  recentFilesStore.set(updatedFiles);
};

// Clear all recent files
export const clearRecentFiles = () => {
  recentFilesStore.set([]);
};

// Get recent files sorted by last opened (most recent first)
export const getRecentFiles = (): RecentFile[] => {
  const files = recentFilesStore.get();
  return [...files].sort((a, b) => b.lastOpened.getTime() - a.lastOpened.getTime());
};

// Update thumbnail for a recent file
export const updateRecentFileThumbnail = (fileId: string, thumbnail: string) => {
  const currentFiles = recentFilesStore.get();
  const updatedFiles = currentFiles.map(file => 
    file.id === fileId ? { ...file, thumbnail } : file
  );
  recentFilesStore.set(updatedFiles);
};