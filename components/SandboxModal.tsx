"use client"

import { useSandbox } from '@/contexts/SandboxContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function SandboxModal() {
  const { sandboxMode, toggleSandboxMode } = useSandbox()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="fixed bottom-4 right-4">
          Sandbox Controls
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sandbox Controls</DialogTitle>
          <DialogDescription>
            Manage sandbox mode and test data
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="data">Test Data</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <div className="flex items-center space-x-2">
              <Switch
                id="sandbox-mode"
                checked={sandboxMode}
                onCheckedChange={toggleSandboxMode}
              />
              <Label htmlFor="sandbox-mode">Enable Sandbox Mode</Label>
            </div>
          </TabsContent>
          <TabsContent value="data">
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                Reset Test Data
              </Button>
              <Button variant="outline" className="w-full">
                Generate Sample Data
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
