import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  FiLogOut, FiRefreshCw, FiUser, FiMail, FiMessageSquare, FiCalendar, 
  FiGrid, FiPlus, FiEdit2, FiTrash2, FiEye, FiImage, FiLink, FiGithub, FiTag, FiAlertTriangle
} from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";
import type { Contact, Project } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ProjectEditForm from "@/components/ProjectEditForm";
import { useAdminData } from "@/hooks/use-admin-data";
import { useEffect } from "react";

export default function AdminPage() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Estados para gerenciamento de UI
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | undefined>(undefined);
  const [projectToDelete, setProjectToDelete] = useState<Project | undefined>(undefined);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  
  // Usar nosso hook personalizado para dados e mutações
  const adminData = useAdminData();
  
  // Verificar autenticação e redirecionar se não estiver autenticado
  useEffect(() => {
    if (adminData.auth.error) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você precisa fazer login para acessar esta página.",
      });
      setLocation("/login");
    }
  }, [adminData.auth.error, setLocation, toast]);
  
  // Função simplificada para logout
  const handleLogout = () => {
    adminData.logout();
    setLocation("/");
  };

  if (adminData.auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black/95 p-4">
        <Card className="w-full max-w-4xl border-green-500/20 bg-black text-white">
          <CardHeader>
            <Skeleton className="h-8 w-48 bg-gray-800" />
            <Skeleton className="h-4 w-72 bg-gray-800" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full bg-gray-800" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/95 p-4 md:p-8">
      <div className="container mx-auto">
        <Card className="w-full border-green-500/20 bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-green-500">
                Painel Administrativo
              </CardTitle>
              <CardDescription className="text-gray-400">
                Gerencie projetos e mensagens de contato
              </CardDescription>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              <FiLogOut className="mr-2" />
              Sair
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="contacts" className="w-full">
              <TabsList className="mb-6 w-full bg-black border border-green-500/20">
                <TabsTrigger 
                  value="contacts" 
                  className="flex-1 data-[state=active]:bg-green-500/10 data-[state=active]:text-green-500"
                >
                  <FiMessageSquare className="mr-2" />
                  Mensagens
                </TabsTrigger>
                <TabsTrigger 
                  value="projects" 
                  className="flex-1 data-[state=active]:bg-green-500/10 data-[state=active]:text-green-500"
                >
                  <FiGrid className="mr-2" />
                  Projetos
                </TabsTrigger>
              </TabsList>

              {/* Tab de Mensagens de Contato */}
              <TabsContent value="contacts">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-green-400">Mensagens de Contato</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => adminData.contacts.refetch()}
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                  >
                    <FiRefreshCw className="mr-2" />
                    Atualizar
                  </Button>
                </div>

                {adminData.contacts.isLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, index) => (
                      <Skeleton key={index} className="h-12 w-full bg-gray-800" />
                    ))}
                  </div>
                ) : adminData.contacts.error ? (
                  <div className="rounded-md bg-red-500/20 p-4 text-center text-red-200">
                    <p>Ocorreu um erro ao carregar as mensagens de contato.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => adminData.contacts.refetch()}
                      className="mt-2 border-red-400 text-red-400 hover:bg-red-500/10"
                    >
                      Tentar novamente
                    </Button>
                  </div>
                ) : !adminData.contacts.data || adminData.contacts.data.length === 0 ? (
                  <div className="rounded-md bg-gray-800 p-8 text-center text-gray-400">
                    <p className="text-lg">Nenhuma mensagem de contato recebida ainda.</p>
                  </div>
                ) : (
                  <div className="rounded-md border border-green-500/20">
                    <Table>
                      <TableCaption>Lista de mensagens recebidas</TableCaption>
                      <TableHeader className="bg-green-500/10">
                        <TableRow>
                          <TableHead className="w-[100px] text-green-400">#ID</TableHead>
                          <TableHead className="text-green-400"><FiUser className="mr-1 inline" /> Nome</TableHead>
                          <TableHead className="text-green-400"><FiMail className="mr-1 inline" /> Email</TableHead>
                          <TableHead className="text-green-400"><FiMessageSquare className="mr-1 inline" /> Assunto</TableHead>
                          <TableHead className="text-green-400"><FiCalendar className="mr-1 inline" /> Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminData.contacts.data.map((contact: Contact) => (
                          <TableRow 
                            key={contact.id}
                            className="border-b border-green-500/10 hover:bg-green-500/5"
                          >
                            <TableCell className="font-mono text-gray-400">#{contact.id}</TableCell>
                            <TableCell className="font-medium text-white">{contact.name}</TableCell>
                            <TableCell className="text-gray-300">{contact.email}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                className="hover:bg-green-500/10 hover:text-green-400"
                                onClick={() => {
                                  toast({
                                    title: contact.subject,
                                    description: contact.message,
                                  });
                                }}
                              >
                                {contact.subject}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-green-500/20 text-green-400">
                                {formatDistanceToNow(new Date(contact.createdAt), { 
                                  addSuffix: true,
                                  locale: ptBR 
                                })}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              {/* Tab de Projetos */}
              <TabsContent value="projects">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-green-400">Gerenciamento de Projetos</h2>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => adminData.projects.refetch()}
                      className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                    >
                      <FiRefreshCw className="mr-2" />
                      Atualizar
                    </Button>
                    <Button 
                      variant="default" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        setCurrentProject(undefined);
                        setIsEditFormOpen(true);
                      }}
                    >
                      <FiPlus className="mr-2" />
                      Novo Projeto
                    </Button>
                  </div>
                </div>

                {adminData.projects.isLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, index) => (
                      <Skeleton key={index} className="h-12 w-full bg-gray-800" />
                    ))}
                  </div>
                ) : adminData.projects.error ? (
                  <div className="rounded-md bg-red-500/20 p-4 text-center text-red-200">
                    <p>Ocorreu um erro ao carregar os projetos.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => adminData.projects.refetch()}
                      className="mt-2 border-red-400 text-red-400 hover:bg-red-500/10"
                    >
                      Tentar novamente
                    </Button>
                  </div>
                ) : !adminData.projects.data || adminData.projects.data.length === 0 ? (
                  <div className="rounded-md bg-gray-800 p-8 text-center text-gray-400">
                    <p className="text-lg">Nenhum projeto cadastrado ainda.</p>
                    <p className="mt-2 text-sm">Clique em "Novo Projeto" para adicionar o seu primeiro projeto.</p>
                  </div>
                ) : (
                  <div className="rounded-md border border-green-500/20">
                    <Table>
                      <TableCaption>Lista de projetos cadastrados</TableCaption>
                      <TableHeader className="bg-green-500/10">
                        <TableRow>
                          <TableHead className="w-[60px] text-green-400">#ID</TableHead>
                          <TableHead className="text-green-400"><FiGrid className="mr-1 inline" /> Título</TableHead>
                          <TableHead className="text-green-400"><FiTag className="mr-1 inline" /> Categoria</TableHead>
                          <TableHead className="w-[100px] text-green-400"><FiImage className="mr-1 inline" /> Imagem</TableHead>
                          <TableHead className="text-green-400 text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminData.projects.data.map((project: Project) => (
                          <TableRow 
                            key={project.id}
                            className="border-b border-green-500/10 hover:bg-green-500/5"
                          >
                            <TableCell className="font-mono text-gray-400">#{project.id}</TableCell>
                            <TableCell className="font-medium text-white">
                              <div className="flex flex-col">
                                <span>{project.title}</span>
                                <span className="text-xs text-gray-400">{project.slug}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-500/20 text-green-400 border-none">
                                {project.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {project.image && (
                                <div className="relative h-10 w-16 overflow-hidden rounded border border-green-500/20">
                                  <img 
                                    src={project.image} 
                                    alt={project.title} 
                                    className="absolute inset-0 h-full w-full object-cover"
                                  />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 w-8 p-0 text-green-400"
                                  onClick={() => {
                                    window.open(`/projects/${project.slug}`, "_blank");
                                  }}
                                >
                                  <FiEye size={16} />
                                  <span className="sr-only">Ver</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 w-8 p-0 text-blue-400"
                                  onClick={() => {
                                    setCurrentProject(project);
                                    setIsEditFormOpen(true);
                                  }}
                                >
                                  <FiEdit2 size={16} />
                                  <span className="sr-only">Editar</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-400"
                                  onClick={() => {
                                    setProjectToDelete(project);
                                    setIsDeleteAlertOpen(true);
                                  }}
                                >
                                  <FiTrash2 size={16} />
                                  <span className="sr-only">Excluir</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t border-green-500/20 bg-black/50 text-center text-gray-400">
            <p className="w-full">Área Administrativa do Portfólio - {new Date().getFullYear()}</p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Modal de edição de projeto */}
      <ProjectEditForm 
        project={currentProject}
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
      />
      
      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="bg-gray-900 border-red-500/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400 flex items-center gap-2">
              <FiAlertTriangle /> Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja excluir o projeto{" "}
              <span className="font-semibold text-white">
                {projectToDelete?.title}
              </span>
              ? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              onClick={() => {
                if (!projectToDelete?.id) return;
                
                // Usar a função de exclusão do nosso hook
                adminData.deleteProject(projectToDelete.id);
                setProjectToDelete(undefined);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}