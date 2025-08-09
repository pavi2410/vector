import React, { useState, useEffect, useRef } from 'react';
import { updateShape } from '@/stores/canvas';
import type { Shape } from '@/types/canvas';

interface TextEditorProps {
  shape: Shape;
  onFinishEditing: () => void;
  scale: number;
}

export function TextEditor({ shape, onFinishEditing }: TextEditorProps) {
  const [text, setText] = useState(shape.text || 'Text');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      handleFinishEditing();
    }
  };

  const handleBlur = () => {
    handleFinishEditing();
  };

  const handleFinishEditing = () => {
    updateShape(shape.id, { text: text.trim() || 'Text' });
    onFinishEditing();
  };

  const fontSize = shape.fontSize || 16;
  const fontFamily = shape.fontFamily || 'Inter, system-ui, sans-serif';
  const fontWeight = shape.fontWeight || 'normal';
  const fontStyle = shape.fontStyle || 'normal';

  return (
    <foreignObject
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        style={{
          fontSize: `${fontSize}px`,
          fontFamily,
          fontWeight,
          fontStyle,
          color: shape.fill || '#000000',
          background: 'transparent',
          border: '1px dashed #3b82f6',
          outline: 'none',
          padding: '2px',
          width: '100%',
          height: '100%',
          textAlign: shape.textAlign === 'middle' ? 'center' : shape.textAlign === 'end' ? 'right' : 'left'
        }}
      />
    </foreignObject>
  );
}