export class BaseError {
  name: string;
  message: string;
  status: number;

  constructor(name: string, message: string, status: number) {
    this.name = name,
    this.message = message,
    this.status = status
  }
}

export class ValidationError {
  name: string;
  message: string;
  status: number;

  constructor(message: string, status: number) {
    this.name = "ValidationError",
    this.message = message,
    this.status = status
  }
}

export class NotFoundError {
  name: string;
  message: string;
  status: number;

  constructor(message: string) {
    this.name = "NotFoundError",
    this.message = message,
    this.status = 404
  }
}