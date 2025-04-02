import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@shared/schema";
import { FiX, FiSave, FiPlus } from "react-icons/fi";
import { useAdminData } from "@/hooks/use-admin-data";

// Interface para as props do componente
interface ProjectEditFormProps {
  project?: Project; // Projeto a ser editado (se existir)
  isOpen: boolean;
  onClose: () => void;
}

// Array de categorias disponíveis
const CATEGORIES = ["frontend", "backend", "fullstack", "mobile", "data", "outros"];

export default function ProjectEditForm({ project, isOpen, onClose }: ProjectEditFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const adminData = useAdminData();
  
  // Estado para os campos do formulário
  const [formData, setFormData] = useState<Partial<Project>>(
    project ? { ...project } : {
      title: "",
      slug: "",
      description: "",
      longDescription: "",
      image: "/images/placeholder-project.jpg",
      demoUrl: "",
      repoUrl: "",
      category: "fullstack",
      technologies: [],
      features: [],
      screenshots: []
    }
  );
  
  // Estado para os campos de array
  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [screenshotInput, setScreenshotInput] = useState("");
  
  // Função para lidar com a mudança nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Função para gerar o slug automaticamente a partir do título
  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      
      setFormData(prev => ({ ...prev, slug }));
    }
  };
  
  // Funções para adicionar itens aos arrays
  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies?.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), techInput.trim()]
      }));
      setTechInput("");
    }
  };
  
  const addFeature = () => {
    if (featureInput.trim() && !formData.features?.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };
  
  const addScreenshot = () => {
    if (screenshotInput.trim() && !formData.screenshots?.includes(screenshotInput.trim())) {
      setFormData(prev => ({
        ...prev,
        screenshots: [...(prev.screenshots || []), screenshotInput.trim()]
      }));
      setScreenshotInput("");
    }
  };
  
  // Funções para remover itens dos arrays
  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.filter(t => t !== tech) || []
    }));
  };
  
  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter(f => f !== feature) || []
    }));
  };
  
  const removeScreenshot = (screenshot: string) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots?.filter(s => s !== screenshot) || []
    }));
  };
  
  // Função para enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Verificar campos obrigatórios
      if (!formData.title || !formData.slug || !formData.description || !formData.image || !formData.category) {
        toast({
          variant: "destructive",
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios."
        });
        setIsSubmitting(false);
        return;
      }
      
      // Verificar se há pelo menos uma tecnologia
      if (!formData.technologies || formData.technologies.length === 0) {
        toast({
          variant: "destructive",
          title: "Tecnologias",
          description: "Adicione pelo menos uma tecnologia."
        });
        setIsSubmitting(false);
        return;
      }
      
      // Usar o hook para criar ou atualizar o projeto
      if (project && project.id) {
        // Atualização
        adminData.updateProject({
          id: project.id,
          projectData: formData
        });
      } else {
        // Criação
        adminData.createProject(formData);
      }
      
      toast({
        title: "Projeto salvo!",
        description: project ? "Projeto atualizado com sucesso." : "Novo projeto criado com sucesso."
      });
      
      // Fechar o modal e resetar o formulário
      onClose();
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao salvar o projeto."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-green-500/20 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-green-400">
            {project ? "Editar Projeto" : "Novo Projeto"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {project ? "Atualize as informações do projeto" : "Preencha os detalhes do novo projeto"}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Informações básicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-green-400 uppercase tracking-wider">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  onBlur={generateSlug}
                  className="bg-gray-800 border-gray-700"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <div className="flex">
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug || ""}
                    onChange={handleChange}
                    className="bg-gray-800 border-gray-700"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição Curta *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700 resize-none h-20"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="longDescription">Descrição Detalhada</Label>
              <Textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription || ""}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700 min-h-32"
              />
            </div>
          </div>
          
          {/* Categoria e Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-green-400 uppercase tracking-wider">Categoria e Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category || ""}
                  onChange={handleChange}
                  className="w-full rounded-md bg-gray-800 border border-gray-700 py-2 px-3 text-sm"
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="demoUrl">URL do Demo</Label>
                <Input
                  id="demoUrl"
                  name="demoUrl"
                  value={formData.demoUrl || ""}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700"
                  placeholder="https://..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="repoUrl">URL do Repositório</Label>
                <Input
                  id="repoUrl"
                  name="repoUrl"
                  value={formData.repoUrl || ""}
                  onChange={handleChange}
                  className="bg-gray-800 border-gray-700"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </div>
          
          {/* Imagens */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-green-400 uppercase tracking-wider">Imagens</h3>
            
            <div className="space-y-2">
              <Label htmlFor="image">Imagem Principal *</Label>
              <Input
                id="image"
                name="image"
                value={formData.image || ""}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700"
                placeholder="/images/projects/..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Screenshots</Label>
              <div className="flex gap-2">
                <Input
                  value={screenshotInput}
                  onChange={(e) => setScreenshotInput(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  placeholder="/images/screenshots/..."
                />
                <Button 
                  type="button" 
                  onClick={addScreenshot} 
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FiPlus />
                </Button>
              </div>
              
              {/* Lista de screenshots */}
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.screenshots?.map((screenshot, index) => (
                  <div key={index} className="bg-gray-800 rounded-md px-3 py-1 flex items-center gap-2">
                    <span className="text-sm truncate max-w-[150px]">{screenshot}</span>
                    <button 
                      type="button" 
                      onClick={() => removeScreenshot(screenshot)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Tecnologias e Funcionalidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-green-400 uppercase tracking-wider">Tecnologias *</h3>
              
              <div className="flex gap-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  placeholder="Adicionar tecnologia..."
                />
                <Button 
                  type="button" 
                  onClick={addTechnology} 
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FiPlus />
                </Button>
              </div>
              
              {/* Lista de tecnologias */}
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.technologies?.map((tech, index) => (
                  <div key={index} className="bg-gray-800 rounded-md px-3 py-1 flex items-center gap-2">
                    <span className="text-sm">{tech}</span>
                    <button 
                      type="button" 
                      onClick={() => removeTechnology(tech)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-green-400 uppercase tracking-wider">Funcionalidades</h3>
              
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                  placeholder="Adicionar funcionalidade..."
                />
                <Button 
                  type="button" 
                  onClick={addFeature} 
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FiPlus />
                </Button>
              </div>
              
              {/* Lista de funcionalidades */}
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.features?.map((feature, index) => (
                  <div key={index} className="bg-gray-800 rounded-md px-3 py-1 flex items-center gap-2">
                    <span className="text-sm truncate max-w-[200px]">{feature}</span>
                    <button 
                      type="button" 
                      onClick={() => removeFeature(feature)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
        
        <DialogFooter className="border-t border-gray-800 pt-4">
          <DialogClose asChild>
            <Button 
              type="button" 
              variant="outline" 
              className="border-gray-700 text-gray-300"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            <FiSave className="mr-2" />
            {isSubmitting ? "Salvando..." : "Salvar Projeto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}