class HandleError extends Error {
  constructor(error, message, status) {
    super();
    this.error = error;
    this.message = message;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = HandleError;
