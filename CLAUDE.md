# Vector - SVG Editor with Filter Pipeline

A modern, local-first SVG editor built with React 19, featuring first-class support for SVG filters through a visual node-based pipeline editor.

## Project Overview

Vector is a Figma-inspired SVG editor that brings professional-grade filter capabilities to web-based vector editing. The key innovation is the integration of React Flow for building complex SVG filter pipelines visually, making advanced effects accessible to designers.

## Tech Stack

- **Runtime**: Bun (fast package manager and runtime)
- **Framework**: React 19 (with concurrent features and new JSX transform)
- **Build Tool**: Vite (fast development and optimized builds)
- **UI Components**: Shadcn/ui (modern, accessible component library)
- **State Management**: Nanostores (atomic, reactive state management)
- **Filter Editor**: React Flow (node-based visual editor)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Type Safety**: TypeScript (full type coverage)

## Architecture

### Rendering Architecture Decision

**SVG-Based Rendering**: Vector uses native SVG rendering instead of Canvas for the following reasons:

- **Native Filter Support**: SVG filters (`<defs><filter>`) work natively without conversion or polyfills
- **Vector Precision**: True scalable vectors with no pixelation at any zoom level
- **DOM Integration**: Direct manipulation with React components and native event handlers
- **Accessibility**: Full screen reader support and semantic markup compatibility
- **Export Simplicity**: Direct SVG output without complex canvas-to-SVG conversion
- **Filter Pipeline Integration**: Perfect match with React Flow - generates actual SVG filter definitions

```tsx
// Main canvas component renders actual SVG
<svg viewBox="0 0 1920 1080" className="canvas">
  <defs>
    {/* Filter definitions generated from React Flow pipeline */}
    <filter id="blur-shadow-pipeline">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feDropShadow dx="2" dy="4" result="shadow"/>
      <feComposite in="blur" in2="shadow" operator="over"/>
    </filter>
  </defs>
  
  {/* Rendered shapes with applied filters */}
  {shapes.map(shape => (
    <ShapeComponent 
      key={shape.id} 
      shape={shape}
      filter={getAppliedFilter(shape.id)}
    />
  ))}
</svg>
```

**Trade-offs Considered**:
- **Performance**: SVG can be slower with hundreds of complex shapes, but React 19's concurrent features mitigate this
- **Complexity**: More complex coordinate transforms, but better integration with web standards
- **Filter Compatibility**: Perfect match - React Flow nodes directly generate SVG filter primitives

### Component Structure
```
src/
├── components/
│   ├── canvas/
│   │   ├── SVGCanvas.tsx          # Main drawing surface with React 19 optimizations
│   │   ├── CanvasControls.tsx     # Zoom, pan, grid controls
│   │   ├── SelectionOverlay.tsx   # Selection handles and bounding boxes
│   │   └── ShapeRenderer.tsx      # Individual shape rendering
│   ├── panels/
│   │   ├── ToolPanel.tsx          # Left sidebar with drawing tools
│   │   ├── LayersPanel.tsx        # Right sidebar layer management
│   │   ├── PropertiesPanel.tsx    # Right sidebar properties editor
│   │   └── FilterPanel.tsx        # Bottom panel filter pipeline editor
│   ├── tools/
│   │   ├── SelectTool.tsx         # Selection and transformation
│   │   ├── ShapeTools.tsx         # Rectangle, circle, polygon tools
│   │   ├── PathTool.tsx           # Bezier path creation and editing
│   │   └── TextTool.tsx           # Text creation and editing
│   ├── filters/
│   │   ├── FilterNode.tsx         # Base filter node component
│   │   ├── BlurNode.tsx           # Gaussian blur filter
│   │   ├── DropShadowNode.tsx     # Drop shadow filter
│   │   ├── ColorMatrixNode.tsx    # Color transformation matrix
│   │   └── CompositeNode.tsx      # Blend mode operations
│   └── ui/                        # Shadcn/ui components
├── stores/
│   ├── canvas.ts                  # Canvas state (shapes, artboards, view)
│   ├── selection.ts               # Selection management
│   ├── tools.ts                   # Active tool and tool state
│   ├── filters.ts                 # Filter pipelines and active filters
│   └── history.ts                 # Undo/redo command history
├── types/
│   ├── canvas.ts                  # Canvas and shape type definitions
│   ├── filters.ts                 # Filter node and pipeline types
│   ├── tools.ts                   # Tool-related type definitions
│   └── history.ts                 # Command pattern types
└── utils/
    ├── svg.ts                     # SVG manipulation utilities
    ├── filters.ts                 # Filter generation and optimization
    ├── export.ts                  # Export functionality (SVG, PNG, PDF)
    └── persistence.ts             # Local storage and file operations
```

### State Management with Nanostores

Using Nanostores for granular, reactive state management:

```typescript
// Canvas store - shapes and viewport
export const canvasStore = atom({
  shapes: [] as Shape[],
  artboards: [] as Artboard[],
  viewBox: { x: 0, y: 0, width: 1920, height: 1080 },
  zoom: 1
});

// Selection store - currently selected elements
export const selectionStore = atom({
  selectedIds: [] as string[],
  transformHandle: null as TransformHandle | null
});

// Tool store - active tool and settings
export const toolStore = atom({
  activeTool: 'select' as ToolType,
  toolSettings: {} as Record<string, any>
});

// Filter store - pipelines and preview
export const filterStore = atom({
  pipelines: {} as Record<string, FilterPipeline>,
  activePipeline: null as string | null,
  previewEnabled: true
});
```

## Development Commands

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Preview production build
bun run preview

# Run type checking
bun run typecheck

# Run linting
bun run lint

# Run linting with auto-fix
bun run lint:fix

# Run tests
bun test

# Run tests in watch mode
bun test --watch
```

## Core Features

### Essential Editing Features
- **Multi-Artboard Canvas**: Support for multiple artboards with independent content
- **Shape Tools**: Rectangle, circle, polygon, line, and freeform path creation
- **Selection System**: Multi-select with unified transform handles
- **Layer Management**: Hierarchical layer structure with visibility and locking
- **Properties Panel**: Real-time editing of colors, gradients, transforms, and effects
- **Undo/Redo**: Complete action history with efficient state snapshots

### Advanced SVG Filter System
- **Visual Filter Pipeline**: Node-based editor using React Flow
- **Real-time Preview**: Live filter application on canvas elements
- **Filter Library**: Pre-built filter effects and custom templates
- **Filter Nodes**:
  - **Blur**: Gaussian blur with radius control
  - **Drop Shadow**: Configurable offset, blur, and color
  - **Color Matrix**: Full color transformation matrix
  - **Displacement Map**: Distortion effects using displacement maps
  - **Lighting Effects**: Point, distant, and spot light sources
  - **Composite**: Blend modes and masking operations

### Export & Sharing
- **SVG Export**: Clean, optimized SVG with preserved filter definitions
- **Raster Export**: PNG and JPEG with filter rasterization
- **PDF Export**: Vector PDF with embedded filters where supported
- **Local Persistence**: Auto-save with localStorage and file system access

## Filter Pipeline Design

### React Flow Integration

The filter pipeline editor uses React Flow to create a visual, node-based interface for building complex SVG filters:

```typescript
interface FilterPipeline {
  id: string;
  name: string;
  nodes: FilterNode[];
  edges: Edge[];
  outputNode: string;
}

interface FilterNode {
  id: string;
  type: FilterNodeType;
  position: { x: number; y: number };
  data: {
    params: Record<string, any>;
    inputs: FilterInput[];
    outputs: FilterOutput[];
  };
}

// Example filter types
type FilterNodeType = 
  | 'source'           // Input source (SourceGraphic, SourceAlpha)
  | 'blur'             // feGaussianBlur
  | 'dropshadow'       // feDropShadow
  | 'colormatrix'      // feColorMatrix
  | 'displacement'     // feDisplacementMap
  | 'composite'        // feComposite
  | 'merge'            // feMerge
  | 'output';          // Final output
```

### Filter Node Components

Each filter type has a corresponding React component:

```typescript
// Example: Blur filter node
export function BlurNode({ data, id }: NodeProps) {
  const updateNode = useStore($filterStore, store => store.updateNode);
  
  return (
    <div className="filter-node blur-node">
      <div className="node-header">Gaussian Blur</div>
      <div className="node-controls">
        <label>
          Radius:
          <input 
            type="range" 
            min="0" 
            max="10" 
            step="0.1"
            value={data.params.stdDeviation || 0}
            onChange={(e) => updateNode(id, { 
              params: { ...data.params, stdDeviation: parseFloat(e.target.value) }
            })}
          />
        </label>
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
```

## UI/UX Guidelines

### Layout Structure (Figma-inspired)

```
┌─────────────────────────────────────────────────────────────────┐
│ Menu Bar: File | Edit | View | Object | Filter | Help           │
├─────┬─────────────────────────────────────────────────┬─────────┤
│Tool │                                                 │ Layers  │
│Panel│                Canvas Area                      │ Panel   │
│     │                                                 │         │
│ 🔲  │  ┌─────────────────────────────────────────────┐│ 👁Layer │
│ ⭕  │  │                                             ││ 👁Layer │
│ ✏️  │  │            SVG Canvas                       ││ 👁Layer │
│ 🎨  │  │         (Pan, Zoom, Grid)                   ││         │
│ 📝  │  │                                             │├─────────┤
│     │  │                                             ││Properties│
│     │  └─────────────────────────────────────────────┘│Panel    │
│     │                                                 │         │
├─────┴─────────────────────────────────────────────────┴─────────┤
│                Filter Pipeline Editor                           │
│  (React Flow - Expandable/Collapsible)                        │
│  ┌─────┐    ┌──────┐    ┌─────────────┐    ┌─────────┐        │
│  │ Src │────│ Blur │────│ DropShadow  │────│ Output  │        │
│  └─────┘    └──────┘    └─────────────┘    └─────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

### Design Principles
- **Clean Interface**: Minimal UI that focuses on content creation
- **Contextual Panels**: Properties change based on selected elements
- **Responsive Design**: Collapsible panels for different screen sizes
- **Keyboard Shortcuts**: Power user shortcuts for all major functions
- **Dark/Light Theme**: System preference detection with manual override

### Color Scheme (Figma-inspired)
- **Background**: `hsl(var(--background))` - Main canvas background
- **Foreground**: `hsl(var(--foreground))` - Primary text and icons
- **Muted**: `hsl(var(--muted))` - Secondary UI elements
- **Accent**: `hsl(var(--accent))` - Interactive elements and highlights
- **Border**: `hsl(var(--border))` - Panel dividers and outlines

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Project setup with Bun + Vite + React 19
- [ ] Install and configure Nanostores, Shadcn/ui, React Flow
- [ ] Create basic layout with collapsible panels
- [ ] Implement canvas component with pan/zoom using React 19 concurrent features

### Phase 2: Core Editing (Week 3-4)
- [ ] Implement shape tools (rectangle, circle, line, text)
- [ ] Build selection system with multi-select and transform handles
- [ ] Create Nanostores atoms for canvas, selection, and tool state
- [ ] Develop properties panel with reactive updates

### Phase 3: Filter Pipeline (Week 5-6)
- [ ] Integrate React Flow for filter pipeline editor
- [ ] Create basic filter nodes (blur, drop-shadow, color-matrix)
- [ ] Implement real-time filter preview on canvas
- [ ] Build filter persistence and serialization

### Phase 4: Advanced Features (Week 7-8)
- [ ] Add layers panel with drag-and-drop reordering
- [ ] Implement path tool with bezier curve editing
- [ ] Create undo/redo system using command pattern
- [ ] Build export system (SVG, PNG, PDF)

### Phase 5: Polish & Performance (Week 9-10)
- [ ] Optimize rendering with React 19's concurrent features
- [ ] Add keyboard shortcuts and accessibility features
- [ ] Create comprehensive filter library with presets
- [ ] Implement mobile-responsive design

## Technical Considerations

### Performance Optimizations
- **React 19 Concurrent Features**: Leveraging automatic batching and concurrent rendering
- **Canvas Virtualization**: Only render visible shapes for large documents
- **Filter Caching**: Cache filter results to avoid redundant calculations
- **Selective Re-rendering**: Use Nanostores computed values to minimize updates

### Browser Compatibility
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **SVG Filter Support**: Full SVG 1.1 filter specification support
- **File System Access**: Progressive enhancement with File System Access API

### Data Persistence
- **Local Storage**: Auto-save current document state
- **File System**: Save/load .vector project files
- **Export Formats**: SVG (with embedded filters), PNG, JPEG, PDF

This documentation will be updated as the project evolves and new features are implemented.