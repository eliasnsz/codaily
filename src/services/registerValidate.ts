import { ValidationError } from "@/errors";
import { UserData } from "@/types";
import { Db } from "mongodb";

import * as EmailValidator from "email-validator"

export async function registerValidate({username, email, password}: UserData, db: Db) {
  
  if (!username) {
    return new ValidationError("O nome de usuário é obrigatório", 400)
  }
  if (username.length < 4) {
    return new ValidationError(
      "O nome de usuário deve conter no mínimo 4 caracteres", 400
    )
  }
  if (!isAlphaNumeric(username)) {
    return new ValidationError(
      "O nome de usuário deve conter apenas letras e números", 400
    )
  }
  if (!email) {
    return new ValidationError("O email é obrigatório", 400)
  }
  if (!EmailValidator.validate(email)) {
    return new ValidationError("Insira um email válido ", 400)
  }
  
  if (!password) {
    return new ValidationError("Insira uma senha", 400)
  }
  if (password.length < 8) {
    return new ValidationError(
      "A senha deve conter no mínimo 8 caracteres", 400
    )
  }

  const allUsers = await db.collection<UserData>("users").find({}).toArray()
  const existentEmail = allUsers.some(user => user.email === email)
  const existentUsername = allUsers.some(user => user.username === username)

  if (existentUsername) {
    return new ValidationError("O nome de usuário inserido já existe", 400)
  }
  if (existentEmail) {
    return new ValidationError("O email inserido já existe", 400)
  }

  return null
}

function isAlphaNumeric(input: string) {
  var alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(input);
}