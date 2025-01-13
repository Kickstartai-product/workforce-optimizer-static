import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MenuIcon } from "lucide-react";
import { SettingsPanel } from '../settings/SettingsPanel';
import type { Setting } from '@/types/settings';

interface MobileDrawerProps {
  settings: Setting[];
  onSettingChange: (id: string, value: number) => void;
}

export const MobileDrawer = ({ settings, onSettingChange }: MobileDrawerProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <MenuIcon className="h-4 w-4" />
          <span className="sr-only">Open settings</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
            <DrawerDescription>
              Adjust visualization parameters
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <SettingsPanel
              settings={settings}
              onSettingChange={onSettingChange}
            />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};