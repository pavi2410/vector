import type { Project } from '@/types/project';
import type { CanvasState } from '@/types/canvas';
import { DEFAULT_PROJECT_SETTINGS, PROJECT_VERSION } from '@/types/project';

const createExampleCanvas = (shapes: any[], frames: any[]): CanvasState => ({
  shapes,
  frames,
  viewBox: { x: 0, y: 0, width: 512, height: 512 },
  zoom: 1
});

export const EXAMPLE_PROJECTS: Project[] = [
  {
    id: 'example-logo-design',
    name: 'Logo Design',
    createdAt: new Date('2024-01-01'),
    modifiedAt: new Date('2024-01-01'),
    version: PROJECT_VERSION,
    settings: DEFAULT_PROJECT_SETTINGS,
    canvas: createExampleCanvas(
      [
        {
          id: 'circle-1',
          type: 'circle',
          x: 206,
          y: 156,
          width: 200,
          height: 200,
          fill: '#3b82f6',
          stroke: '#1e40af',
          strokeWidth: 3,
          opacity: 1,
          rotation: 0,
        },
        {
          id: 'rect-1',
          type: 'rectangle',
          x: 256,
          y: 206,
          width: 100,
          height: 100,
          fill: '#ffffff',
          stroke: 'none',
          strokeWidth: 0,
          opacity: 1,
          rotation: 45,
        }
      ],
      [
        {
          id: 'frame-1',
          name: 'Logo',
          x: 106,
          y: 56,
          width: 300,
          height: 300,
          backgroundColor: '#f8fafc'
        }
      ]
    ),
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNmOGZhZmMiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI3NSIgcj0iNDAiIGZpbGw9IiMzYjgyZjYiIHN0cm9rZT0iIzFlNDBhZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHJlY3QgeD0iODAiIHk9IjU1IiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNmZmZmZmYiIHRyYW5zZm9ybT0icm90YXRlKDQ1IDEwMCA3NSkiLz48L3N2Zz4='
  },
  {
    id: 'example-ui-mockup',
    name: 'UI Mockup',
    createdAt: new Date('2024-01-02'),
    modifiedAt: new Date('2024-01-02'),
    version: PROJECT_VERSION,
    settings: DEFAULT_PROJECT_SETTINGS,
    canvas: createExampleCanvas(
      [
        {
          id: 'header-bg',
          type: 'rectangle',
          x: 75,
          y: 75,
          width: 362,
          height: 40,
          fill: '#1f2937',
          stroke: 'none',
          strokeWidth: 0,
          opacity: 1,
          rotation: 0,
        },
        {
          id: 'nav-item-1',
          type: 'rectangle',
          x: 100,
          y: 85,
          width: 50,
          height: 20,
          fill: '#6b7280',
          stroke: 'none',
          strokeWidth: 0,
          opacity: 1,
          rotation: 0,
        },
        {
          id: 'nav-item-2',
          type: 'rectangle',
          x: 170,
          y: 85,
          width: 50,
          height: 20,
          fill: '#6b7280',
          stroke: 'none',
          strokeWidth: 0,
          opacity: 1,
          rotation: 0,
        },
        {
          id: 'content-area',
          type: 'rectangle',
          x: 75,
          y: 135,
          width: 362,
          height: 280,
          fill: '#ffffff',
          stroke: '#e5e7eb',
          strokeWidth: 1,
          opacity: 1,
          rotation: 0,
        }
      ],
      [
        {
          id: 'frame-mockup',
          name: 'Mobile App',
          x: 50,
          y: 50,
          width: 412,
          height: 365,
          backgroundColor: '#f3f4f6'
        }
      ]
    ),
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNmM2Y0ZjYiLz48cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIxNjAiIGhlaWdodD0iMjAiIGZpbGw9IiMxZjI5MzciLz48cmVjdCB4PSIzMCIgeT0iMjUiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxMCIgZmlsbD0iIzZiNzI4MCIvPjxyZWN0IHg9IjUwIiB5PSIyNSIgd2lkdGg9IjE1IiBoZWlnaHQ9IjEwIiBmaWxsPSIjNmI3MjgwIi8+PHJlY3QgeD0iMjAiIHk9IjUwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNlNWU3ZWIiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg=='
  },
  {
    id: 'example-icon-set',
    name: 'Icon Set',
    createdAt: new Date('2024-01-03'),
    modifiedAt: new Date('2024-01-03'),
    version: PROJECT_VERSION,
    settings: DEFAULT_PROJECT_SETTINGS,
    canvas: createExampleCanvas(
      [
        // Home icon
        {
          id: 'home-icon',
          type: 'rectangle',
          x: 140,
          y: 210,
          width: 50,
          height: 50,
          fill: '#374151',
          stroke: 'none',
          strokeWidth: 0,
          opacity: 1,
          rotation: 0
        },
        // Settings icon (gear)
        {
          id: 'settings-icon',
          type: 'circle',
          x: 210,
          y: 210,
          width: 50,
          height: 50,
          fill: 'none',
          stroke: '#374151',
          strokeWidth: 3,
          opacity: 1,
          rotation: 0
        },
        // User icon
        {
          id: 'user-icon',
          type: 'circle',
          x: 280,
          y: 210,
          width: 50,
          height: 50,
          fill: 'none',
          stroke: '#374151',
          strokeWidth: 3,
          opacity: 1,
          rotation: 0
        },
        // Heart icon
        {
          id: 'heart-icon',
          type: 'circle',
          x: 350,
          y: 210,
          width: 50,
          height: 50,
          fill: '#ef4444',
          stroke: 'none',
          strokeWidth: 0,
          opacity: 1,
          rotation: 0
        }
      ],
      [
        {
          id: 'frame-icons',
          name: 'Icon Set',
          x: 120,
          y: 180,
          width: 300,
          height: 100,
          backgroundColor: '#ffffff'
        }
      ]
    ),
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNmZmZmZmYiLz48Y2lyY2xlIGN4PSI0MCIgY3k9Ijc1IiByPSIxNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzc0MTUxIiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSI4MCIgY3k9Ijc1IiByPSIxNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzc0MTUxIiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSI3NSIgcj0iMTUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzM3NDE1MSIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTYwIiBjeT0iNzUiIHI9IjE1IiBmaWxsPSIjZWY0NDQ0Ii8+PC9zdmc+'
  },
  {
    id: 'example-infographic',
    name: 'Infographic Template',
    createdAt: new Date('2024-01-04'),
    modifiedAt: new Date('2024-01-04'),
    version: PROJECT_VERSION,
    settings: DEFAULT_PROJECT_SETTINGS,
    canvas: createExampleCanvas(
      [
        // Title area
        {
          id: 'title-bg',
          type: 'rectangle',
          x: 80,
          y: 80,
          width: 350,
          height: 50,
          fill: '#0f172a',
          stroke: 'none',
          strokeWidth: 0,
          opacity: 1,
          rotation: 0,
        },
        // Stats boxes
        {
          id: 'stat-1',
          type: 'rectangle',
          x: 90,
          y: 160,
          width: 100,
          height: 70,
          fill: '#dbeafe',
          stroke: '#3b82f6',
          strokeWidth: 2,
          opacity: 1,
          rotation: 0,
        },
        {
          id: 'stat-2',
          type: 'rectangle',
          x: 210,
          y: 160,
          width: 100,
          height: 70,
          fill: '#dcfce7',
          stroke: '#22c55e',
          strokeWidth: 2,
          opacity: 1,
          rotation: 0,
        },
        {
          id: 'stat-3',
          type: 'rectangle',
          x: 330,
          y: 160,
          width: 100,
          height: 70,
          fill: '#fef3c7',
          stroke: '#f59e0b',
          strokeWidth: 2,
          opacity: 1,
          rotation: 0,
        },
        // Chart area
        {
          id: 'chart-bg',
          type: 'rectangle',
          x: 90,
          y: 260,
          width: 340,
          height: 140,
          fill: '#f8fafc',
          stroke: '#e2e8f0',
          strokeWidth: 1,
          opacity: 1,
          rotation: 0,
        }
      ],
      [
        {
          id: 'frame-infographic',
          name: 'Infographic',
          x: 60,
          y: 60,
          width: 390,
          height: 360,
          backgroundColor: '#ffffff'
        }
      ]
    ),
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNmZmZmZmYiLz48cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIxNjAiIGhlaWdodD0iMjAiIGZpbGw9IiMwZjE3MmEiLz48cmVjdCB4PSIyMCIgeT0iNTAiIHdpZHRoPSI0NSIgaGVpZ2h0PSIzMCIgZmlsbD0iI2RiZWFmZSIgc3Ryb2tlPSIjM2I4MmY2IiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSI3NSIgeT0iNTAiIHdpZHRoPSI0NSIgaGVpZ2h0PSIzMCIgZmlsbD0iI2RjZmNlNyIgc3Ryb2tlPSIjMjJjNTVlIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSIxMzAiIHk9IjUwIiB3aWR0aD0iNDUiIGhlaWdodD0iMzAiIGZpbGw9IiNmZWYzYzciIHN0cm9rZT0iI2Y1OWUwYiIgc3Ryb2tlLXdpZHRoPSIxIi8+PHJlY3QgeD0iMjAiIHk9IjkwIiB3aWR0aD0iMTU1IiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjhmYWZjIiBzdHJva2U9IiNlMmU4ZjAiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg=='
  }
];

export const loadExampleProject = (projectId: string): Project | null => {
  const example = EXAMPLE_PROJECTS.find(p => p.id === projectId);
  if (!example) return null;
  
  // Create a new instance with updated timestamps
  return {
    ...example,
    id: `example-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date(),
    modifiedAt: new Date()
  };
};