const STATUS_CREATED_201 = 201;
const SSK = 'some-secret-key'

const regEx = /^https?:\/\/[www.]?[a-zA-Z0-9]+[\w\-._~:/?#[\]$&'()*+,;*]{2,}#?$/;

class NotFoundError extends Error {
  constructor(message){
    super(message)
    this.statusCode = 404;
  }
}

class BadRequestError extends Error {
  constructor(message){
    super(message)
    this.statusCode = 400;
  }
}

class InternalServerError extends Error {
  constructor(message){
    super(message)
    this.statusCode = 500;
  }
}

class AuthError extends Error {
  constructor(message){
    super(message)
    this.statusCode = 401;
  }
}

class ConflictError extends Error {
  constructor(message){
    super(message)
    this.statusCode = 409;
  }
}

class ForbiddenError extends Error {
  constructor(message){
    super(message)
    this.statusCode = 403;
  }
}

module.exports = {
  STATUS_CREATED_201,
  SSK,
  regEx,
  NotFoundError,
  BadRequestError,
  InternalServerError,
  AuthError,
  ConflictError,
  ForbiddenError,
};
