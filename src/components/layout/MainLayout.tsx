import { LayersPanel } from '../panels/LayersPanel';
import { PropertiesPanel } from '../panels/PropertiesPanel';
import { CanvasArea } from './CanvasArea';
import { FileMenu } from '../menus/FileMenu';
import { EditMenu } from '../menus/EditMenu';
import { ViewMenu } from '../menus/ViewMenu';
import { ObjectMenu } from '../menus/ObjectMenu';
import { FilterMenu } from '../menus/FilterMenu';
import { AppearanceMenuContent } from '../menus/AppearanceMenu';
import { HelpMenu } from '../menus/HelpMenu';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

export function MainLayout() {

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Menu Bar */}
      <div className="h-10 bg-muted border-b border-border flex items-center px-4 text-sm">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <FileMenu />
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <EditMenu />
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <ViewMenu />
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Object</MenubarTrigger>
            <ObjectMenu />
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Filter</MenubarTrigger>
            <FilterMenu />
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Appearance</MenubarTrigger>
            <AppearanceMenuContent />
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Help</MenubarTrigger>
            <HelpMenu />
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Left Panel - Layers */}
          <ResizablePanel defaultSize={15} minSize={15} maxSize={30} className="bg-muted">
            <LayersPanel />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Canvas Area */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <CanvasArea />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Properties */}
          <ResizablePanel defaultSize={15} minSize={15} maxSize={30} className="bg-muted">
            <PropertiesPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}