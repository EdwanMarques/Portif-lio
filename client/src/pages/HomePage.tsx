import { useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  // Refs for scrolling to sections
  const heroRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        sections={{
          hero: heroRef,
          projects: projectsRef,
          skills: skillsRef,
          testimonials: testimonialsRef,
          about: aboutRef,
          contact: contactRef
        }}
      />
      
      <main className="flex-grow">
        <div ref={heroRef} id="hero">
          <HeroSection />
        </div>
        
        <div ref={projectsRef} id="projects">
          <ProjectsSection />
        </div>
        
        <div ref={skillsRef} id="skills">
          <SkillsSection />
        </div>
        
        <div ref={testimonialsRef} id="testimonials">
          <TestimonialsSection />
        </div>
        
        <div ref={aboutRef} id="about">
          <AboutSection />
        </div>
        
        <div ref={contactRef} id="contact">
          <ContactSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
