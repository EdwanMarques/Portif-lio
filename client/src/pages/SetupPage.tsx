import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MdInfo } from "react-icons/md";

const setupSchema = z.object({
  username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "Confirmação de senha deve ter pelo menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type SetupFormValues = z.infer<typeof setupSchema>;

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [_, setLocation] = useLocation();
  const [setupComplete, setSetupComplete] = useState(false);
  const { toast } = useToast();

  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: SetupFormValues) {
    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = data;
      
      const response = await apiRequest("/api/auth/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        toast({
          title: "Configuração concluída",
          description: "Usuário administrador criado com sucesso!",
        });
        setSetupComplete(true);
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Erro na configuração",
          description: errorData.message || "Falha ao criar usuário administrador.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na configuração",
        description: "Ocorreu um erro ao configurar. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (setupComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black/95 p-4">
        <Card className="w-full max-w-md border-green-500/20 bg-black text-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-green-500">
              Configuração Concluída
            </CardTitle>
            <CardDescription className="text-gray-400">
              Seu usuário administrador foi criado com sucesso!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="border-green-500/30 bg-green-500/10 text-green-200">
              <MdInfo className="h-5 w-5" />
              <AlertTitle>Sucesso!</AlertTitle>
              <AlertDescription>
                Agora você pode fazer login na área administrativa com o usuário que acabou de criar.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button 
              variant="default" 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setLocation("/login")}
            >
              Ir para Login
            </Button>
            <Button 
              variant="outline" 
              className="border-green-500/20 text-green-400 hover:bg-green-500/10"
              onClick={() => setLocation("/")}
            >
              Voltar ao Portfólio
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black/95 p-4">
      <Card className="w-full max-w-md border-green-500/20 bg-black text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-green-500">
            Primeira Configuração
          </CardTitle>
          <CardDescription className="text-gray-400">
            Crie um usuário administrador para gerenciar seu portfólio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-200">
            <MdInfo className="h-5 w-5" />
            <AlertTitle>Configuração inicial</AlertTitle>
            <AlertDescription>
              Esta é uma página de uso único para criar o primeiro usuário administrador. 
              Após a criação, ela não estará mais disponível.
            </AlertDescription>
          </Alert>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Nome de Usuário</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite um nome de usuário" 
                        className="border-green-500/20 bg-gray-900 text-white focus-visible:ring-green-500" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Senha</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Digite uma senha segura" 
                        className="border-green-500/20 bg-gray-900 text-white focus-visible:ring-green-500" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Confirme sua senha" 
                        className="border-green-500/20 bg-gray-900 text-white focus-visible:ring-green-500" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? "Configurando..." : "Criar Usuário Administrador"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            className="text-green-500 hover:text-green-400"
            onClick={() => setLocation("/")}
          >
            Voltar ao Portfólio
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}