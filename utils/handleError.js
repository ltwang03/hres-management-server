class HandleError extends Error {
  constructor(error, message, statusCode) {
    super();
    this.error = error;
    this.message = message;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = HandleError;
