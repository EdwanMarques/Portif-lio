import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Contact, Project } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

export function useAdminData() {
  const queryClient = useQueryClient();

  // Queries para dados 
  const contactsQuery = useQuery<Contact[]>({
    queryKey: ['/api/contacts'],
    gcTime: 1000 * 60 * 5, // 5 min
    staleTime: 1000 * 60 * 2, // 2 min
  });

  const projectsQuery = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    gcTime: 1000 * 60 * 5, // 5 min
    staleTime: 1000 * 60 * 2, // 2 min
  });

  // Mutations para projetos
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/projects/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Projeto excluído",
        description: "O projeto foi excluído com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: (error) => {
      console.error('Erro ao excluir projeto:', error);
      toast({
        title: "Erro ao excluir projeto",
        description: "Ocorreu um erro ao excluir o projeto. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      return apiRequest('/api/projects', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Projeto criado",
        description: "O projeto foi criado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: (error) => {
      console.error('Erro ao criar projeto:', error);
      toast({
        title: "Erro ao criar projeto",
        description: "Ocorreu um erro ao criar o projeto. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, projectData }: { id: number; projectData: any }) => {
      return apiRequest(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
    },
    onSuccess: () => {
      toast({
        title: "Projeto atualizado",
        description: "O projeto foi atualizado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar projeto:', error);
      toast({
        title: "Erro ao atualizar projeto",
        description: "Ocorreu um erro ao atualizar o projeto. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Auth check query
  const authQuery = useQuery({
    queryKey: ['/api/auth/check'],
    retry: false,
    gcTime: 1000 * 60 * 10, // 10 min
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/auth/logout', { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/check'] });
      toast({
        title: "Desconectado",
        description: "Você foi desconectado com sucesso.",
      });
    },
  });

  return {
    // Queries
    contacts: {
      data: contactsQuery.data || [],
      isLoading: contactsQuery.isLoading,
      error: contactsQuery.error,
      refetch: contactsQuery.refetch,
    },
    projects: {
      data: projectsQuery.data || [],
      isLoading: projectsQuery.isLoading,
      error: projectsQuery.error,
      refetch: projectsQuery.refetch,
    },
    auth: {
      isAuthenticated: authQuery.status === 'success',
      isLoading: authQuery.isLoading,
      error: authQuery.error,
    },
    
    // Mutations
    deleteProject: deleteProjectMutation.mutate,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    logout: logoutMutation.mutate,
    
    // Mutation states
    mutations: {
      deleteProject: {
        isPending: deleteProjectMutation.isPending,
        isSuccess: deleteProjectMutation.isSuccess,
      },
      createProject: {
        isPending: createProjectMutation.isPending,
        isSuccess: createProjectMutation.isSuccess,
      },
      updateProject: {
        isPending: updateProjectMutation.isPending,
        isSuccess: updateProjectMutation.isSuccess,
      },
      logout: {
        isPending: logoutMutation.isPending,
      },
    },
  };
}