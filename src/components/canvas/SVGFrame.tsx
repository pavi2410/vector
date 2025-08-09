import { useState, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { TransformWrapper } from 'react-zoom-pan-pinch';
import { editorStore, clearSelection, setActiveTool } from '@/stores/editorState';
import { FrameContent } from './FrameContent';

export function SVGFrame() {
  const [isSpacePanning, setIsSpacePanning] = useState(false);

  const { activeTool } = useStore(editorStore);

  const handleWrapperClick = useCallback((event: React.MouseEvent) => {
    // Handle clicks on the wrapper background (outside the frame)
    const target = event.target as HTMLElement;
    
    // Check if the click is on the wrapper element (has transform-wrapper class or similar)
    if (target.classList.contains('react-transform-wrapper') || 
        target.classList.contains('react-transform-component')) {
      clearSelection();
      setActiveTool('select');
    }
  }, []);

  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.1}
      maxScale={10}
      limitToBounds={false}
      centerOnInit={true}
      wheel={{
        step: 0.1,
        wheelDisabled: false,
        touchPadDisabled: false
      }}
      pinch={{
        step: 5,
        disabled: false
      }}
      doubleClick={{ disabled: true }}
      panning={{
        disabled: activeTool !== 'select' && !isSpacePanning,
        velocityDisabled: false,
        lockAxisX: false,
        lockAxisY: false
      }}
    >
      <FrameContent
        isSpacePanning={isSpacePanning}
        setIsSpacePanning={setIsSpacePanning}
        onWrapperClick={handleWrapperClick}
      />
    </TransformWrapper>
  );
}