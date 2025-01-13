// src/components/layout/MobileDrawer.tsx
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
import type { ModelSettings } from '@/types/settings';

interface MobileDrawerProps {
  settings: ModelSettings;
  onSettingChange: <K extends keyof ModelSettings>(
    key: K,
    value: ModelSettings[K]
  ) => void;
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
            <DrawerTitle>Model Instellingen</DrawerTitle>
            <DrawerDescription>
              Pas de model parameters aan
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
              <Button variant="outline">Sluiten</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};