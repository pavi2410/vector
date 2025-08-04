import { useHotkeys } from 'react-hotkeys-hook';
import { useStore } from '@nanostores/react';
import { canvasStore, removeShape, addShapes } from '@/stores/canvas';
import { selectionStore, clearSelection, selectMultiple } from '@/stores/selection';
import { clipboardStore, copyShapesToClipboard } from '@/stores/clipboard';
import { useControls } from 'react-zoom-pan-pinch';

interface CanvasShortcutsOptions {
  onTogglePanMode?: (active: boolean) => void;
}

export function useCanvasShortcuts(options: CanvasShortcutsOptions = {}) {
  const { shapes, frames } = useStore(canvasStore);
  const { selectedIds } = useStore(selectionStore);
  const { shapes: clipboardShapes } = useStore(clipboardStore);
  const { zoomIn, zoomOut, setTransform, instance } = useControls();

  const selectedShapes = shapes.filter(shape => selectedIds.includes(shape.id));

  // Cmd+Plus / Ctrl+Plus - Zoom In
  useHotkeys('ctrl+=, cmd+=, ctrl+plus, cmd+plus', (event) => {
    event.preventDefault();
    zoomIn(0.2);
  }, {
    enableOnFormTags: false,
  });

  // Cmd+Minus / Ctrl+Minus - Zoom Out
  useHotkeys('ctrl+-, cmd+-', (event) => {
    event.preventDefault();
    zoomOut(0.2);
  }, {
    enableOnFormTags: false,
  });

  // Delete / Backspace - Delete Selected Shapes
  useHotkeys('delete, backspace', (event) => {
    event.preventDefault();
    if (selectedIds.length > 0) {
      selectedIds.forEach(id => removeShape(id));
      clearSelection();
    }
  }, {
    enableOnFormTags: false,
  });

  // Cmd+C / Ctrl+C - Copy Selected Shapes
  useHotkeys('ctrl+c, cmd+c', (event) => {
    event.preventDefault();
    if (selectedShapes.length > 0) {
      copyShapesToClipboard(selectedShapes);
    }
  }, {
    enableOnFormTags: false,
  });

  // Cmd+X / Ctrl+X - Cut Selected Shapes
  useHotkeys('ctrl+x, cmd+x', (event) => {
    event.preventDefault();
    if (selectedShapes.length > 0) {
      copyShapesToClipboard(selectedShapes);
      selectedIds.forEach(id => removeShape(id));
      clearSelection();
    }
  }, {
    enableOnFormTags: false,
  });

  // Cmd+V / Ctrl+V - Paste Shapes
  useHotkeys('ctrl+v, cmd+v', (event) => {
    event.preventDefault();
    if (clipboardShapes.length > 0) {
      // Generate new IDs for pasted shapes and offset their position
      const offset = 20; // Offset pasted shapes by 20px
      const pastedShapes = clipboardShapes.map((shape, index) => ({
        ...shape,
        id: `${shape.type}-${Date.now()}-${index}`,
        x: shape.x + offset,
        y: shape.y + offset,
      }));
      
      // Add pasted shapes to canvas
      addShapes(pastedShapes);
      
      // Select the pasted shapes
      const pastedIds = pastedShapes.map(shape => shape.id);
      selectMultiple(pastedIds);
    }
  }, {
    enableOnFormTags: false,
  });

  // Cmd+0 / Ctrl+0 - Fit to Screen
  useHotkeys('ctrl+0, cmd+0', (event) => {
    if (frames.length > 0) {
      event.preventDefault();
      
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      frames.forEach(frame => {
        minX = Math.min(minX, frame.x);
        minY = Math.min(minY, frame.y);
        maxX = Math.max(maxX, frame.x + frame.width);
        maxY = Math.max(maxY, frame.y + frame.height);
      });

      const padding = 50;
      const boundsWidth = maxX - minX + padding * 2;
      const boundsHeight = maxY - minY + padding * 2;
      
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      const scaleX = containerWidth / boundsWidth;
      const scaleY = containerHeight / boundsHeight;
      const newScale = Math.min(scaleX, scaleY, 1);
      
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const newX = containerWidth / 2 - centerX * newScale;
      const newY = containerHeight / 2 - centerY * newScale;
      
      setTransform(newX, newY, newScale);
    }
  }, {
    enableOnFormTags: false,
  });

  // Cmd+1 / Ctrl+1 - Actual Size (100%)
  useHotkeys('ctrl+1, cmd+1', (event) => {
    event.preventDefault();
    setTransform(0, 0, 1);
  }, {
    enableOnFormTags: false,
  });

  // Cmd+2 / Ctrl+2 - Zoom to Selection
  useHotkeys('ctrl+2, cmd+2', (event) => {
    if (selectedIds.length > 0) {
      event.preventDefault();
      
      const selectedShapes = shapes.filter(shape => selectedIds.includes(shape.id));
      if (selectedShapes.length === 0) return;

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      selectedShapes.forEach(shape => {
        minX = Math.min(minX, shape.x);
        minY = Math.min(minY, shape.y);
        maxX = Math.max(maxX, shape.x + shape.width);
        maxY = Math.max(maxY, shape.y + shape.height);
      });

      const padding = 50;
      const boundsWidth = maxX - minX + padding * 2;
      const boundsHeight = maxY - minY + padding * 2;
      
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      const scaleX = containerWidth / boundsWidth;
      const scaleY = containerHeight / boundsHeight;
      const newScale = Math.min(scaleX, scaleY, 2);
      
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const newX = containerWidth / 2 - centerX * newScale;
      const newY = containerHeight / 2 - centerY * newScale;
      
      setTransform(newX, newY, newScale);
    }
  }, {
    enableOnFormTags: false,
  });

  // Arrow Keys - Pan Canvas
  useHotkeys('up', (event) => {
    event.preventDefault();
    const panAmount = event.shiftKey ? 50 : 10;
    setTransform(instance.transformState.positionX, instance.transformState.positionY + panAmount, instance.transformState.scale);
  }, {
    enableOnFormTags: false,
  });

  useHotkeys('down', (event) => {
    event.preventDefault();
    const panAmount = event.shiftKey ? 50 : 10;
    setTransform(instance.transformState.positionX, instance.transformState.positionY - panAmount, instance.transformState.scale);
  }, {
    enableOnFormTags: false,
  });

  useHotkeys('left', (event) => {
    event.preventDefault();
    const panAmount = event.shiftKey ? 50 : 10;
    setTransform(instance.transformState.positionX + panAmount, instance.transformState.positionY, instance.transformState.scale);
  }, {
    enableOnFormTags: false,
  });

  useHotkeys('right', (event) => {
    event.preventDefault();
    const panAmount = event.shiftKey ? 50 : 10;
    setTransform(instance.transformState.positionX - panAmount, instance.transformState.positionY, instance.transformState.scale);
  }, {
    enableOnFormTags: false,
  });

  // Space - Pan Mode Toggle
  useHotkeys('space', (event) => {
    event.preventDefault();
    options.onTogglePanMode?.(true);
  }, {
    enableOnFormTags: false,
    keydown: true,
    keyup: false,
  });

  useHotkeys('space', (event) => {
    event.preventDefault();
    options.onTogglePanMode?.(false);
  }, {
    enableOnFormTags: false,
    keydown: false,
    keyup: true,
  });

  // Home - Center to Main Artboard
  useHotkeys('home', (event) => {
    if (frames.length > 0) {
      event.preventDefault();
      const mainFrame = frames[0];
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      
      const centerX = mainFrame.x + mainFrame.width / 2;
      const centerY = mainFrame.y + mainFrame.height / 2;
      const newX = containerWidth / 2 - centerX;
      const newY = containerHeight / 2 - centerY;
      
      setTransform(newX, newY, 1);
    }
  }, {
    enableOnFormTags: false,
  });
}