import type { Project } from '../types/project';
import { importProjectData } from '../stores/project';

// File type detection
export const detectFileType = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension || '';
};

// Validate file before import
export const validateProjectFile = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Basic validation - check for required fields
        const isValid = data.id && data.name && data.canvas && 
                       Array.isArray(data.canvas.shapes) && 
                       Array.isArray(data.canvas.frames);
        
        resolve(isValid);
      } catch {
        resolve(false);
      }
    };
    
    reader.onerror = () => resolve(false);
    reader.readAsText(file);
  });
};

// Read file content
export const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Load project from file
export const loadProjectFromFile = async (file: File): Promise<Project> => {
  try {
    // Validate file first
    const isValid = await validateProjectFile(file);
    if (!isValid) {
      throw new Error('Invalid project file format');
    }

    // Read and parse file content
    const content = await readFileContent(file);
    const project = importProjectData(content);
    
    return project;
  } catch (error) {
    throw new Error(`Failed to load project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Create file download
export const downloadFile = (content: string, filename: string, mimeType: string = 'application/json') => {
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

// Generate project thumbnail (base64 encoded PNG)
export const generateProjectThumbnail = async (canvas: HTMLCanvasElement, width: number = 200, height: number = 150): Promise<string> => {
  return new Promise((resolve) => {
    const thumbnailCanvas = document.createElement('canvas');
    const ctx = thumbnailCanvas.getContext('2d');
    
    if (!ctx) {
      resolve('');
      return;
    }
    
    thumbnailCanvas.width = width;
    thumbnailCanvas.height = height;
    
    // Draw scaled version of main canvas
    ctx.drawImage(canvas, 0, 0, width, height);
    
    // Convert to base64
    resolve(thumbnailCanvas.toDataURL('image/png', 0.7));
  });
};

// Browser storage utilities
export const getBrowserStorageUsage = (): { used: number; available: number } => {
  try {
    // Estimate localStorage usage
    let used = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length;
      }
    }
    
    // Most browsers have ~5-10MB limit for localStorage
    const available = 10 * 1024 * 1024; // 10MB estimate
    
    return { used: used * 2, available }; // *2 for UTF-16 encoding
  } catch {
    return { used: 0, available: 0 };
  }
};

// Check if browser storage has enough space
export const hasStorageSpace = (requiredBytes: number): boolean => {
  const { used, available } = getBrowserStorageUsage();
  return (available - used) > requiredBytes;
};

// Clear old data if storage is full
export const cleanupOldData = () => {
  try {
    const keys = Object.keys(localStorage);
    const vectorKeys = keys.filter(key => key.startsWith('vector-'));
    
    // Sort by timestamp (if available) and remove oldest
    // This is a simple implementation - could be made smarter
    if (vectorKeys.length > 20) {
      const toRemove = vectorKeys.slice(0, vectorKeys.length - 20);
      toRemove.forEach(key => localStorage.removeItem(key));
    }
  } catch (error) {
    console.warn('Failed to cleanup old data:', error);
  }
};