import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

// Rate limiter para rotas de autenticação
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas por IP
  message: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware para adicionar headers de segurança
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevenir clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Habilitar proteção XSS no navegador
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevenir MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Política de segurança de conteúdo
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};

// Middleware para tratar erros de validação
export const handleValidationError = (error: unknown, res: Response) => {
  if (error instanceof ZodError) {
    const validationError = fromZodError(error);
    return res.status(400).json({
      message: 'Erro de validação',
      errors: validationError.message,
    });
  }
  
  console.error('Erro não tratado:', error);
  return res.status(500).json({
    message: 'Erro interno do servidor',
  });
}; 