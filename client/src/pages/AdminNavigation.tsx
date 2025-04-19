import { useNavigation } from "@/hooks/useNavigation";
import NavigationManager from "@/components/admin/NavigationManager";
import { InsertNavigationItem } from "@shared/schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const AdminNavigation = () => {
  const {
    navigation,
    isLoading,
    error,
    createNavigationItem,
    updateNavigationItem,
    deleteNavigationItem,
    isCreating,
    isUpdating,
    isDeleting
  } = useNavigation();

  const handleCreateItem = (item: InsertNavigationItem) => {
    createNavigationItem(item);
  };

  const handleUpdateItem = (id: number, data: Partial<InsertNavigationItem>) => {
    updateNavigationItem({ id, data });
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm("Are you sure you want to delete this navigation item?")) {
      deleteNavigationItem(id);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load navigation data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Navigation Manager</h2>
      </div>
      
      <NavigationManager
        navigationItems={navigation}
        isLoading={isLoading}
        isCreating={isCreating}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        onCreateItem={handleCreateItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
      />
    </div>
  );
};

export default AdminNavigation;
