// // Same code
// class ApiError extends Error {
//   constructor(status, message = "!!something went wrong!!", stack, errors = []) {
//     super(message);
//     this.status = status;
//     this.message = message;
//     this.errors = errors;
//     this.stack = stack;
//     this.data = null;
//     this.success = false;

//     if (stack) {
//       this.stack = stack;
//     } else {
//       stack = Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }
