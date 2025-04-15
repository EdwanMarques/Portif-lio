import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import ParticlesBackground from "@/components/ui/particles";
import TypingText from "@/components/ui/typing-text";

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const roles = [
    "Fullstack",
    "Frontend",
    "Backend",
    "DevOps",
    "Analista de Dados",
    "UI/UX Designer",
    "Especialista em IA",
    "Engenheiro de Cibersegurança",
    "Arquiteto Cloud",
    "Cientista de Dados",
    "Engenheiro de Robótica",
    "Especialista em IoT",
    "Especialista em Bioinformática",
    "Especialista em Computação Quântica",
    "Especialista em VR/AR",
    "Especialista em Computação Espacial",
    "Especialista em Computação Sustentável",
    "Especialista em Computação Vestível",
    "Especialista em Aprimoramento Neurológico",
    "Especialista em IA Agêntica"
  ];
  

  return (
    <section className="min-h-[90vh] sm:min-h-screen flex items-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/80" />
      <ParticlesBackground />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto lg:mx-0">
          <p className="text-primary text-sm sm:text-base mb-2 sm:mb-3 font-medium animate-fade-in-down">
            Prazer, sou Edwan Marques — apaixonado por tecnologia e inovação.
          </p>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-poppins mb-4 sm:mb-6 animate-fade-in-down leading-tight">
            <span className="text-white">
              Atuo como
              <span className="block"> </span>
            </span>
            <span className="text-primary">
              <TypingText words={roles} className="typing-container" />
            </span>
          </h1>
          
          <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl animate-fade-in-down leading-relaxed">
            Transformo ideias em experiências digitais imersivas, desenvolvendo soluções completas em <b>front-end</b>, <b>back-end</b>, <b>DevOps</b>, <b>análise de dados</b>, <b>inteligência artificial</b> e <b>IoT</b>. Utilizo tecnologias como <b>React, Next.js, Node.js, Python, Docker, AWS, TensorFlow</b> e muito mais para criar aplicações modernas, escaláveis e de alto desempenho. Minha missão é entregar interfaces fluidas, código limpo e inovação de ponta a ponta.
          </p>
          
          <div className="flex flex-wrap gap-3 sm:gap-4 animate-fade-in-up">
            <Button 
              onClick={() => scrollToSection("projects")}
              className="bg-primary hover:bg-primary/80 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md transition-all duration-300 flex items-center transform hover:scale-105"
            >
              Ver Projetos
              <ChevronDown className="ml-2 h-4 w-4 sm:h-5 sm:w-5 animate-bounce" />
            </Button>
            
            <Button 
              onClick={() => scrollToSection("contact")}
              variant="outline" 
              className="border-2 border-primary text-primary hover:bg-primary/10 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-md transition-all duration-300 transform hover:scale-105"
            >
              Entre em Contato
            </Button>
          </div>
        </div>
      </div>
      
      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
        <ChevronDown className="h-6 w-6 text-primary" />
      </div>
    </section>
  );
}
