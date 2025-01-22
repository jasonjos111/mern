class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong!!!", errors = [], stack) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.stack = stack;
    this.data = null;
    this.message = message;
    this.success = false;

    //NOTE Option
    if (stack) {
      this.stack = stack;
    } else Error.captureStackTrace(this, this.constructor);
  }
}
export { ApiError };
