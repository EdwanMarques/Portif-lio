import { FaGithub, FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { cn } from '@/lib/utils';

export default function AboutSection() {
  const socialLinks = [
    { icon: FaGithub, href: "https://github.com", label: "Github" },
    { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
    { icon: FaWhatsapp, href: "https://whatsapp.com", label: "WhatsApp" },
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="relative">
              <div className="bg-primary absolute -inset-4 rounded-tl-3xl rounded-br-3xl opacity-20 blur-lg"></div>
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=700&q=80" 
                alt="Desenvolvedor" 
                className="relative z-10 w-full h-auto max-w-md mx-auto rounded-lg shadow-2xl" 
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
              Sobre <span className="text-primary">Mim</span>
            </h2>
            
            <p className="text-gray-300 mb-6">
              Sou um desenvolvedor fullstack apaixonado por criar soluções web inovadoras e de alta qualidade. Com mais de 5 anos de experiência no desenvolvimento de aplicações web modernas, combinando front-end elegante com back-end robusto.
            </p>
            
            <p className="text-gray-300 mb-8">
              Minha jornada na programação começou durante a faculdade, onde descobri minha paixão por resolver problemas complexos através do código. Hoje, meu objetivo é continuar a aprendizagem constante e criar produtos que realmente façam diferença para os usuários.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <h4 className="text-primary font-semibold mb-2">Experiência</h4>
                <ul className="space-y-1 text-gray-400">
                  <li>• 5+ anos em desenvolvimento web</li>
                  <li>• 3+ anos com React & Node.js</li>
                  <li>• 2+ anos com arquiteturas em nuvem</li>
                </ul>
              </div>
              <div>
                <h4 className="text-primary font-semibold mb-2">Educação</h4>
                <ul className="space-y-1 text-gray-400">
                  <li>• Bacharel em Ciência da Computação</li>
                  <li>• Especialização em Desenvolvimento Web</li>
                  <li>• Certificações em AWS & Azure</li>
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <a 
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-background p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors duration-300"
                    aria-label={link.label}
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
