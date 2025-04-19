import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NavigationItem, insertNavigationItemSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash, GripVertical } from "lucide-react";
import { NAV_ICON_MAPPING } from "@/lib/constants";

// Extend the schema with client-side validation
const formSchema = insertNavigationItemSchema.extend({
  label: z.string().min(1, "Label is required"),
  path: z.string().min(1, "Path is required"),
  icon: z.string().min(1, "Icon is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface NavigationManagerProps {
  navigationItems: NavigationItem[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onCreateItem: (item: FormValues) => void;
  onUpdateItem: (id: number, item: Partial<FormValues>) => void;
  onDeleteItem: (id: number) => void;
}

const NavigationManager = ({
  navigationItems,
  isLoading,
  isCreating,
  isUpdating,
  isDeleting,
  onCreateItem,
  onUpdateItem,
  onDeleteItem
}: NavigationManagerProps) => {
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  
  // Initialize the form with default values or selected item values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      path: "",
      icon: "home",
      isAdminOnly: false,
      sortOrder: 1,
      parentId: null
    }
  });
  
  // Set form values when selecting an item to edit
  const handleEditItem = (item: NavigationItem) => {
    setEditingItemId(item.id);
    form.reset({
      label: item.label,
      path: item.path,
      icon: item.icon,
      isAdminOnly: item.isAdminOnly,
      sortOrder: item.sortOrder,
      parentId: item.parentId
    });
  };
  
  const handleCancelEdit = () => {
    setEditingItemId(null);
    form.reset({
      label: "",
      path: "",
      icon: "home",
      isAdminOnly: false,
      sortOrder: navigationItems.length + 1,
      parentId: null
    });
  };
  
  const onSubmit = (values: FormValues) => {
    if (editingItemId) {
      onUpdateItem(editingItemId, values);
      setEditingItemId(null);
    } else {
      onCreateItem({
        ...values,
        sortOrder: navigationItems.length + 1
      });
    }
    
    // Reset form after submission
    form.reset({
      label: "",
      path: "",
      icon: "home",
      isAdminOnly: false,
      sortOrder: navigationItems.length + 1,
      parentId: null
    });
  };
  
  // Render icon based on name
  const renderIcon = (iconName: string) => {
    const iconClassName = `fa-${iconName}`;
    return (
      <span className={`w-5 text-center text-muted-foreground`}>
        <i className={`fas ${iconClassName}`}></i>
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Item List */}
      <div className="col-span-2 bg-muted rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Menu Structure</h3>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setEditingItemId(null);
              form.reset({
                label: "",
                path: "",
                icon: "home",
                isAdminOnly: false,
                sortOrder: navigationItems.length + 1,
                parentId: null
              });
            }}
          >
            Add Item
          </Button>
        </div>
        
        <div className="space-y-2">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="p-3 bg-card rounded-md border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="w-4 h-12 mr-3" />
                    <div>
                      <Skeleton className="w-24 h-4 mb-1" />
                      <Skeleton className="w-16 h-3" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <Skeleton className="w-7 h-7 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <>
              {navigationItems.map(item => (
                <div 
                  key={item.id} 
                  className="p-3 bg-card rounded-md border border-border cursor-move"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <GripVertical className="h-5 w-5 text-muted-foreground mr-3" />
                      <div>
                        <div className="flex items-center">
                          {renderIcon(item.icon)}
                          <span className="ml-2 text-foreground">{item.label}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{item.path}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-7 h-7 rounded-full"
                        onClick={() => handleEditItem(item)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-7 h-7 rounded-full"
                        onClick={() => onDeleteItem(item.id)}
                        disabled={isDeleting}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {navigationItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No navigation items. Add one to get started.
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Item Form */}
      <div className="bg-muted rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold mb-4">
          {editingItemId ? "Edit Menu Item" : "Add Menu Item"}
        </h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Path</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="gamepad">Gamepad</SelectItem>
                      <SelectItem value="store">Store</SelectItem>
                      <SelectItem value="user-friends">Friends</SelectItem>
                      <SelectItem value="tools">Tools</SelectItem>
                      <SelectItem value="sitemap">Sitemap</SelectItem>
                      <SelectItem value="cog">Settings</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isAdminOnly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permission Level</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value === "admin")} 
                    defaultValue={field.value ? "admin" : "user"}
                    value={field.value ? "admin" : "user"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select permission" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex space-x-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isCreating || isUpdating}
              >
                {editingItemId ? "Save Item" : "Add Item"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NavigationManager;
