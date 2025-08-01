# Vector - SVG Editor with Filter Pipeline & Animation System

A modern, local-first SVG editor built with React 19, featuring first-class support for SVG filters and SMIL animations through visual node-based pipeline editors.

## Project Overview

Vector is a Figma-inspired SVG editor that brings professional-grade filter and animation capabilities to web-based vector editing. The key innovations are:

1. **Visual Filter Pipeline**: React Flow integration for building complex SVG filter effects
2. **Timeline-Based Animation System**: Native SMIL animation support with keyframe editing
3. **Unified Node Editor**: Both filters and animations use the same visual pipeline interface

## Tech Stack

- **Runtime**: Bun (fast package manager and runtime)
- **Framework**: React 19 (with concurrent features and new JSX transform)
- **Build Tool**: Vite (fast development and optimized builds)
- **UI Components**: Shadcn/ui (modern, accessible component library)
- **State Management**: Nanostores (atomic, reactive state management)
- **Pipeline Editors**: React Flow (node-based visual editor for filters and animations)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Type Safety**: TypeScript (full type coverage)

## Architecture

### Rendering Architecture Decision

**SVG-Based Rendering**: Vector uses native SVG rendering instead of Canvas for the following reasons:

- **Native Filter Support**: SVG filters (`<defs><filter>`) work natively without conversion or polyfills
- **Native Animation Support**: SMIL animations (`<animate>`, `<animateTransform>`) embedded directly in SVG
- **Vector Precision**: True scalable vectors with no pixelation at any zoom level
- **DOM Integration**: Direct manipulation with React components and native event handlers
- **Accessibility**: Full screen reader support and semantic markup compatibility
- **Export Simplicity**: Direct SVG output with embedded filters and animations
- **Pipeline Integration**: Perfect match with React Flow - generates actual SVG definitions

```tsx
// Main canvas component renders actual SVG with filters and animations
<svg viewBox="0 0 1920 1080" className="canvas">
  <defs>
    {/* Filter definitions generated from React Flow pipeline */}
    <filter id="blur-shadow-pipeline">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feDropShadow dx="2" dy="4" result="shadow"/>
      <feComposite in="blur" in2="shadow" operator="over"/>
    </filter>
  </defs>
  
  {/* Rendered shapes with applied filters and animations */}
  {shapes.map(shape => (
    <ShapeComponent 
      key={shape.id} 
      shape={shape}
      filter={getAppliedFilter(shape.id)}
    >
      {/* SMIL animations generated from timeline */}
      {getAnimationsForShape(shape.id).map(animation => (
        <animateTransform
          attributeName="transform"
          type={animation.transformType}
          values={animation.keyframeValues}
          dur={animation.duration}
          repeatCount={animation.loop ? "indefinite" : "1"}
        />
      ))}
    </ShapeComponent>
  ))}
</svg>
```

**Trade-offs Considered**:
- **Performance**: SVG can be slower with hundreds of complex shapes and animations, but React 19's concurrent features mitigate this
- **Complexity**: More complex coordinate transforms and animation timing, but better integration with web standards
- **Filter & Animation Compatibility**: Perfect match - React Flow nodes directly generate SVG filter and SMIL animation primitives
- **Browser Support**: SMIL animations work in all modern browsers with CSS animation fallbacks

### Component Structure
```
src/
├── components/
│   ├── canvas/
│   │   ├── SVGCanvas.tsx          # Main drawing surface with React 19 optimizations
│   │   ├── CanvasControls.tsx     # Bottom-centered zoom, pan, grid controls
│   │   ├── SelectionOverlay.tsx   # Selection handles and bounding boxes
│   │   └── ShapeRenderer.tsx      # Individual shape rendering
│   ├── panels/
│   │   ├── ToolPanel.tsx          # Floating overlay panel with drawing tools
│   │   ├── LayersPanel.tsx        # Left resizable panel for layer management
│   │   ├── PropertiesPanel.tsx    # Right resizable panel for properties editor
│   │   ├── FilterPanel.tsx        # Bottom collapsible panel for filter pipeline editor
│   │   └── TimelinePanel.tsx      # Bottom collapsible panel for animation timeline
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
│   ├── animation/
│   │   ├── TimelineEditor.tsx     # Main timeline interface with scrubber
│   │   ├── KeyframeEditor.tsx     # Individual keyframe manipulation
│   │   ├── AnimationPreview.tsx   # Animation playback controls
│   │   ├── MotionPathTool.tsx     # Motion path creation and editing
│   │   ├── EasingEditor.tsx       # Bezier curve easing function editor
│   │   └── AnimationNodes/        # React Flow animation nodes
│   │       ├── TimelineNode.tsx   # Master timeline control node
│   │       ├── KeyframeNode.tsx   # Individual keyframe definition node
│   │       ├── EasingNode.tsx     # Easing function modifier node
│   │       ├── MotionPathNode.tsx # Motion path animation node
│   │       ├── TriggerNode.tsx    # Event-based animation triggers
│   │       ├── SequenceNode.tsx   # Animation sequencing node
│   │       ├── DelayNode.tsx      # Animation delay node
│   │       └── RepeatNode.tsx     # Loop and repeat controls node
│   └── ui/                        # Shadcn/ui components
├── stores/
│   ├── canvas.ts                  # Canvas state (shapes, artboards, view)
│   ├── selection.ts               # Selection management
│   ├── tools.ts                   # Active tool and tool state
│   ├── filters.ts                 # Filter pipelines and active filters
│   ├── animations.ts              # Animation timelines and playback state
│   └── history.ts                 # Undo/redo command history
├── types/
│   ├── canvas.ts                  # Canvas and shape type definitions
│   ├── filters.ts                 # Filter node and pipeline types
│   ├── animations.ts              # Animation timeline and keyframe types
│   ├── tools.ts                   # Tool-related type definitions
│   └── history.ts                 # Command pattern types
└── utils/
    ├── svg.ts                     # SVG manipulation utilities
    ├── filters.ts                 # Filter generation and optimization
    ├── animations.ts              # SMIL animation generation and optimization
    ├── export.ts                  # Export functionality (SVG, PNG, PDF, animated formats)
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

// Animation store - timelines and playback
export const animationStore = atom({
  timelines: {} as Record<string, AnimationTimeline>,
  activeTimeline: null as string | null,
  currentTime: 0,
  isPlaying: false,
  previewEnabled: true,
  playbackSettings: {
    fps: 60,
    loop: false,
    autoplay: false
  }
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

### SMIL Animation System
- **Timeline-Based Editor**: After Effects-style keyframe animation
- **Visual Animation Pipeline**: Node-based animation flow using React Flow
- **Real-time Preview**: Live animation playback on canvas elements
- **Animation Types**:
  - **Transform Animations**: Position, rotation, scale, skew with transform origins
  - **Property Animations**: Opacity, colors, stroke properties with smooth interpolation
  - **Path Animations**: Shape morphing, path drawing, motion along custom bezier paths
  - **Filter Animations**: Animated filter parameters (blur radius, shadow offset, etc.)
- **Animation Nodes**:
  - **Timeline**: Master timeline control with duration and FPS settings
  - **Keyframe**: Individual property keyframes with bezier easing curves
  - **Motion Path**: Custom bezier path animation with speed control
  - **Trigger**: Event-based animation triggers (click, hover, timeline events)
  - **Sequence**: Chain multiple animations in sequence
  - **Delay**: Add timing delays between animations
  - **Repeat**: Loop controls with count and direction options

### Export & Sharing
- **SVG Export**: Clean, optimized SVG with embedded filter and SMIL animation definitions
- **Animated Export**: GIF, WebP, and MP4 video export with animation rendering
- **Raster Export**: PNG and JPEG with filter rasterization (single frame or animation frames)
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

## Animation Pipeline Design

### Timeline-Based Animation System

The animation system uses a timeline-based approach similar to After Effects, with keyframes organized by layers and properties:

```typescript
interface AnimationTimeline {
  id: string;
  name: string;
  duration: number; // in milliseconds
  fps: number; // frames per second
  keyframes: Keyframe[];
  layers: AnimationLayer[];
  playbackSettings: {
    loop: boolean;
    autoplay: boolean;
    direction: 'normal' | 'reverse' | 'alternate';
  };
}

interface AnimationLayer {
  id: string;
  shapeId: string;
  properties: AnimatedProperty[];
  visible: boolean;
  locked: boolean;
}

interface AnimatedProperty {
  id: string;
  property: string; // 'x', 'y', 'width', 'fill', 'opacity', etc.
  keyframes: PropertyKeyframe[];
  easing: EasingFunction;
}

interface PropertyKeyframe {
  time: number; // milliseconds
  value: any;
  easingIn?: EasingFunction;
  easingOut?: EasingFunction;
  interpolation: 'linear' | 'discrete' | 'spline';
}
```

### React Flow Animation Nodes

Animation nodes integrate with the existing React Flow pipeline for visual animation editing:

```typescript
type AnimationNodeType = 
  | 'timeline'         // Master timeline control
  | 'keyframe'         // Individual keyframe definition
  | 'easing'           // Easing function modifier
  | 'motion-path'      // Motion path animation
  | 'trigger'          // Event-based animation triggers
  | 'sequence'         // Animation sequencing
  | 'parallel'         // Parallel animation execution
  | 'delay'            // Animation delay
  | 'repeat'           // Loop and repeat controls
  | 'condition';       // Conditional animations
```

### Animation Node Components

Each animation type has a corresponding React component:

```typescript
// Example: Keyframe animation node
export function KeyframeNode({ data, id }: NodeProps) {
  const updateNode = useStore($animationStore, store => store.updateNode);
  
  return (
    <div className="animation-node keyframe-node">
      <div className="node-header">Keyframe</div>
      <div className="node-controls">
        <label>
          Property:
          <select 
            value={data.params.property || 'x'}
            onChange={(e) => updateNode(id, { 
              params: { ...data.params, property: e.target.value }
            })}
          >
            <option value="x">Position X</option>
            <option value="y">Position Y</option>
            <option value="opacity">Opacity</option>
            <option value="fill">Fill Color</option>
          </select>
        </label>
        <label>
          Time (ms):
          <input 
            type="number" 
            value={data.params.time || 0}
            onChange={(e) => updateNode(id, { 
              params: { ...data.params, time: parseInt(e.target.value) }
            })}
          />
        </label>
        <label>
          Value:
          <input 
            type="text" 
            value={data.params.value || ''}
            onChange={(e) => updateNode(id, { 
              params: { ...data.params, value: e.target.value }
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

### SMIL Animation Generation

The animation pipeline generates native SMIL animations for SVG export:

```typescript
// Animation pipeline to SMIL conversion
function generateSMILAnimation(timeline: AnimationTimeline): SVGAnimateElement[] {
  return timeline.layers.flatMap(layer => 
    layer.properties.map(property => ({
      attributeName: property.property,
      values: property.keyframes.map(kf => kf.value).join(';'),
      keyTimes: property.keyframes.map(kf => kf.time / timeline.duration).join(';'),
      dur: `${timeline.duration}ms`,
      repeatCount: timeline.playbackSettings.loop ? "indefinite" : "1",
      fill: "freeze"
    }))
  );
}
```

## UI/UX Guidelines

### Layout Structure (Figma-inspired)

```
┌─────────────────────────────────────────────────────────────────┐
│ Menu Bar: File | Edit | View | Object | Filter | Help           │
├─────┬─────────────────────────────────────────────────┬─────────┤
│Layers│                                                 │Properties│
│Panel │                Canvas Area                      │ Panel   │
│(Resiz│ ┌─────────┐                                     │(Resizable)
│able) │ │🔲⭕✏️🎨📝│ ┌─────────────────────────────────┐ │ 👁Layer │
│ 👁Lay│ │ Tools   │ │                                 │ │ 👁Layer │
│ 👁Lay│ │(Floating│ │            SVG Canvas           │ │ 👁Layer │
│ 👁Lay│ └─────────┘ │         (Pan, Zoom, Grid)       │ │         │
│      │             │                                 │ ├─────────┤
│      │             │      ┌─────────────────────┐    │ │Properties│
│      │             │      │  Canvas Controls    │    │ │Panel    │
│      │             │      │ (Bottom-Centered)   │    │ │         │
│      │             └─────────────────────────────────┘ │         │
├──────┴─────────────────────────────────────────────────┴─────────┤
│           Filter/Animation Pipeline Editor (Tabbed)            │
│  (React Flow - Expandable/Collapsible)                        │
│  Filter │ Animation                                            │
│  ┌─────┐    ┌──────┐    ┌─────────────┐    ┌─────────┐        │
│  │ Src │────│ Blur │────│ DropShadow  │────│ Output  │        │
│  └─────┘    └──────┘    └─────────────┘    └─────────┘        │
├─────────────────────────────────────────────────────────────────┤
│                    Animation Timeline                          │
│ ⏸️ ⏹️ 🔄 │ 0:02.5 / 0:05.0 │ 🔊 │ ⚙️                         │
├─────────┬───────────────────────────────────────────────────────┤
│ Layer 1 │ ●────────●────────●──────────                       │
│ Layer 2 │     ●──────────●─────────────●                      │
│ Layer 3 │ ●─────────────────────────●──────●                  │
├─────────┼───────────────────────────────────────────────────────┤
│         │ 0s    1s    2s    3s    4s    5s                    │
└─────────┴───────────────────────────────────────────────────────┘
```

### Design Principles
- **Clean Interface**: Minimal UI that focuses on content creation
- **Contextual Panels**: Properties change based on selected elements
- **Resizable Layout**: Users can adjust panel widths to fit their workflow
- **Floating Tools**: Tool panel overlays canvas to maximize drawing space
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

### Phase 4: Animation System Foundation (Week 7-8)
- [ ] Create animation timeline UI with scrubber and playback controls
- [ ] Implement basic keyframe system for transform and opacity animations
- [ ] Build SMIL animation generation and export
- [ ] Add real-time animation preview on canvas

### Phase 5: Advanced Animation Features (Week 9-10)
- [ ] Integrate React Flow animation nodes (timeline, keyframe, easing)
- [ ] Implement motion path animations with bezier curve editor
- [ ] Add advanced animation types (color, filter parameter animations)
- [ ] Create animation triggers and sequencing system

### Phase 6: Advanced Editing Features (Week 11-12)
- [ ] Add layers panel with drag-and-drop reordering
- [ ] Implement path tool with bezier curve editing
- [ ] Create undo/redo system using command pattern
- [ ] Build comprehensive export system (SVG, PNG, PDF, GIF, MP4)

### Phase 7: Polish & Performance (Week 13-14)
- [ ] Optimize rendering with React 19's concurrent features for complex animations
- [ ] Add keyboard shortcuts and accessibility features
- [ ] Create comprehensive filter and animation libraries with presets
- [ ] Implement mobile-responsive design with touch-friendly timeline

## Technical Considerations

### Performance Optimizations
- **React 19 Concurrent Features**: Leveraging automatic batching and concurrent rendering for smooth animation playback
- **Canvas Virtualization**: Only render visible shapes and active animations for large documents
- **Filter & Animation Caching**: Cache filter results and animation frames to avoid redundant calculations
- **Selective Re-rendering**: Use Nanostores computed values to minimize updates during timeline scrubbing
- **Animation Optimization**: Efficient keyframe interpolation and SMIL generation for smooth 60fps playback
- **Timeline Virtualization**: Only render visible timeline tracks for complex animations

### Browser Compatibility
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **SVG Filter Support**: Full SVG 1.1 filter specification support
- **SMIL Animation Support**: Native SMIL animations in all modern browsers with CSS animation fallbacks
- **File System Access**: Progressive enhancement with File System Access API
- **Animation Export**: WebCodecs API for video export where available, canvas fallback otherwise

### Data Persistence
- **Local Storage**: Auto-save current document state including animation timelines
- **File System**: Save/load .vector project files with embedded animation data
- **Export Formats**: SVG (with embedded filters and SMIL animations), PNG, JPEG, PDF, GIF, WebP, MP4

This documentation will be updated as the project evolves and new features are implemented.