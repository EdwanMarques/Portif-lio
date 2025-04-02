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

const loginSchema = z.object({
  username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo à área de administração",
        });
        setLocation("/admin");
      } else {
        const errorData = await response.json();
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: errorData.message || "Falha na autenticação. Tente novamente.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black/95 p-4">
      <Card className="w-full max-w-md border-green-500/20 bg-black text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-green-500">
            Admin Login
          </CardTitle>
          <CardDescription className="text-gray-400">
            Faça login para acessar a área de administração
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                        placeholder="Digite seu nome de usuário" 
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
                        placeholder="Digite sua senha" 
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
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center space-x-2">
          <Button 
            variant="link" 
            className="text-green-500 hover:text-green-400"
            onClick={() => setLocation("/")}
          >
            Voltar ao Portfólio
          </Button>
          <Button 
            variant="link" 
            className="text-green-500 hover:text-green-400"
            onClick={() => setLocation("/setup")}
          >
            Configuração Inicial
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}