import { useState, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { currentProjectStore, updateProjectName, createNewProject } from '../../stores/project';
import { cn } from '@/lib/utils';

export function InlineEditableFileName() {
  const project = useStore(currentProjectStore);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const projectName = project?.name || 'Untitled Project';

  useEffect(() => {
    if (!project) {
      createNewProject();
    }
  }, [project]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditValue(projectName);
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== projectName) {
      updateProjectName(trimmedValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue('');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={cn(
          "bg-transparent border-none outline-none text-center text-foreground",
          "focus:bg-background focus:border focus:border-border focus:rounded px-2 py-1",
          "min-w-[120px] max-w-[300px]"
        )}
      />
    );
  }

  return (
    <button
      onClick={handleStartEdit}
      className={cn(
        "text-foreground hover:text-accent-foreground transition-colors",
        "px-2 py-1 rounded hover:bg-accent/50",
        "text-center cursor-pointer select-none",
        "min-w-[120px] max-w-[300px] truncate"
      )}
      title="Click to edit file name"
    >
      {projectName}
    </button>
  );
}