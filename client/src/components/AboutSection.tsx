import { FaGithub, FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { Image } from '@/components/ui/image';
import { useState } from 'react';

export default function AboutSection() {
  const [imageLoading, setImageLoading] = useState(true);
  
  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/EdwanMarques", label: "Github" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/edwan-marques-980248360/", label: "LinkedIn" },
    { icon: FaTwitter, href: "https://x.com/EdwanMarks", label: "Twitter" },
    { icon: FaWhatsapp, href: "https://wa.me/5561982508575", label: "WhatsApp" },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative mx-auto max-w-sm lg:max-w-md">
              <div className="bg-primary absolute -inset-4 rounded-tl-3xl rounded-br-3xl opacity-20 blur-lg"></div>
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              )}
              <Image 
                src="/images/profile.jpg" 
                alt="Desenvolvedor" 
                className={cn(
                  "relative z-10 w-full h-auto rounded-lg shadow-2xl",
                  imageLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={() => setImageLoading(false)}
                fallback="/images/profile-placeholder.jpg"
              />
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-poppins mb-4 sm:mb-6">
              Sobre <span className="text-primary">Mim</span>
            </h2>
            
            <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl animate-fade-in-down leading-relaxed">
              Sou Edwan Marques, desenvolvedor fullstack e entusiasta de tecnologia, com uma trajetória marcada pela busca constante de inovação e excelência. Minha atuação abrange desde o <b>front-end</b> — criando interfaces modernas e responsivas com <b>React, Vue.js, Angular, Next.js, TailwindCSS</b> e outras — até o <b>back-end</b>, onde desenvolvo APIs robustas e escaláveis utilizando <b>Node.js, Express, Python, Django, FastAPI, PHP, Laravel</b> e <b>GraphQL</b>.<br /><br />
              Tenho sólida experiência em <b>DevOps</b> e infraestrutura, trabalhando com bancos de dados como <b>MongoDB, PostgreSQL, MySQL, Redis</b>, além de automação de deploys, containers e orquestração com <b>Docker, Kubernetes</b> e soluções em nuvem como <b>AWS, Google Cloud, Azure</b> e <b>Serverless</b>.<br /><br />
              Minha paixão por dados me levou a atuar fortemente em <b>análise de dados</b> e <b>inteligência artificial</b>, utilizando <b>Python, Pandas, NumPy, SQL, Power BI, Tableau, R</b> para extração de insights, e frameworks como <b>TensorFlow, PyTorch, Scikit-learn, Transformers, LangChain, HuggingFace</b> e <b>OpenAI API</b> para criar soluções de machine learning e deep learning.<br /><br />
              Também exploro o universo de <b>IoT</b> e computação embarcada, desenvolvendo projetos com <b>MQTT, Edge Computing, ESP32, Raspberry Pi</b> e integrando dispositivos inteligentes à nuvem.<br /><br />
              O que me move é a possibilidade de unir todas essas áreas para criar soluções completas, inovadoras e de alto impacto — seja desenvolvendo produtos digitais do zero, otimizando sistemas existentes ou explorando novas fronteiras tecnológicas.<br /><br />
              Se você busca alguém com visão sistêmica, capacidade de execução multidisciplinar e paixão por aprender e inovar, vamos conversar!
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="text-primary font-semibold mb-2 text-sm sm:text-base">Experiência</h4>
                <ul className="space-y-1 text-gray-400 text-sm">
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    5+ anos em Desenvolvimento Web
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    3+ anos com React & Node.js
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    2+ anos com arquiteturas em nuvem
                  </li>
                </ul>
              </div>
              <div className="bg-background/50 p-4 rounded-lg">
                <h4 className="text-primary font-semibold mb-2 text-sm sm:text-base">Educação</h4>
                <ul className="space-y-1 text-gray-400 text-sm">
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Tecnólogo em Análise e Desenvolvimento de Sistemas
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Especialização em Desenvolvimento Web
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-2">•</span>
                    Certificações em AWS & Azure
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <a 
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-background/50 p-2 sm:p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-110"
                    aria-label={link.label}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
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
