import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const contactFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome precisa ter no mínimo 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  subject: z.string().min(5, { message: 'Assunto precisa ter no mínimo 5 caracteres' }),
  message: z.string().min(10, { message: 'Mensagem precisa ter no mínimo 10 caracteres' })
});

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormValues>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    try {
      contactFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log("Formulário enviado:", formData);
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast({
          title: "Mensagem enviada",
          description: "Obrigado por entrar em contato! Responderei em breve."
        });
        // Limpar o formulário
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-gray-400 mb-2">Nome</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Seu nome"
            className="w-full rounded-md border border-gray-700 bg-background px-3 py-2 text-white focus:border-primary focus:outline-none"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            className="w-full rounded-md border border-gray-700 bg-background px-3 py-2 text-white focus:border-primary focus:outline-none"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-gray-400 mb-2">Assunto</label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="Assunto da mensagem"
          className="w-full rounded-md border border-gray-700 bg-background px-3 py-2 text-white focus:border-primary focus:outline-none"
          value={formData.subject}
          onChange={handleChange}
        />
        {errors.subject && (
          <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="message" className="block text-gray-400 mb-2">Mensagem</label>
        <textarea
          id="message"
          name="message"
          placeholder="Sua mensagem..."
          className="w-full rounded-md border border-gray-700 bg-background px-3 py-2 text-white focus:border-primary focus:outline-none resize-none"
          rows={5}
          value={formData.message}
          onChange={handleChange}
        />
        {errors.message && (
          <p className="text-red-500 text-sm mt-1">{errors.message}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-white" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
      </Button>
    </form>
  );
}