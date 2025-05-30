/**
 * @author EDWAN MARQUES
 * @description Rotas da aplicação
 */

import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertUserSchema, insertProjectSchema, users } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from 'bcryptjs';
import { authLimiter, securityHeaders, handleValidationError } from './middleware/security';
import { Router } from "express";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// Middleware para verificar autenticação
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: "Não autorizado" });
}

// Middleware de autenticação
const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.session || !req.session.userId) {
      res.status(401).json({ 
        message: "Sessão expirada ou inválida. Por favor, faça login novamente.",
        code: "SESSION_EXPIRED"
      });
      return;
    }

    // Verificar se a sessão ainda é válida no banco de dados
    const session = await new Promise((resolve, reject) => {
      req.session.store.get(req.sessionID, (err, session) => {
        if (err) {
          console.error('Erro ao verificar sessão:', err);
          reject(err);
        } else {
          resolve(session);
        }
      });
    });

    if (!session) {
      res.status(401).json({ 
        message: "Sessão não encontrada. Por favor, faça login novamente.",
        code: "SESSION_INVALID"
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(500).json({ 
      message: "Ocorreu um erro ao verificar sua autenticação. Por favor, tente novamente.",
      code: "AUTH_ERROR"
    });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Aplicar headers de segurança em todas as rotas
  app.use(securityHeaders);

  // Endpoint de health check para o Railway
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Rota para criar um usuário administrador (uso único para configuração)
  app.post("/api/auth/setup", async (req: Request, res: Response) => {
    try {
      // Verificar se já existe um usuário admin
      const users = await storage.getUsers();
      if (users.length > 0) {
        return res.status(403).json({ message: "Setup já realizado. Não é possível criar mais usuários admin." });
      }
      
      // Validar dados do usuário
      const userData = insertUserSchema.parse(req.body);
      
      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Criar usuário admin
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      res.status(201).json({
        message: "Usuário administrador criado com sucesso",
        userId: user.id
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });

  // Rota de login com rate limiting e proteções adicionais
  app.post("/api/auth/login", authLimiter, async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          message: "Por favor, forneça usuário e senha.",
          code: "MISSING_CREDENTIALS"
        });
      }

      const user = await validateUser(username, password);
      
      if (!user) {
        return res.status(401).json({ 
          message: "Usuário ou senha incorretos. Por favor, tente novamente.",
          code: "INVALID_CREDENTIALS"
        });
      }

      // Regenerar sessão para prevenir fixação de sessão
      req.session.regenerate((err) => {
        if (err) {
          console.error('Erro ao regenerar sessão:', err);
          return res.status(500).json({ 
            message: "Ocorreu um erro ao iniciar sua sessão. Por favor, tente novamente.",
            code: "SESSION_REGENERATION_ERROR"
          });
        }

        req.session.userId = user.id;
        req.session.save((err) => {
          if (err) {
            console.error('Erro ao salvar sessão:', err);
            return res.status(500).json({ 
              message: "Ocorreu um erro ao salvar sua sessão. Por favor, tente novamente.",
              code: "SESSION_SAVE_ERROR"
            });
          }

          res.status(200).json({ 
            message: "Login realizado com sucesso!",
            user: {
              id: user.id,
              username: user.username
            }
          });
        });
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ 
        message: "Ocorreu um erro ao processar seu login. Por favor, tente novamente.",
        code: "LOGIN_ERROR"
      });
    }
  });

  // Rota para verificar autenticação
  app.get("/api/auth/check", isAuthenticated, (req: Request, res: Response) => {
    res.status(200).json({ message: "Usuário autenticado", userId: req.session.userId });
  });

  // Rota de logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logout realizado com sucesso" });
    });
  });

  // Contact form submission route
  app.post("/api/contact", async (req: Request, res: Response) => {
    console.log("Recebida requisição de contato:", req.body);
    try {
      // Validate request body
      const contactData = insertContactSchema.parse(req.body);
      console.log("Dados validados com sucesso:", contactData);
      
      // Store contact in database storage
      const contact = await storage.createContact(contactData);
      console.log("Contato salvo com sucesso:", contact);
      
      res.status(201).json({
        message: "Mensagem enviada com sucesso!",
        contact
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.error("Erro de validação:", validationError.message);
        res.status(400).json({ 
          message: "Erro de validação", 
          errors: validationError.message 
        });
      } else {
        console.error("Erro ao processar o contato:", error);
        res.status(500).json({ 
          message: "Erro ao processar seu pedido"
        });
      }
    }
  });

  // Get all contacts (for admin purposes) - protegido por autenticação
  app.get("/api/contacts", isAuthenticated, async (_req: Request, res: Response) => {
    try {
      const contacts = await storage.getContacts();
      res.status(200).json(contacts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "Erro ao buscar mensagens de contato"
      });
    }
  });

  // ----------- Rotas de Projetos -----------

  // Get all projects
  app.get("/api/projects", async (_req: Request, res: Response) => {
    try {
      const projects = await storage.getProjects();
      res.status(200).json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar projetos" });
    }
  });

  // Get project by slug
  app.get("/api/projects/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const project = await storage.getProjectBySlug(slug);
      
      if (!project) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }
      
      res.status(200).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar projeto" });
    }
  });

  // Create project (protegido por autenticação)
  app.post("/api/projects", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      
      res.status(201).json({
        message: "Projeto criado com sucesso",
        project
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ 
          message: "Erro de validação", 
          errors: validationError.message 
        });
      } else {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar projeto" });
      }
    }
  });

  // Update project (protegido por autenticação)
  app.patch("/api/projects/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const projectId = parseInt(id);
      
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "ID de projeto inválido" });
      }
      
      const existingProject = await storage.getProjectById(projectId);
      if (!existingProject) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }
      
      // Validar apenas os campos fornecidos para atualização
      const projectUpdate = req.body;
      
      const updatedProject = await storage.updateProject(projectId, projectUpdate);
      
      res.status(200).json({
        message: "Projeto atualizado com sucesso",
        project: updatedProject
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao atualizar projeto" });
    }
  });

  // Delete project (protegido por autenticação)
  app.delete("/api/projects/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const projectId = parseInt(id);
      
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "ID de projeto inválido" });
      }
      
      const success = await storage.deleteProject(projectId);
      
      if (!success) {
        return res.status(404).json({ message: "Projeto não encontrado" });
      }
      
      res.status(200).json({ message: "Projeto excluído com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao excluir projeto" });
    }
  });

  // Rota para criar usuário admin
  router.post("/admin/create", async (req: Request, res: Response) => {
    try {
      // Validação dos dados de entrada
      const schema = z.object({
        username: z.string().min(3),
        password: z.string().min(6),
      });

      const { username, password } = schema.parse(req.body);

      // Verificar se o usuário já existe
      const existingUser = await db.query.users.findFirst({
        where: eq(users.username, username),
      });

      if (existingUser) {
        return res.status(400).json({ error: "Nome de usuário já existe" });
      }

      // Criptografar a senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar novo usuário
      await db.insert(users).values({
        username,
        password: hashedPassword,
      });

      res.status(201).json({ message: "Usuário admin criado com sucesso" });
    } catch (error) {
      console.error("Erro ao criar usuário admin:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Rota de login
  router.post("/admin/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      // Buscar usuário
      const user = await db.query.users.findFirst({
        where: eq(users.username, username),
      });

      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      // Verificar senha
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      // Criar sessão
      req.session.userId = user.id;
      res.json({ message: "Login realizado com sucesso" });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Rota de logout
  router.post("/admin/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  // Rota protegida para verificar autenticação
  router.get("/admin/check", authMiddleware, (req: Request, res: Response) => {
    res.json({ authenticated: true });
  });

  app.use("/api", router);

  const httpServer = createServer(app);
  return httpServer;
}
