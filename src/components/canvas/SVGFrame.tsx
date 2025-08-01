import { useState, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { TransformWrapper, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import { setTransform } from '@/stores/canvas';
import { toolStore } from '@/stores/tools';
import { FrameContent } from './FrameContent';

export function SVGFrame() {
  const [isSpacePanning, setIsSpacePanning] = useState(false);

  const { activeTool } = useStore(toolStore);

  // Transform change handler
  const handleTransformChange = useCallback((ref: ReactZoomPanPinchRef) => {
    const { state } = ref;
    setTransform(state.scale, state.positionX, state.positionY);
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
      onTransformed={handleTransformChange}
    >
      <FrameContent
        isSpacePanning={isSpacePanning}
        setIsSpacePanning={setIsSpacePanning}
      />
    </TransformWrapper>
  );
}