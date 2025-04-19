import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Layout } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import ComponentLibrary from "@/components/admin/ComponentLibrary";
import BuilderCanvas from "@/components/admin/BuilderCanvas";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Save } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminBuilder = () => {
  const [selectedCategory, setSelectedCategory] = useState("Layout");
  const [previewMode, setPreviewMode] = useState(false);
  const [layoutName, setLayoutName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const {
    components,
    handleDrop,
    updateComponent,
    removeComponent,
    moveComponent,
    setComponents
  } = useDragAndDrop();
  
  // Create layout mutation
  const createLayoutMutation = useMutation({
    mutationFn: async (layoutData: { name: string, components: any[], isActive: boolean }) => {
      const res = await apiRequest('POST', '/api/layouts', layoutData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/layouts'] });
      toast({
        title: "Layout saved",
        description: "Your layout has been saved successfully.",
      });
      setSaveDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error saving layout",
        description: "There was a problem saving your layout.",
        variant: "destructive",
      });
    }
  });
  
  // Get layouts
  const { data: layouts, isLoading: layoutsLoading } = useQuery<Layout[]>({
    queryKey: ['/api/layouts'],
  });
  
  const handleSaveLayout = () => {
    if (!layoutName) {
      toast({
        title: "Layout name required",
        description: "Please provide a name for your layout.",
        variant: "destructive",
      });
      return;
    }
    
    createLayoutMutation.mutate({
      name: layoutName,
      components: components,
      isActive: true
    });
  };
  
  const handleLoadLayout = (layout: Layout) => {
    setComponents(layout.components as any);
    setLayoutName(layout.name);
    toast({
      title: "Layout loaded",
      description: `Layout "${layout.name}" has been loaded.`,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Admin UI Builder</h2>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {previewMode ? "Edit" : "Preview"}
          </Button>
          <Button 
            onClick={() => setSaveDialogOpen(true)}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Layout
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Component Library sidebar */}
        {!previewMode && (
          <ComponentLibrary 
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}
        
        {/* Builder Canvas */}
        <div className={previewMode ? "col-span-full" : "lg:col-span-3"}>
          <BuilderCanvas
            components={components}
            onDrop={handleDrop}
            onMove={moveComponent}
            onUpdate={updateComponent}
            onRemove={removeComponent}
          />
        </div>
      </div>
      
      {/* Save Layout Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Layout</DialogTitle>
            <DialogDescription>
              Give your layout a name to save it. You can load it later.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="layout-name">Layout Name</Label>
            <Input
              id="layout-name"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              placeholder="My Custom Layout"
            />
          </div>
          
          {layouts && layouts.length > 0 && (
            <div className="py-2">
              <Label>Load Existing Layout</Label>
              <div className="mt-2 space-y-2">
                {layouts.map(layout => (
                  <Button
                    key={layout.id}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleLoadLayout(layout)}
                  >
                    {layout.name}
                    {layout.isActive && " (Active)"}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveLayout} disabled={createLayoutMutation.isPending}>
              {createLayoutMutation.isPending ? "Saving..." : "Save Layout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBuilder;
