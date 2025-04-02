import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@shared/schema";
import { FiArrowLeft, FiExternalLink, FiGithub, FiCode, FiCheckCircle } from "react-icons/fi";

interface ProjectDetailPageProps {
  slug?: string;
}

export default function ProjectDetailPage({ slug: propSlug }: ProjectDetailPageProps) {
  // Use slug from props or from URL params
  const params = useParams();
  const slug = propSlug || params.slug;
  const [_, setLocation] = useLocation();

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: [`/api/projects/${slug}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 max-w-5xl">
        <div className="mb-8">
          <Skeleton className="h-10 w-3/4 max-w-md mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl" />
        </div>
        <Skeleton className="h-[400px] w-full mb-8 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="flex flex-wrap gap-2 mb-6">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="flex flex-wrap gap-2 mb-6">
              <Skeleton className="h-6 w-full rounded-md mb-2" />
              <Skeleton className="h-6 w-full rounded-md mb-2" />
              <Skeleton className="h-6 w-3/4 rounded-md" />
            </div>
            
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Erro ao carregar o projeto
        </h1>
        <p className="text-gray-400 mb-8">
          Não foi possível encontrar o projeto solicitado.
        </p>
        <Button onClick={() => setLocation("/")} variant="outline">
          <FiArrowLeft className="mr-2" /> Voltar para a página inicial
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-16 px-4 max-w-5xl">
        {/* Back button */}
        <Button
          onClick={() => setLocation("/")}
          variant="ghost"
          className="mb-6 text-primary hover:text-primary/80 hover:translate-x-[-5px] transition-all duration-300"
        >
          <FiArrowLeft className="mr-2" /> Voltar para a página inicial
        </Button>

        {/* Project title and subtitle */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Badge className="bg-primary/20 text-primary border-none px-3 py-1">
              <span className="capitalize">{project.category}</span>
            </Badge>
            {project.createdAt && (
              <span className="text-gray-400 text-sm ml-3">
                {new Date(project.createdAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'short'
                })}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{project.title}</h1>
          <p className="text-gray-300 text-lg">{project.description}</p>
        </div>

        {/* Main image */}
        <div className="rounded-lg overflow-hidden mb-12 shadow-xl shadow-primary/10 border border-primary/10">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Content layout with sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Long description */}
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center">
                <span className="w-8 h-[2px] bg-primary mr-3"></span>
                Sobre o Projeto
              </h2>
              <div className="prose text-gray-300 max-w-none">
                <p className="leading-relaxed">{project.longDescription || project.description}</p>
              </div>
            </section>

            {/* Screenshots */}
            {project.screenshots && project.screenshots.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center">
                  <span className="w-8 h-[2px] bg-primary mr-3"></span>
                  Screenshots
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.screenshots.map((screenshot, index) => (
                    <div 
                      key={index} 
                      className="rounded-lg overflow-hidden shadow-md hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-300 border border-primary/10"
                    >
                      <img
                        src={screenshot}
                        alt={`${project.title} screenshot ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Technologies */}
            <div className="mb-8 bg-black/20 p-5 rounded-lg border border-primary/10">
              <h3 className="text-xl font-semibold mb-3 text-primary flex items-center">
                <FiCode className="mr-2" />
                Tecnologias
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="bg-background/80 border-primary/30 text-primary/90 hover:bg-primary/20 hover:text-primary transition-all duration-300"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div className="mb-8 bg-black/20 p-5 rounded-lg border border-primary/10">
                <h3 className="text-xl font-semibold mb-3 text-primary flex items-center">
                  <FiCheckCircle className="mr-2" />
                  Recursos
                </h3>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2"></span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Links */}
            <div className="space-y-3 bg-black/20 p-5 rounded-lg border border-primary/10">
              <h3 className="text-xl font-semibold mb-3 text-primary">Links</h3>
              {project.demoUrl && (
                <Button
                  variant="default"
                  className="w-full justify-between group hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                  onClick={() => {
                    if (project.demoUrl) {
                      window.open(project.demoUrl, "_blank")
                    }
                  }}
                >
                  <span>Ver Demonstração</span>
                  <FiExternalLink className="group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              )}
              
              {project.repoUrl && (
                <Button
                  variant="outline"
                  className="w-full justify-between group hover:bg-background/80 transition-all duration-300 mt-3"
                  onClick={() => {
                    if (project.repoUrl) {
                      window.open(project.repoUrl, "_blank")
                    }
                  }}
                >
                  <span>Código Fonte</span>
                  <FiGithub className="group-hover:rotate-12 transition-transform duration-300" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}