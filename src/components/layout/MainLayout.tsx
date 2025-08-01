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
import { InlineEditableFileName } from '../ui/InlineEditableFileName';
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
      <div className="h-10 border-b border-border flex items-center px-4 text-sm">
        <Menubar className="border-0 shadow-none p-0">
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

        {/* Centered File Name */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <InlineEditableFileName />
        </div>
      </div>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Layers */}
        <ResizablePanel defaultSize={15} minSize={15} maxSize={30}>
          <LayersPanel />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Canvas Area */}
        <ResizablePanel defaultSize={60} minSize={30}>
          <CanvasArea />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Properties */}
        <ResizablePanel defaultSize={15} minSize={15} maxSize={30}>
          <PropertiesPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}