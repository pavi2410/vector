# Vector - SVG Editor Development Guide

Development instructions and conventions for Vector, the modern SVG editor with filter pipeline and animation system.

## Project Overview

Vector is a Figma-inspired SVG editor that brings professional-grade filter and animation capabilities to web-based vector editing. Key innovations:

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

## Claude AI Development Guidelines

- Never run the dev server (bun run dev) by yourself. Ask me to test the web app by directing me what to test and expect. You may however run "bun run build" to check if there's any errors in the syntax or build time.
- **Shadcn UI Workflow**: Install shadcn ui components using CLI whenever needed.

## Architecture Decision: SVG-Based Rendering

Vector uses native SVG rendering instead of Canvas for the following reasons:

- **Native Filter Support**: SVG filters (`<defs><filter>`) work natively without conversion or polyfills
- **Native Animation Support**: SMIL animations (`<animate>`, `<animateTransform>`) embedded directly in SVG
- **Vector Precision**: True scalable vectors with no pixelation at any zoom level
- **DOM Integration**: Direct manipulation with React components and native event handlers
- **Export Simplicity**: Direct SVG output with embedded filters and animations
- **Pipeline Integration**: Perfect match with React Flow - generates actual SVG definitions

## Code Conventions

### Component Structure
- Use functional components with hooks
- Follow the established component hierarchy in `/src/components/`
- Implement proper TypeScript types for all props and state
- Use Nanostores for state management, not React state for global data

### State Management
```typescript
// Use Nanostores atoms for reactive state
export const canvasStore = atom({
  shapes: [] as Shape[],
  artboards: [] as Artboard[],
  viewBox: { x: 0, y: 0, width: 1920, height: 1080 },
  zoom: 1
});
```

### File Organization
- **Components**: Group by feature (canvas/, panels/, tools/, filters/, animation/)
- **Stores**: One store per domain (canvas.ts, selection.ts, tools.ts, etc.)
- **Types**: Match store structure (canvas.ts, filters.ts, animations.ts, etc.)
- **Utils**: Helper functions organized by purpose

### Styling
- Use Tailwind CSS utility classes
- Follow Shadcn/ui design patterns
- Implement proper dark/light theme support using CSS variables
- Use consistent spacing and color schemes

### TypeScript
- Maintain 100% type coverage
- Define interfaces for all data structures
- Use proper generic types for reusable components
- Export types from dedicated type files

## Key Development Patterns

### React Flow Integration
```typescript
// Filter/Animation nodes should follow this pattern
export function FilterNode({ data, id }: NodeProps) {
  const updateNode = useStore($filterStore, store => store.updateNode);
  
  return (
    <div className="filter-node">
      <div className="node-header">Node Title</div>
      <div className="node-controls">
        {/* Node-specific controls */}
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
```

### SVG Component Pattern
```typescript
// Shape components should render proper SVG elements
export function ShapeComponent({ shape, ...props }: ShapeProps) {
  return (
    <g transform={`translate(${shape.x}, ${shape.y})`}>
      {/* Render actual SVG shape */}
      <rect width={shape.width} height={shape.height} />
      {/* Include animations if present */}
      {shape.animations?.map(animation => (
        <animateTransform
          attributeName="transform"
          type={animation.type}
          values={animation.values}
          dur={animation.duration}
        />
      ))}
    </g>
  );
}
```

### Store Updates
```typescript
// Always use proper store update patterns
const updateShape = (id: string, updates: Partial<Shape>) => {
  canvasStore.set({
    ...canvasStore.get(),
    shapes: canvasStore.get().shapes.map(shape => 
      shape.id === id ? { ...shape, ...updates } : shape
    )
  });
};
```

## Performance Guidelines

### React 19 Optimizations
- Use React.memo() for expensive components
- Implement proper dependency arrays in useCallback/useMemo
- Leverage React 19's automatic batching
- Use concurrent features for smooth animations

### Canvas Performance  
- Implement virtualization for large documents (>100 shapes)
- Cache filter results to avoid recomputation
- Use transform3d for hardware acceleration where appropriate
- Minimize DOM updates during drag operations

### Animation Performance
- Target 60fps for all animations
- Use SMIL animations for export, CSS transforms for preview
- Implement timeline virtualization for complex animations
- Cache keyframe interpolations

## Testing Requirements

### Unit Tests
- Test all utility functions
- Test store mutations and computed values
- Test component rendering and interactions
- Maintain >80% code coverage

### Integration Tests
- Test filter pipeline generation
- Test animation timeline functionality
- Test export functionality
- Test keyboard shortcuts and interactions

### Performance Tests
- Canvas rendering performance with large documents
- Filter preview performance
- Animation playback performance
- Memory usage and leak detection

## Accessibility Standards

### Keyboard Navigation
- All tools accessible via keyboard shortcuts
- Tab navigation through all UI elements
- Proper focus management and indicators
- Screen reader compatibility

### Visual Accessibility
- High contrast theme support
- Scalable UI elements for different zoom levels
- Proper color contrast ratios
- Clear visual hierarchy and feedback

## Browser Compatibility

### Target Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **SVG Features**: Full SVG 1.1 filter and SMIL animation support
- **Progressive Enhancement**: File System Access API, WebCodecs API where available

### Fallback Strategy
- Canvas-based export for unsupported browsers
- CSS animations fallback for SMIL
- Local storage fallback for File System API

## Documentation Requirements

### Code Documentation
- JSDoc comments for all public functions
- Inline comments for complex algorithms
- README updates for new features
- Type definitions should be self-documenting

### User Documentation
- Update USER_GUIDE.md for new features
- Include keyboard shortcuts in documentation
- Provide examples for complex workflows
- Maintain changelog for releases

## Development Workflow

### Feature Development
1. Create feature branch from main
2. Implement feature following conventions
3. Add comprehensive tests
4. Update documentation
5. Submit PR with detailed description

### Code Review Standards
- Check TypeScript types and coverage
- Verify accessibility compliance
- Test performance impact
- Ensure documentation is updated
- Verify cross-browser compatibility

### Release Process
1. Update version numbers
2. Generate changelog
3. Build and test production bundle
4. Create release tags
5. Deploy documentation updates

---

This guide should be referenced for all development work on Vector. For detailed technical specifications, see [SPEC.md](./SPEC.md). For project roadmap and priorities, see [ROADMAP.md](./ROADMAP.md).