var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  contacts: () => contacts,
  insertContactSchema: () => insertContactSchema,
  insertProjectSchema: () => insertProjectSchema,
  insertUserSchema: () => insertUserSchema,
  projects: () => projects,
  users: () => users
});
import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  image: text("image").notNull(),
  demoUrl: text("demo_url"),
  repoUrl: text("repo_url"),
  category: text("category").notNull(),
  technologies: text("technologies").array().notNull(),
  features: text("features").array(),
  screenshots: text("screenshots").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  featuredOrder: text("featured_order"),
  meta: jsonb("meta")
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  subject: true,
  message: true
});
var insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true }).extend({
  technologies: z.array(z.string()),
  features: z.array(z.string()).optional(),
  screenshots: z.array(z.string()).optional(),
  meta: z.record(z.string(), z.any()).optional()
});

// server/storage.ts
import { eq } from "drizzle-orm";

// server/db.ts
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}
var sql = neon(process.env.DATABASE_URL);
var db = drizzle(sql, { schema: schema_exports });

// server/storage.ts
var DbStorage = class {
  // User methods
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  async getUsers() {
    return await db.select().from(users);
  }
  async createUser(insertUser) {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  // Contact methods
  async createContact(insertContact) {
    const result = await db.insert(contacts).values(insertContact).returning();
    return result[0];
  }
  async getContacts() {
    return await db.select().from(contacts);
  }
  async getContact(id) {
    const result = await db.select().from(contacts).where(eq(contacts.id, id));
    return result[0];
  }
  // Project methods
  async getProjects() {
    return await db.select().from(projects);
  }
  async getProjectById(id) {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }
  async getProjectBySlug(slug) {
    const result = await db.select().from(projects).where(eq(projects.slug, slug));
    return result[0];
  }
  async createProject(project) {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }
  async updateProject(id, project) {
    const result = await db.update(projects).set(project).where(eq(projects.id, id)).returning();
    return result[0];
  }
  async deleteProject(id) {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }
};
var storage = new DbStorage();

// server/routes.ts
import { ZodError as ZodError2 } from "zod";
import { fromZodError as fromZodError2 } from "zod-validation-error";
import bcrypt from "bcryptjs";

// server/middleware/security.ts
import rateLimit from "express-rate-limit";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutos
  max: 5,
  // 5 tentativas por IP
  message: { message: "Muitas tentativas de login. Tente novamente em 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false
});
var securityHeaders = (req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
};
var handleValidationError = (error, res) => {
  if (error instanceof ZodError) {
    const validationError = fromZodError(error);
    return res.status(400).json({
      message: "Erro de valida\xE7\xE3o",
      errors: validationError.message
    });
  }
  console.error("Erro n\xE3o tratado:", error);
  return res.status(500).json({
    message: "Erro interno do servidor"
  });
};

// server/routes.ts
import { Router } from "express";
import { eq as eq2 } from "drizzle-orm";
import { z as z2 } from "zod";
var router = Router();
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.status(401).json({ message: "N\xE3o autorizado" });
}
var authMiddleware = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(401).json({ error: "N\xE3o autorizado" });
    return;
  }
  next();
};
async function registerRoutes(app2) {
  app2.use(securityHeaders);
  app2.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.post("/api/auth/setup", async (req, res) => {
    try {
      const users2 = await storage.getUsers();
      if (users2.length > 0) {
        return res.status(403).json({ message: "Setup j\xE1 realizado. N\xE3o \xE9 poss\xEDvel criar mais usu\xE1rios admin." });
      }
      const userData = insertUserSchema.parse(req.body);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      res.status(201).json({
        message: "Usu\xE1rio administrador criado com sucesso",
        userId: user.id
      });
    } catch (error) {
      handleValidationError(error, res);
    }
  });
  app2.post("/api/auth/login", authLimiter, async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password || typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({ message: "Dados de entrada inv\xE1lidos" });
      }
      const user = await storage.getUserByUsername(username);
      const isMatch = user ? await bcrypt.compare(password, user.password) : false;
      if (!user || !isMatch) {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
        return res.status(401).json({ message: "Credenciais inv\xE1lidas" });
      }
      req.session.userId = user.id;
      req.session.cookie.secure = process.env.NODE_ENV === "production";
      req.session.cookie.httpOnly = true;
      req.session.cookie.sameSite = "strict";
      res.status(200).json({ message: "Login realizado com sucesso" });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ message: "Erro ao fazer login" });
    }
  });
  app2.get("/api/auth/check", isAuthenticated, (req, res) => {
    res.status(200).json({ message: "Usu\xE1rio autenticado", userId: req.session.userId });
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logout realizado com sucesso" });
    });
  });
  app2.post("/api/contact", async (req, res) => {
    console.log("Recebida requisi\xE7\xE3o de contato:", req.body);
    try {
      const contactData = insertContactSchema.parse(req.body);
      console.log("Dados validados com sucesso:", contactData);
      const contact = await storage.createContact(contactData);
      console.log("Contato salvo com sucesso:", contact);
      res.status(201).json({
        message: "Mensagem enviada com sucesso!",
        contact
      });
    } catch (error) {
      if (error instanceof ZodError2) {
        const validationError = fromZodError2(error);
        console.error("Erro de valida\xE7\xE3o:", validationError.message);
        res.status(400).json({
          message: "Erro de valida\xE7\xE3o",
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
  app2.get("/api/contacts", isAuthenticated, async (_req, res) => {
    try {
      const contacts2 = await storage.getContacts();
      res.status(200).json(contacts2);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erro ao buscar mensagens de contato"
      });
    }
  });
  app2.get("/api/projects", async (_req, res) => {
    try {
      const projects2 = await storage.getProjects();
      res.status(200).json(projects2);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar projetos" });
    }
  });
  app2.get("/api/projects/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const project = await storage.getProjectBySlug(slug);
      if (!project) {
        return res.status(404).json({ message: "Projeto n\xE3o encontrado" });
      }
      res.status(200).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar projeto" });
    }
  });
  app2.post("/api/projects", isAuthenticated, async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json({
        message: "Projeto criado com sucesso",
        project
      });
    } catch (error) {
      if (error instanceof ZodError2) {
        const validationError = fromZodError2(error);
        res.status(400).json({
          message: "Erro de valida\xE7\xE3o",
          errors: validationError.message
        });
      } else {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar projeto" });
      }
    }
  });
  app2.patch("/api/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const projectId = parseInt(id);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "ID de projeto inv\xE1lido" });
      }
      const existingProject = await storage.getProjectById(projectId);
      if (!existingProject) {
        return res.status(404).json({ message: "Projeto n\xE3o encontrado" });
      }
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
  app2.delete("/api/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const projectId = parseInt(id);
      if (isNaN(projectId)) {
        return res.status(400).json({ message: "ID de projeto inv\xE1lido" });
      }
      const success = await storage.deleteProject(projectId);
      if (!success) {
        return res.status(404).json({ message: "Projeto n\xE3o encontrado" });
      }
      res.status(200).json({ message: "Projeto exclu\xEDdo com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao excluir projeto" });
    }
  });
  router.post("/admin/create", async (req, res) => {
    try {
      const schema = z2.object({
        username: z2.string().min(3),
        password: z2.string().min(6)
      });
      const { username, password } = schema.parse(req.body);
      const existingUser = await db.query.users.findFirst({
        where: eq2(users.username, username)
      });
      if (existingUser) {
        return res.status(400).json({ error: "Nome de usu\xE1rio j\xE1 existe" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.insert(users).values({
        username,
        password: hashedPassword
      });
      res.status(201).json({ message: "Usu\xE1rio admin criado com sucesso" });
    } catch (error) {
      console.error("Erro ao criar usu\xE1rio admin:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });
  router.post("/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await db.query.users.findFirst({
        where: eq2(users.username, username)
      });
      if (!user) {
        return res.status(401).json({ error: "Credenciais inv\xE1lidas" });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Credenciais inv\xE1lidas" });
      }
      req.session.userId = user.id;
      res.json({ message: "Login realizado com sucesso" });
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });
  router.post("/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });
  router.get("/admin/check", authMiddleware, (req, res) => {
    res.json({ authenticated: true });
  });
  app2.use("/api", router);
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@radix-ui/react-accordion", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          utils: ["date-fns", "zod", "zustand"]
        }
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1e3
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3e3,
    host: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import rateLimit2 from "express-rate-limit";
var app = express2();
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.VITE_API_URL || "https://portif-lio-production.up.railway.app"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));
var limiter = rateLimit2({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
  // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  // limite de 100 requisições por IP
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);
app.use(cors({
  origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL || "https://seu-dominio.com" : "http://localhost:5173",
  // URL do frontend em desenvolvimento
  credentials: true,
  // Permite o envio de cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
if (process.env.ENABLE_COMPRESSION === "true") {
  app.use(compression());
}
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
var PgSession = connectPgSimple(session);
app.use(session({
  store: new PgSession({
    conString: process.env.DATABASE_URL,
    tableName: "session",
    // Tabela para armazenamento das sessões
    createTableIfMissing: true
    // Cria a tabela automaticamente se não existir
  }),
  secret: process.env.SESSION_SECRET || "portfolio-admin-secret",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1e3,
    // 30 dias
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // Habilitado em ambiente de produção
    sameSite: "lax"
  }
}));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} em ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3e3;
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`Servidor rodando em modo ${process.env.NODE_ENV} na porta ${port}`);
  });
})();
