import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

export default function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "João Silva",
      role: "CEO",
      company: "Empresa Digital",
      content: "Trabalhar com esse desenvolvedor foi uma experiência incrível! Ele entregou nosso sistema de e-commerce no prazo e com todos os recursos que precisávamos. Nossa equipe ficou impressionada com a qualidade do código e a facilidade de manutenção.",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 2,
      name: "Maria Oliveira",
      role: "Diretora de Marketing",
      company: "Agência Criativa",
      content: "O redesign do nosso site aumentou significativamente nossas conversões. A abordagem focada em UX e performance fez toda a diferença. Certamente trabalharemos juntos em projetos futuros!",
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 3,
      name: "Carlos Santos",
      role: "CTO",
      company: "TechInova",
      content: "Nossa plataforma SaaS precisava de uma reformulação completa do backend, e o resultado superou todas as expectativas. A arquitetura implementada é robusta, escalável e fácil de manter.",
      image: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      id: 4,
      name: "Ana Costa",
      role: "Fundadora",
      company: "Startup Connect",
      content: "Tivemos um prazo apertado para lançar nosso MVP, e conseguimos entregar graças à dedicação e conhecimento técnico deste desenvolvedor. A aplicação é estável e os usuários adoram a experiência!",
      image: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
      id: 5,
      name: "Roberto Almeida",
      role: "Gerente de Projetos",
      company: "Soluções Digitais",
      content: "A implementação do nosso sistema de gestão interna foi um sucesso. O processo de desenvolvimento foi transparente, com comunicação clara e entregas consistentes a cada sprint.",
      image: "https://randomuser.me/api/portraits/men/5.jpg"
    }
  ];

  return (
    <section className="py-20 bg-black/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Depoimentos</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Confira o que meus clientes e parceiros têm a dizer sobre meu trabalho e nossa colaboração em projetos anteriores.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/1 lg:basis-1/1">
                  <Card className="bg-gray-800/60 border-gray-700 h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center mb-6">
                        <Avatar className="h-14 w-14 border-2 border-primary">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <h4 className="text-xl font-semibold text-white">{testimonial.name}</h4>
                          <p className="text-gray-400">{testimonial.role}, {testimonial.company}</p>
                        </div>
                      </div>
                      
                      <blockquote className="text-gray-300 italic relative flex-grow">
                        <span className="text-5xl text-primary/30 absolute top-0 left-0 -mt-6 -ml-3">"</span>
                        <p className="pl-6 text-lg">{testimonial.content}</p>
                        <span className="text-5xl text-primary/30 absolute bottom-0 right-0 -mb-10 -mr-3">"</span>
                      </blockquote>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-4">
              <CarouselPrevious className="static bg-primary/10 hover:bg-primary/20 border-primary/50 text-primary" />
              <CarouselNext className="static bg-primary/10 hover:bg-primary/20 border-primary/50 text-primary" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}