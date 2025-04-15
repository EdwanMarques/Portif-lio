import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ContactSection() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !subject || !message) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos."
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, subject, message })
      });
      
      if (response.ok) {
        toast({
          title: "Mensagem enviada",
          description: "Obrigado por entrar em contato! Responderei em breve."
        });
        // Limpar o formulário
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Erro ao enviar mensagem",
          description: errorData.message || "Ocorreu um erro ao enviar sua mensagem."
        });
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            Entre em <span className="text-primary">Contato</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Interessado em trabalhar juntos? Preencha o formulário abaixo e entrarei em contato o mais breve possível.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Card className="bg-secondary border-0 rounded-lg shadow-xl relative z-10">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-400 mb-2">Nome</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      className="w-full rounded-md border border-gray-700 bg-background px-3 py-2 text-white focus:border-primary focus:outline-none"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full rounded-md border border-gray-700 bg-background px-3 py-2 text-white focus:border-primary focus:outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-gray-400 mb-2">Assunto</label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Assunto da mensagem"
                    className="w-full rounded-md border border-gray-700 bg-background px-3 py-2 text-white focus:border-primary focus:outline-none"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-400 mb-2">Mensagem</label>
                  <textarea
                    id="message"
                    placeholder="Sua mensagem..."
                    className="w-full rounded-md border border-gray-700 bg-background px-3 py-2 text-white focus:border-primary focus:outline-none resize-none"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-white" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold font-poppins mb-6">Informações de Contato</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary p-3 rounded-md text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Email</h4>
                    <p className="text-gray-400">Edwanmarkkz@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary p-3 rounded-md text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Telefone</h4>
                    <p className="text-gray-400">(61) 98250-8575</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-secondary p-3 rounded-md text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Localização</h4>
                    <p className="text-gray-400">Brasília, DF</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <h3 className="text-xl font-bold font-poppins mb-6">Disponibilidade</h3>
              <div className="bg-secondary p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300">Status:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Disponível para projetos
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Atualmente estou disponível para trabalhos freelance e projetos de longo prazo. Entre em contato para discutirmos como posso ajudar no seu próximo projeto.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}