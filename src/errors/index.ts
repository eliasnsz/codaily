import { HttpStatusCode } from "axios";

export class BaseError extends Error {
  message: string;
  statusCode: HttpStatusCode;

  constructor({ message, statusCode }: { message: string, statusCode?: HttpStatusCode }) {
    super();
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode || 500;
  }
}

export class NotFoundError extends BaseError {
  
  constructor({ message }: { message: string }) {
    super({ 
      message: message || 'Não foi possível encontrar este recurso no sistema.',
      statusCode: 404,
    });
  }
}

export class ValidationError extends BaseError {
  
  constructor({ message, statusCode }: { message: string, statusCode?: number }) {
    super({ 
      message: message || 'Um erro de validação ocorreu.',
      statusCode: statusCode || 400,
    });
  }
}

export class UnauthorizedError extends BaseError {
  
  constructor({ message }: { message: string }) {
    super({ 
      message: message || 'Usuário não autenticado.',
      statusCode: 401,
    });
  }
} 