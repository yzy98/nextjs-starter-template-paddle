"use client";

import { ModeToggle } from "@/components/layout/mode-toggle";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export const DashboardSettings = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-foreground">
          Settings
        </CardTitle>
        <CardDescription>Customize your dashboard appearance</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Theme Mode</Label>
            <p className="text-sm text-muted-foreground">
              Choose between light, dark, or system themes
            </p>
          </div>
          <ModeToggle />
        </div>
      </CardContent>
    </Card>
  );
};
