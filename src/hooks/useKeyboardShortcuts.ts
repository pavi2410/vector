import { useEffect, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { canvasStore, transformStore } from '@/stores/canvas';
import { selectionStore } from '@/stores/selection';
import { type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

interface KeyboardShortcutsOptions {
  transformRef?: React.RefObject<ReactZoomPanPinchRef | null>;
  onTogglePanMode?: (active: boolean) => void;
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
  const { shapes, artboards } = useStore(canvasStore);
  const { scale } = useStore(transformStore);
  const { selectedIds } = useStore(selectionStore);
  const { transformRef } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { ctrlKey, metaKey, key, shiftKey, altKey } = event;
    const isModifierPressed = ctrlKey || metaKey;
    
    // Prevent shortcuts when typing in inputs
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (key) {
      // Zoom shortcuts
      case '=':
      case '+':
        if (isModifierPressed && transformRef?.current) {
          event.preventDefault();
          transformRef.current.zoomIn(0.2);
        }
        break;
      
      case '-':
        if (isModifierPressed && transformRef?.current) {
          event.preventDefault();
          transformRef.current.zoomOut(0.2);
        }
        break;
      
      case '0':
        if (isModifierPressed && transformRef?.current) {
          event.preventDefault();
          // Call zoomToFit function directly
          const zoomToFit = () => {
            if (artboards.length === 0) return;

            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            artboards.forEach(artboard => {
              minX = Math.min(minX, artboard.x);
              minY = Math.min(minY, artboard.y);
              maxX = Math.max(maxX, artboard.x + artboard.width);
              maxY = Math.max(maxY, artboard.y + artboard.height);
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
            
            transformRef.current?.setTransform(newX, newY, newScale);
          };
          zoomToFit();
        }
        break;
      
      case '1':
        if (isModifierPressed && transformRef?.current) {
          event.preventDefault();
          transformRef.current.setTransform(0, 0, 1);
        }
        break;
      
      case '2':
        if (isModifierPressed && selectedIds.length > 0 && transformRef?.current) {
          event.preventDefault();
          // Call zoomToSelection function directly
          const zoomToSelection = () => {
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
            
            transformRef.current?.setTransform(newX, newY, newScale);
          };
          zoomToSelection();
        }
        break;

      // Pan with arrow keys
      case 'ArrowUp':
        if (!isModifierPressed && !altKey && transformRef?.current) {
          event.preventDefault();
          const panAmount = shiftKey ? 50 : 10;
          const { state } = transformRef.current;
          transformRef.current.setTransform(state.positionX, state.positionY + panAmount, state.scale);
        }
        break;
      
      case 'ArrowDown':
        if (!isModifierPressed && !altKey && transformRef?.current) {
          event.preventDefault();
          const panAmount = shiftKey ? 50 : 10;
          const { state } = transformRef.current;
          transformRef.current.setTransform(state.positionX, state.positionY - panAmount, state.scale);
        }
        break;
      
      case 'ArrowLeft':
        if (!isModifierPressed && !altKey && transformRef?.current) {
          event.preventDefault();
          const panAmount = shiftKey ? 50 : 10;
          const { state } = transformRef.current;
          transformRef.current.setTransform(state.positionX + panAmount, state.positionY, state.scale);
        }
        break;
      
      case 'ArrowRight':
        if (!isModifierPressed && !altKey && transformRef?.current) {
          event.preventDefault();
          const panAmount = shiftKey ? 50 : 10;
          const { state } = transformRef.current;
          transformRef.current.setTransform(state.positionX - panAmount, state.positionY, state.scale);
        }
        break;

      // Space bar for pan mode
      case ' ':
        if (!isModifierPressed && !altKey) {
          event.preventDefault();
          options.onTogglePanMode?.(true);
        }
        break;

      // Home key to center view  
      case 'Home':
        if (!isModifierPressed && transformRef?.current && artboards.length > 0) {
          event.preventDefault();
          const mainArtboard = artboards[0];
          const containerWidth = window.innerWidth;
          const containerHeight = window.innerHeight;
          
          const centerX = mainArtboard.x + mainArtboard.width / 2;
          const centerY = mainArtboard.y + mainArtboard.height / 2;
          const newX = containerWidth / 2 - centerX;
          const newY = containerHeight / 2 - centerY;
          
          transformRef.current.setTransform(newX, newY, 1);
        }
        break;
    }
  }, [transformRef, shapes, artboards, selectedIds, options]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === ' ') {
      event.preventDefault();
      options.onTogglePanMode?.(false);
    }
  }, [options]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
}