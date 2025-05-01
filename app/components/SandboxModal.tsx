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
import { toast } from '@/components/ui/use-toast'
import { api } from '@/lib/apiClient'

export default function SandboxModal() {
  const { sandboxMode, toggleSandboxMode } = useSandbox()

  const handleResetData = async () => {
    try {
      await api.resetSandbox()
      toast({
        title: 'Success',
        description: 'Sandbox data has been reset',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset sandbox data',
        variant: 'destructive',
      })
    }
  }

  const handleGenerateData = async () => {
    try {
      await api.resetSandbox()
      toast({
        title: 'Success',
        description: 'Sample data has been generated',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate sample data',
        variant: 'destructive',
      })
    }
  }

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
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleResetData}
              >
                Reset Test Data
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleGenerateData}
              >
                Generate Sample Data
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 