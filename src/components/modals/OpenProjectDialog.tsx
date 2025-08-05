import { useState } from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  getAllSavedProjects,
  loadProjectFromLocalStorage,
  deleteProjectFromLocalStorage 
} from '@/stores/project';
import { 
  FolderOpen, 
  Search, 
  Trash2, 
  Calendar,
  FileText
} from 'lucide-react';
import type { Project } from '@/types/project';

interface OpenProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OpenProjectDialog({ onClose }: OpenProjectDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get all saved projects and filter by search query
  const allProjects = getAllSavedProjects();
  const filteredProjects = allProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenProject = async (project: Project) => {
    setIsLoading(true);
    
    try {
      const loadedProject = loadProjectFromLocalStorage(project.id);
      
      if (loadedProject) {
        // Recent files will be automatically updated via computed store
        onClose();
      }
    } catch (error) {
      console.error('Failed to open project:', error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      const success = deleteProjectFromLocalStorage(projectToDelete.id);
      if (success) {
        setProjectToDelete(null);
        // Force re-render by updating search query
        setSearchQuery(prev => prev + ' ');
        setSearchQuery(prev => prev.trim());
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <DialogContent className="sm:max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Open Project
          </DialogTitle>
          <DialogDescription>
            Choose a project from your saved work to continue editing.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="project-search">Search Projects</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="project-search"
                placeholder="Search by project name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Projects Grid */}
          <div className="flex-1 min-h-0">
            {filteredProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {allProjects.length === 0 ? 'No Projects Yet' : 'No Projects Found'}
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  {allProjects.length === 0 
                    ? 'Create your first project to get started with Vector.'
                    : 'Try adjusting your search query to find projects.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group relative border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => handleOpenProject(project)}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                      {project.thumbnail ? (
                        <div 
                          className="w-full h-full"
                          dangerouslySetInnerHTML={{ 
                            __html: atob(project.thumbnail.split(',')[1])
                          }}
                        />
                      ) : (
                        <FileText className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    
                    {/* Project Info */}
                    <div className="p-3">
                      <h4 className="font-medium text-sm truncate mb-1">
                        {project.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(project.modifiedAt)}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}