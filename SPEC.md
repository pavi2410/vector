# Vector - Technical Specification

Technical architecture and implementation specifications for Vector, the modern SVG editor with filter pipeline and animation system.

## 🏗️ Architecture Overview

### Core Principles

1. **SVG-First Rendering**: Native SVG rendering for perfect vector precision and filter integration
2. **React 19 Concurrent**: Leveraging latest React features for smooth performance
3. **Atomic State Management**: Nanostores for granular, reactive state updates
4. **Node-Based Pipelines**: React Flow integration for visual filter and animation editing
5. **Local-First**: Browser-based with optional file system integration

## 🎨 Rendering Architecture

### SVG-Based Rendering Decision

**Why SVG over Canvas:**

- **Native Filter Support**: SVG filters (`<defs><filter>`) work natively without conversion or polyfills
- **Native Animation Support**: SMIL animations (`<animate>`, `<animateTransform>`) embedded directly in SVG
- **Vector Precision**: True scalable vectors with no pixelation at any zoom level
- **DOM Integration**: Direct manipulation with React components and native event handlers
- **Accessibility**: Full screen reader support and semantic markup compatibility
- **Export Simplicity**: Direct SVG output with embedded filters and animations
- **Pipeline Integration**: Perfect match with React Flow - generates actual SVG definitions

### Canvas Structure

```tsx
// Main canvas component renders actual SVG with filters and animations
<svg viewBox="0 0 512 512" className="canvas">
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

### Trade-offs Considered

- **Performance**: SVG can be slower with hundreds of complex shapes and animations, but React 19's concurrent features mitigate this
- **Complexity**: More complex coordinate transforms and animation timing, but better integration with web standards
- **Filter & Animation Compatibility**: Perfect match - React Flow nodes directly generate SVG filter and SMIL animation primitives
- **Browser Support**: SMIL animations work in all modern browsers with CSS animation fallbacks

## 🗂️ Component Architecture

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
│   ├── canvas.ts                  # Canvas state (shapes, frames, view)
│   ├── selection.ts               # Selection management
│   ├── tools.ts                   # Active tool and tool state
│   ├── filters.ts                 # Filter pipelines and active filters
│   ├── project.ts                 # Project management and persistence
│   ├── appearance.ts              # UI appearance and theme settings
│   ├── clipboard.ts               # Copy/paste functionality
│   ├── hover.ts                   # Hover state management
│   ├── mouse.ts                   # Mouse interaction state
│   ├── ui.ts                      # UI state management
│   └── debug.ts                   # Debug state and utilities
│   // animations.ts              # PLANNED - Animation timelines and playback state
│   // history.ts                 # PLANNED - Undo/redo command history
├── types/
│   ├── canvas.ts                  # Canvas and shape type definitions
│   ├── filters.ts                 # Filter node and pipeline types
│   ├── project.ts                 # Project-related type definitions
│   └── tools.ts                   # Tool-related type definitions
│   // animations.ts              # PLANNED - Animation timeline and keyframe types
│   // history.ts                 # PLANNED - Command pattern types
└── utils/
    ├── svg.ts                     # SVG manipulation utilities
    ├── filters.ts                 # Filter generation and optimization
    ├── animations.ts              # SMIL animation generation and optimization
    ├── export.ts                  # Export functionality (SVG, PNG, PDF, animated formats)
    └── persistence.ts             # Local storage and file operations
```

## 🗄️ State Management

### Nanostores Architecture

Using Nanostores for granular, reactive state management:

```typescript
// Canvas store - shapes and viewport
export const canvasStore = atom({
  shapes: [] as Shape[],
  frames: [] as Frame[],
  viewBox: { x: 0, y: 0, width: 512, height: 512 },
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

// PLANNED - Animation store for future implementation
// Currently animation features are not implemented
// export const animationStore = atom({
//   timelines: {} as Record<string, AnimationTimeline>,
//   activeTimeline: null as string | null,
//   currentTime: 0,
//   isPlaying: false,
//   previewEnabled: true,
//   playbackSettings: {
//     fps: 60,
//     loop: false,
//     autoplay: false
//   }
// });
```

## 🎛️ Filter Pipeline System

### React Flow Integration

The filter pipeline editor uses React Flow to create a visual, node-based interface for building complex SVG filters:

```typescript
interface FilterPipeline {
  id: string;
  name: string;
  nodes: FilterNode[];
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }>;
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

### Filter Node Component Example

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

## 🎬 Animation System Architecture

### Timeline-Based Animation System

**Note: The animation system described below is planned for future implementation. Currently, animation features are not fully implemented in the codebase.**

The animation system will use a timeline-based approach similar to After Effects, with keyframes organized by layers and properties:

```typescript
// PLANNED - Not yet implemented
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

**Note: Animation nodes are planned for future implementation.**

Animation nodes will integrate with the existing React Flow pipeline for visual animation editing:

```typescript
// PLANNED - Not yet implemented
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

### SMIL Animation Generation

**Note: SMIL animation generation is planned for future implementation.**

The animation pipeline will generate native SMIL animations for SVG export:

```typescript
// PLANNED - Animation pipeline to SMIL conversion
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

## 🎨 UI/UX Architecture

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

## 🚀 Performance Specifications

### Performance Optimizations

- **React 19 Concurrent Features**: Leveraging automatic batching and concurrent rendering for smooth animation playback
- **Canvas Virtualization**: Only render visible shapes and active animations for large documents
- **Filter & Animation Caching**: Cache filter results and animation frames to avoid redundant calculations
- **Selective Re-rendering**: Use Nanostores computed values to minimize updates during timeline scrubbing
- **Animation Optimization**: Efficient keyframe interpolation and SMIL generation for smooth 60fps playback
- **Timeline Virtualization**: Only render visible timeline tracks for complex animations

### Performance Targets

- **Initial Load**: <2 seconds on modern browsers
- **Frame Rate**: 60fps for animations and interactions
- **Memory Usage**: <100MB for typical documents with 50+ shapes
- **Zoom Performance**: Smooth zooming from 10% to 1000%
- **Filter Performance**: Real-time preview with <16ms latency

## 🌐 Browser Compatibility

### Target Browsers

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **SVG Filter Support**: Full SVG 1.1 filter specification support
- **SMIL Animation Support**: Native SMIL animations in all modern browsers with CSS animation fallbacks
- **File System Access**: Progressive enhancement with File System Access API
- **Animation Export**: WebCodecs API for video export where available, canvas fallback otherwise

### Progressive Enhancement

- **Core Functionality**: Works on all modern browsers
- **Enhanced Features**: File system API, WebCodecs export on supported browsers
- **Fallback Support**: Canvas-based export for unsupported browsers
- **Touch Support**: Mobile and tablet compatibility with touch gestures

## 💾 Data Persistence

### Storage Strategy

- **Local Storage**: Auto-save current document state including animation timelines
- **File System**: Save/load .vector project files with embedded animation data
- **Export Formats**: SVG (with embedded filters and SMIL animations), PNG, JPEG, PDF, GIF, WebP, MP4

### Data Format Specifications

```typescript
// .vector project file format
interface VectorProject {
  version: string;
  metadata: {
    name: string;
    created: Date;
    modified: Date;
    author?: string;
  };
  canvas: {
    shapes: Shape[];
    frames: Frame[];
    viewBox: ViewBox;
  };
  filters: {
    pipelines: FilterPipeline[];
    activeFilters: Record<string, string>;
  };
  // animations: {
  //   timelines: AnimationTimeline[]; // PLANNED - not yet implemented
  //   globalSettings: AnimationSettings; // PLANNED - not yet implemented
  // };
}
```

## 🔧 Technical Stack

### Core Technologies

- **Runtime**: Bun (fast package manager and runtime)
- **Framework**: React 19 (with concurrent features and new JSX transform)
- **Build Tool**: Vite (fast development and optimized builds)
- **UI Components**: Shadcn/ui (modern, accessible component library)
- **State Management**: Nanostores (atomic, reactive state management)
- **Pipeline Editors**: React Flow (node-based visual editor for filters and animations)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Type Safety**: TypeScript (full type coverage)

### Development Dependencies

```json
{
  "@types/react": "^18.0.0",
  "@vitejs/plugin-react": "^4.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.3.0",
  "eslint": "^8.0.0",
  "prettier": "^3.0.0"
}
```

---

## 📝 Implementation Notes

### Code Quality Standards

- **TypeScript**: 100% type coverage required
- **Testing**: Minimum 80% code coverage
- **ESLint**: Strict configuration with React and TypeScript rules
- **Prettier**: Consistent code formatting
- **Git Hooks**: Pre-commit linting and type checking

### Performance Monitoring

- **React DevTools**: Profiler integration for performance analysis
- **Web Vitals**: Core Web Vitals monitoring
- **Memory Profiling**: Regular memory leak detection
- **Bundle Analysis**: Size monitoring and optimization

This specification serves as the technical blueprint for Vector's architecture and implementation decisions.