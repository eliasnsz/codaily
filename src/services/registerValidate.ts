import { ValidationError } from "@/errors";
import { UserData } from "@/types";
import { Db } from "mongodb";

import * as EmailValidator from "email-validator"

export async function registerValidate({username, email, password}: UserData, db: Db) {
  
  if (!username) {
    return new ValidationError({
      message: "O nome de usuário é obrigatório", 
      statusCode: 400
    })
  }
  if (username.length < 4) {
    return new ValidationError({
      message: "O nome de usuário deve conter pelo menos 4 caracteres", 
      statusCode: 400
    })
  }
  if (!isAlphaNumeric(username)) {
    return new ValidationError({
      message: "O nome de usuário deve conter apenas letras e números", 
      statusCode: 400
    })
  }
  if (!email) {
    return new ValidationError({
      message: "O e-mail é obrigatório", 
      statusCode: 400
    })
  }
  if (!EmailValidator.validate(email)) {
    return new ValidationError({
      message: "E-mail inválido", 
      statusCode: 400
    })
  }
  
  if (!password) {
    return new ValidationError({
      message: "A senha é obrigatória", 
      statusCode: 400
    })
  }
  if (password.length < 8) {
    return new ValidationError({
      message: "A senha deve conter pelo menos 8 caracteres", 
      statusCode: 400
    })
  }

  const allUsers = await db.collection<UserData>("users").find({}).toArray()
  const existentEmail = allUsers.some(user => user.email === email)
  const existentUsername = allUsers.some(user => user.username === username)

  if (existentUsername) {
    return new ValidationError({
      message: "O nome de usuário inserido já existe",
      statusCode: 400
    })
  }
  if (existentEmail) {
    return new ValidationError({
      message: "O email inserido já existe",
      statusCode: 400
    })
  }

  return null
}

function isAlphaNumeric(input: string) {
  var alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(input);
}