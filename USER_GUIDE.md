# Vector - User Guide

A comprehensive guide to using Vector, the modern SVG editor with advanced filter capabilities.

## Table of Contents
- [Getting Started](#getting-started)
- [Canvas Navigation](#canvas-navigation)
- [Shape Tools](#shape-tools)
- [Selection and Transformation](#selection-and-transformation)
- [Frame Management](#frame-management)
- [Filter Pipeline](#filter-pipeline)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Export Options](#export-options)

## Getting Started

Vector is a Figma-inspired SVG editor that runs entirely in your browser. No installation required - simply open the application and start creating.

### Interface Layout
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
│                Filter Pipeline Editor                           │
│  (React Flow - Expandable/Collapsible)                        │
│  ┌─────┐    ┌──────┐    ┌─────────────┐    ┌─────────┐        │
│  │ Src │────│ Blur │────│ DropShadow  │────│ Output  │        │
│  └─────┘    └──────┘    └─────────────┘    └─────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## Canvas Navigation

### Pan and Zoom
- **Mouse Wheel**: Zoom in/out
- **Middle Mouse Button**: Pan the canvas
- **Space + Drag**: Temporary pan mode
- **Pinch Gesture**: Zoom (on trackpads/touch devices)

### Canvas Controls
Located at the bottom center of the canvas:
- **Zoom Controls**: + / - buttons for precise zoom control
- **Fit to Screen**: Automatically fit content to viewport
- **100%**: Reset zoom to actual size
- **Grid Toggle**: Show/hide alignment grid

## Shape Tools

### Available Tools
1. **Select Tool** (V): Default selection and manipulation
2. **Rectangle Tool** (R): Create rectangular shapes
3. **Circle Tool** (C): Create circular/elliptical shapes  
4. **Line Tool** (L): Create straight lines
5. **Text Tool** (T): Add text elements
6. **Path Tool** (P): Create custom bezier paths

### Creating Shapes
1. Select the desired tool from the floating tool panel
2. Click and drag on the canvas to create the shape
3. Release to complete the shape creation
4. The new shape is automatically selected for immediate editing

## Selection and Transformation

Vector provides powerful selection and transformation capabilities similar to professional design tools.

### Selection Features

#### Visual Feedback
- **Blue Dashed Border**: Indicates selected elements
- **Bounding Box**: Automatically calculated around single or multiple selections
- **Zoom-Aware Display**: Selection indicators scale appropriately with zoom level

#### Selection Methods
- **Single Click**: Select individual shapes
- **Shift + Click**: Add/remove shapes from selection
- **Click Empty Area**: Clear all selections

### Moving Elements

#### How to Move
1. **Select elements** using the select tool
2. **Click and drag** the selection rectangle (not the handles)
3. **Visual feedback**: Cursor changes to "grab" when hovering, "grabbing" when dragging
4. **Release** to complete the move

#### Move Behavior
- **Multi-Element Support**: Move multiple selected shapes together
- **Relative Positioning**: Maintains spatial relationships between grouped elements
- **Real-Time Updates**: See position changes as you drag
- **Smooth Dragging**: Continues even when mouse moves outside selection area

### Resizing Elements

#### Resize Handles
Selected elements display **8 resize handles**:
- **4 Corner Handles**: Scale both width and height proportionally
- **4 Edge Handles**: Scale single dimension (width OR height only)

#### Resize Operations
1. **Select elements** to display resize handles
2. **Click and drag** any resize handle
3. **Visual feedback**: Cursor shows resize direction (↗, ↕, ↖, etc.)
4. **Release** to complete the resize

#### Resize Behavior
- **Proportional Scaling**: Multiple elements resize together maintaining relationships
- **Minimum Constraints**: Prevents elements from becoming too small (5px minimum)
- **Smart Scaling**: Corner handles maintain aspect ratios, edge handles scale single dimensions
- **Zoom Awareness**: Handle sizes adapt to current zoom level

#### Handle Functions
- **NW, NE, SE, SW (Corners)**: Proportional width/height scaling
- **N, S (Top/Bottom)**: Height-only scaling
- **E, W (Left/Right)**: Width-only scaling

### Multi-Selection Support
- **Unified Bounding Box**: Calculates combined bounds of all selected elements
- **Coordinated Transformations**: All selected elements move/resize together
- **Spatial Relationships**: Maintains relative positioning during operations

## Frame Management

Frames are containers that help organize your design into distinct artboards or sections.

### Frame Features

#### Visual Identification
- **Green Selection Border**: Frames show green instead of blue when selected
- **Frame Label**: Name displayed above selected frames
- **Background Fill**: Frames can have custom background colors

#### Frame Operations

##### Selecting Frames
- **Click Frame**: Select individual frames (when no shapes are clicked)
- **Shift + Click**: Add/remove frames from selection
- **Priority**: Shapes have selection priority over frames (shapes render on top)

##### Resizing Frames
1. **Select frame** to display green resize handles
2. **Drag handles** to resize frame dimensions
3. **Minimum Size**: 50px minimum width/height enforced
4. **Real-Time Updates**: Frame content adjusts during resize

##### Frame Resize Handles
Same 8-point system as shapes:
- **Corner Handles**: Proportional frame scaling
- **Edge Handles**: Single-dimension scaling
- **Visual Feedback**: Green handles with appropriate resize cursors

## Filter Pipeline

Vector's unique feature is the visual filter pipeline editor using node-based connections.

### Filter System
- **Visual Editor**: Drag-and-drop node interface
- **Real-Time Preview**: See filter effects applied to canvas elements
- **SVG Native**: All filters use native SVG filter specifications
- **Pipeline Architecture**: Connect multiple filter effects in sequence

### Available Filter Nodes
- **Source Nodes**: Input (SourceGraphic, SourceAlpha)
- **Blur Effects**: Gaussian blur with radius control
- **Drop Shadow**: Configurable offset, blur, and color
- **Color Matrix**: Full color transformation matrix
- **Composite Operations**: Blend modes and masking
- **Output Node**: Final filter result

### Creating Filter Pipelines
1. **Open Filter Panel**: Expand the bottom filter pipeline editor
2. **Add Nodes**: Drag filter types from the library
3. **Connect Nodes**: Draw connections between input/output ports
4. **Configure Parameters**: Adjust settings in each node
5. **Apply to Elements**: Assign completed pipelines to selected shapes

## Keyboard Shortcuts

### Tool Selection
- **V**: Select tool
- **R**: Rectangle tool  
- **C**: Circle tool
- **L**: Line tool
- **T**: Text tool
- **P**: Path tool

### Canvas Navigation
- **Space + Drag**: Pan canvas
- **Ctrl/Cmd + Mouse Wheel**: Zoom in/out
- **Ctrl/Cmd + 0**: Fit to screen
- **Ctrl/Cmd + 1**: 100% zoom

### Selection Operations
- **Shift + Click**: Add to selection
- **Ctrl/Cmd + A**: Select all
- **Ctrl/Cmd + D**: Deselect all
- **Delete/Backspace**: Delete selected elements

### Edit Operations
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Shift + Z**: Redo
- **Ctrl/Cmd + C**: Copy
- **Ctrl/Cmd + V**: Paste
- **Ctrl/Cmd + X**: Cut

## Export Options

### Supported Formats
- **SVG**: Native format with preserved filters and vector precision
- **PNG**: Rasterized output with filter effects rendered
- **JPEG**: Compressed rasterized format
- **PDF**: Vector PDF with embedded filters (where supported)

### Export Process
1. **File Menu** → Export
2. **Choose Format**: Select desired output format
3. **Configure Settings**: Adjust quality/size parameters
4. **Download**: Save file to your device

### Export Features
- **Filter Preservation**: SVG exports maintain all filter definitions
- **Clean Output**: Optimized SVG with minimal markup
- **High Resolution**: PNG/JPEG exports support custom DPI settings
- **Batch Export**: Export multiple artboards simultaneously

---

## Tips for Best Experience

### Performance
- **Large Documents**: Use layers panel to hide unused elements
- **Complex Filters**: Preview mode can be toggled off during editing
- **Zoom Levels**: Stay within 10% - 1000% range for optimal performance

### Workflow
- **Organize with Frames**: Use frames to separate different design sections
- **Layer Management**: Keep related elements grouped in the layers panel
- **Filter Reuse**: Save complex filter pipelines for reuse across projects
- **Regular Saves**: Use browser's local storage auto-save feature

### Browser Support
- **Recommended**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Requirements**: Modern browser with SVG 1.1 filter support
- **Features**: Progressive enhancement for newer APIs (File System Access)

---

*Vector v1.0 - Built with React 19, SVG, and modern web standards*