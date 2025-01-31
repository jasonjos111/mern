// const asyncHandler=()=>{}
// const asyncHandler=(func)=>{()=>{}}
// const asyncHandler=(func)=>async()=>{}

// export const asyncHandler = (requestHandler) => {
//   return (req, res, next) => {
//     Promise.resolve(requestHandler(req, res, next)).catch((error) => {
//       next;
//     });
//   };
// };

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
export { asyncHandler };
// export const asyncHandler = (func) => {
//   return async (res, req, next) => {
//     try {
//       await func(req, res, next);
//     } catch (err) {
//       console.log(err);
//     }
//   };
// };

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       message: "Failed",
//       status: false,
//     });
//   }
// };
