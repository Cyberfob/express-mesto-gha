const STATUS_CREATED_201 = 201;
const SSK = 'some-secret-key'

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


module.exports = {
  STATUS_CREATED_201,
  SSK,
  NotFoundError,
  BadRequestError,
  InternalServerError,
  AuthError,
};
