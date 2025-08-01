import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{
    keys: string[];
    description: string;
  }>;
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'General',
    shortcuts: [
      { keys: ['Ctrl', 'Z'], description: 'Undo' },
      { keys: ['Ctrl', 'Y'], description: 'Redo' },
      { keys: ['Ctrl', 'A'], description: 'Select All' },
      { keys: ['Delete'], description: 'Delete Selected' },
      { keys: ['Ctrl', 'D'], description: 'Duplicate' },
    ],
  },
  {
    title: 'Tools',
    shortcuts: [
      { keys: ['V'], description: 'Select Tool' },
      { keys: ['R'], description: 'Rectangle Tool' },
      { keys: ['O'], description: 'Ellipse Tool' },
      { keys: ['P'], description: 'Pen Tool' },
      { keys: ['T'], description: 'Text Tool' },
    ],
  },
  {
    title: 'View',
    shortcuts: [
      { keys: ['Ctrl', '+'], description: 'Zoom In' },
      { keys: ['Ctrl', '-'], description: 'Zoom Out' },
      { keys: ['Ctrl', '0'], description: 'Zoom to Fit' },
      { keys: ['Ctrl', '1'], description: 'Zoom to 100%' },
      { keys: ['Ctrl', '2'], description: 'Zoom to Selection' },
      { keys: ['Space'], description: 'Pan Mode (hold)' },
      { keys: ['↑', '↓', '←', '→'], description: 'Pan View' },
      { keys: ['Shift', '↑↓←→'], description: 'Pan View (fast)' },
      { keys: ['Home'], description: 'Center View' },
      { keys: ['Shift', 'Wheel'], description: 'Horizontal Pan' },
      { keys: ['Alt', 'Wheel'], description: 'Vertical Pan' },
      { keys: ['Ctrl', 'Wheel'], description: 'Precise Zoom' },
    ],
  },
  {
    title: 'File',
    shortcuts: [
      { keys: ['Ctrl', 'N'], description: 'New Document' },
      { keys: ['Ctrl', 'O'], description: 'Open' },
      { keys: ['Ctrl', 'S'], description: 'Save' },
      { keys: ['Ctrl', 'Shift', 'S'], description: 'Save As' },
      { keys: ['Ctrl', 'E'], description: 'Export' },
    ],
  },
];

function KeyboardKey({ children }: { children: string }) {
  return (
    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
      {children}
    </kbd>
  );
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {shortcutGroups.map((group, groupIndex) => (
            <div key={group.title}>
              <h3 className="text-lg font-medium mb-3 text-foreground">
                {group.title}
              </h3>
              
              <div className="space-y-2">
                {group.shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2"
                  >
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className="flex items-center">
                          <KeyboardKey>{key}</KeyboardKey>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-muted-foreground">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {groupIndex < shortcutGroups.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> On Mac, use <KeyboardKey>Cmd</KeyboardKey> instead of <KeyboardKey>Ctrl</KeyboardKey>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}