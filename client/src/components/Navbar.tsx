import { useState, RefObject } from "react";
import { cn } from "@/lib/utils";

interface SectionRefs {
  hero: RefObject<HTMLDivElement>;
  projects: RefObject<HTMLDivElement>;
  skills: RefObject<HTMLDivElement>;
  testimonials: RefObject<HTMLDivElement>;
  about: RefObject<HTMLDivElement>;
  contact: RefObject<HTMLDivElement>;
}

interface NavbarProps {
  sections: SectionRefs;
}

export default function Navbar({ sections }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (ref: RefObject<HTMLDivElement>) => {
    setMobileMenuOpen(false);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <a 
            onClick={() => scrollToSection(sections.hero)}
            className="text-2xl font-bold font-poppins text-primary cursor-pointer"
          >
            <span className="text-white">&lt;</span>Dev<span className="text-white">/&gt;</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a 
              onClick={() => scrollToSection(sections.hero)}
              className="text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              Início
            </a>
            <a 
              onClick={() => scrollToSection(sections.projects)}
              className="text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              Projetos
            </a>
            <a 
              onClick={() => scrollToSection(sections.skills)}
              className="text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              Habilidades
            </a>
            <a 
              onClick={() => scrollToSection(sections.testimonials)}
              className="text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              Depoimentos
            </a>
            <a 
              onClick={() => scrollToSection(sections.about)}
              className="text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              Sobre
            </a>
            <a 
              onClick={() => scrollToSection(sections.contact)}
              className="text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              Contato
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-300 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden px-2 pt-2 pb-4 space-y-1 sm:px-3",
          mobileMenuOpen ? "block" : "hidden"
        )}>
          <a 
            onClick={() => scrollToSection(sections.hero)}
            className="block px-3 py-2 text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            Início
          </a>
          <a 
            onClick={() => scrollToSection(sections.projects)}
            className="block px-3 py-2 text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            Projetos
          </a>
          <a 
            onClick={() => scrollToSection(sections.skills)}
            className="block px-3 py-2 text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            Habilidades
          </a>
          <a 
            onClick={() => scrollToSection(sections.testimonials)}
            className="block px-3 py-2 text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            Depoimentos
          </a>
          <a 
            onClick={() => scrollToSection(sections.about)}
            className="block px-3 py-2 text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            Sobre
          </a>
          <a 
            onClick={() => scrollToSection(sections.contact)}
            className="block px-3 py-2 text-gray-300 hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            Contato
          </a>
        </div>
      </div>
    </header>
  );
}
