# Vector - SVG Editor with Filter Pipeline

A modern, local-first SVG editor built with React 19, featuring first-class support for SVG filters through a visual node-based pipeline editor.

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build
```

## ✨ Features

- **Modern SVG Editor**: Figma-inspired interface with professional editing tools
- **Visual Filter Pipeline**: Node-based filter editor using React Flow
- **Local-First**: No cloud dependency, works entirely in your browser
- **React 19**: Built with the latest React features and concurrent rendering
- **Real-time Preview**: Live filter application and visual feedback
- **Multi-Format Export**: SVG, PNG, JPEG, and PDF export options

## 🎯 Core Capabilities

### Shape Tools
- Rectangle, Circle, Line, and Text creation
- Path tool with bezier curve editing
- Professional selection and transformation tools

### Advanced Selection System
- Multi-element selection and manipulation
- 8-point resize handles (corners + edges)
- Drag-to-move functionality with visual feedback
- Frame-based organization with independent resize controls

### Filter Pipeline Editor
- Visual node-based filter construction
- Real-time filter preview on canvas elements
- Native SVG filter support (blur, drop-shadow, color matrix, etc.)
- Filter library with reusable templates

### Professional UI
- Resizable panels (Layers, Properties, Filter Pipeline)
- Floating tool palette
- Zoom-aware canvas with pan controls
- Dark/Light theme support

## 📖 Documentation

**[📚 User Guide](./USER_GUIDE.md)** - Comprehensive guide covering all features and workflows

### Quick Links
- [Getting Started](./USER_GUIDE.md#getting-started)
- [Canvas Navigation](./USER_GUIDE.md#canvas-navigation)  
- [Selection & Transformation](./USER_GUIDE.md#selection-and-transformation)
- [Frame Management](./USER_GUIDE.md#frame-management)
- [Filter Pipeline](./USER_GUIDE.md#filter-pipeline)
- [Keyboard Shortcuts](./USER_GUIDE.md#keyboard-shortcuts)

## 🛠 Tech Stack

- **Runtime**: Bun (fast package manager and runtime)
- **Framework**: React 19 (with concurrent features)
- **Build Tool**: Vite (fast development and optimized builds)
- **UI Components**: Shadcn/ui (modern, accessible components)
- **State Management**: Nanostores (atomic, reactive state)
- **Filter Editor**: React Flow (node-based visual editor)
- **Styling**: Tailwind CSS (utility-first framework)
- **Type Safety**: TypeScript (full type coverage)

## 🏗 Architecture

### SVG-Based Rendering
Vector uses native SVG rendering for:
- **Native Filter Support**: SVG filters work without conversion
- **Vector Precision**: True scalable vectors at any zoom level
- **DOM Integration**: Direct React component manipulation
- **Export Simplicity**: Direct SVG output without canvas conversion

### State Management
```typescript
// Atomic stores with Nanostores
- canvasStore: shapes, frames, viewport
- selectionStore: selected elements, transform handles  
- toolStore: active tool, settings
- filterStore: pipelines, preview state
```

## 📝 Development Commands

```bash
# Development
bun dev              # Start dev server
bun run build        # Build for production  
bun run preview      # Preview production build

# Code Quality
bun run typecheck    # Run TypeScript checks
bun run lint         # Run ESLint
bun run lint:fix     # Fix linting issues

# Testing
bun test             # Run tests
bun test --watch     # Run tests in watch mode
```

## 🎨 Key Design Decisions

### Why SVG over Canvas?
- **Filter Integration**: Perfect match with React Flow - generates actual SVG filter definitions
- **Vector Precision**: No pixelation at any zoom level
- **Accessibility**: Screen reader support and semantic markup
- **Export Quality**: Direct SVG output maintains all vector properties

### Component Architecture
```
src/
├── components/
│   ├── canvas/          # SVG canvas and rendering
│   ├── panels/          # UI panels (tools, layers, properties)
│   ├── filters/         # Filter node components
│   └── ui/              # Shadcn/ui components
├── stores/              # Nanostores atomic state
├── types/               # TypeScript definitions
└── utils/               # Helper functions
```

## 🌟 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Figma's professional design interface
- Built with modern React 19 and concurrent features
- Powered by the excellent React Flow library for node editing
- UI components from the fantastic Shadcn/ui library

---

**Vector** - Professional SVG editing with the power of visual filter pipelines.