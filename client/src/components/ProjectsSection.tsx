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

  const filterButtons = [
    { id: "all", label: "Todos" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "fullstack", label: "Fullstack" },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-poppins mb-3 sm:mb-4">
            Meus <span className="text-primary">Projetos</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Uma seleção dos meus trabalhos mais recentes, demonstrando minhas habilidades com diversas tecnologias.
          </p>
          
          {/* Filter Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2">
            {filterButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => setActiveFilter(button.id)}
                className={cn(
                  "px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105",
                  activeFilter === button.id
                    ? "bg-primary text-white shadow-lg"
                    : "border border-primary text-primary hover:bg-primary/10"
                )}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card 
                key={index}
                className="rounded-lg overflow-hidden bg-background/50 shadow-lg border-0 backdrop-blur-sm"
              >
                <div className="h-48 sm:h-56">
                  <Skeleton className="h-full w-full" />
                </div>
                
                <CardContent className="p-4 sm:p-6">
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
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center p-8">
              <p className="text-red-500 text-sm sm:text-base">Erro ao carregar projetos. Por favor, tente novamente mais tarde.</p>
            </div>
          ) : projects && projects.length > 0 ? (
            // Projects list
            projects.filter(filterProjects).map((project: Project) => (
              <Link key={project.id} href={`/projects/${project.slug}`} className="block transform transition-transform duration-300 hover:scale-[1.02]">
                <Card 
                  className="project-card group rounded-lg overflow-hidden bg-background/50 shadow-lg border-0 backdrop-blur-sm h-full"
                >
                  <div className="relative overflow-hidden h-48 sm:h-56">
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-6">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h4 className="text-white font-semibold text-base sm:text-lg">Ver Detalhes</h4>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 font-poppins group-hover:text-primary transition-colors duration-300 line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <p className="text-primary text-xs mb-3 flex items-center">
                      <span className="mr-1">Categoria:</span> 
                      <span className="capitalize">{project.category}</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {project.technologies.map((tech: string, index: number) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-[10px] sm:text-xs bg-background/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-primary backdrop-blur-sm"
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
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center p-8">
              <p className="text-gray-400 text-sm sm:text-base">Nenhum projeto encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
