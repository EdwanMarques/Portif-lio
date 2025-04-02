import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import ParticlesBackground from "@/components/ui/particles";

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      <ParticlesBackground />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <p className="text-primary mb-2 font-medium animate-fade-in-down">Olá meu nome é Edwan e eu sou</p>
          <h1 className="text-4xl md:text-6xl font-bold font-poppins mb-4 animate-fade-in-down">
            <span className="text-white">Desenvolvedor </span>
            <span className="text-primary typing-container">
              <span className="typing-text">Fullstack.</span>
            </span>
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl animate-fade-in-down">
            Construo aplicações web modernas, responsivas e de alto desempenho utilizando as mais recentes tecnologias do mercado.
          </p>
          
          <div className="flex flex-wrap gap-4 animate-fade-in-up">
            <Button 
              onClick={() => scrollToSection("projects")}
              className="bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300 flex items-center"
            >
              Ver Projetos
              <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              onClick={() => scrollToSection("contact")}
              variant="outline" 
              className="border border-primary text-primary hover:bg-primary/10 font-semibold py-3 px-6 rounded-md transition-all duration-300"
            >
              Entre em Contato
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
