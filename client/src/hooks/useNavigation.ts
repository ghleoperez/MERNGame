import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { NavigationItem, InsertNavigationItem } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export const useNavigation = () => {
  const { data: navigation = [], isLoading, error } = useQuery<NavigationItem[]>({
    queryKey: ['/api/navigation'],
  });

  const createNavigationItemMutation = useMutation({
    mutationFn: async (navigationItem: InsertNavigationItem) => {
      const res = await apiRequest('POST', '/api/navigation', navigationItem);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/navigation'] });
    },
  });

  const updateNavigationItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<InsertNavigationItem> }) => {
      const res = await apiRequest('PATCH', `/api/navigation/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/navigation'] });
    },
  });

  const deleteNavigationItemMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/navigation/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/navigation'] });
    },
  });

  return {
    navigation,
    isLoading,
    error,
    createNavigationItem: createNavigationItemMutation.mutate,
    updateNavigationItem: updateNavigationItemMutation.mutate,
    deleteNavigationItem: deleteNavigationItemMutation.mutate,
    isCreating: createNavigationItemMutation.isPending,
    isUpdating: updateNavigationItemMutation.isPending,
    isDeleting: deleteNavigationItemMutation.isPending,
  };
};
