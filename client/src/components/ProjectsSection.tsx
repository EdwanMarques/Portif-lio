import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Project } from "@shared/schema";
import { Link } from "wouter";

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Fetch projects from API
  const { data: projects = [], isLoading, error } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const filterProjects = (project: Project) => {
    if (activeFilter === "all") return true;
    return project.category === activeFilter;
  };

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            Meus <span className="text-primary">Projetos</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Uma seleção dos meus trabalhos mais recentes, demonstrando minhas habilidades com diversas tecnologias.
          </p>
          
          {/* Filter Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
                activeFilter === "all"
                  ? "bg-primary text-white"
                  : "border border-primary text-primary hover:bg-primary/10"
              )}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter("frontend")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
                activeFilter === "frontend"
                  ? "bg-primary text-white"
                  : "border border-primary text-primary hover:bg-primary/10"
              )}
            >
              Frontend
            </button>
            <button
              onClick={() => setActiveFilter("backend")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
                activeFilter === "backend"
                  ? "bg-primary text-white"
                  : "border border-primary text-primary hover:bg-primary/10"
              )}
            >
              Backend
            </button>
            <button
              onClick={() => setActiveFilter("fullstack")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
                activeFilter === "fullstack"
                  ? "bg-primary text-white"
                  : "border border-primary text-primary hover:bg-primary/10"
              )}
            >
              Fullstack
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card 
                key={index}
                className="rounded-lg overflow-hidden bg-background shadow-lg border-0"
              >
                <div className="h-56">
                  <Skeleton className="h-full w-full" />
                </div>
                
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16 rounded" />
                    <Skeleton className="h-5 w-16 rounded" />
                    <Skeleton className="h-5 w-16 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center p-8">
              <p className="text-red-500">Erro ao carregar projetos. Por favor, tente novamente mais tarde.</p>
            </div>
          ) : projects && projects.length > 0 ? (
            // Projects list
            projects.filter(filterProjects).map((project: Project) => (
              <Link key={project.id} href={`/projects/${project.slug}`} className="block">
                <Card 
                  className="project-card group rounded-lg overflow-hidden bg-background shadow-lg transition-transform duration-300 hover:-translate-y-2 cursor-pointer border-0 h-full"
                >
                  <div className="relative overflow-hidden h-56">
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div>
                        <h4 className="text-white font-semibold text-lg">Ver Detalhes</h4>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 font-poppins group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-4 text-sm">
                      {project.description}
                    </p>
                    <p className="text-primary text-xs mb-3 flex items-center">
                      <span className="mr-1">Categoria:</span> 
                      <span className="capitalize">{project.category}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech: string, index: number) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs bg-background px-2 py-1 rounded text-primary"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            // No projects found
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center p-8">
              <p className="text-gray-400">Nenhum projeto encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
