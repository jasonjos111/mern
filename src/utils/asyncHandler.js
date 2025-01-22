// const asyncHandler=()=>{}
// const asyncHandler=(func)=>{()=>{}}
// const asyncHandler=(func)=>async()=>{}

// const asyncHandler=(requestHandler)=>{
//     (req,res,next)=>{
//         Promise.resolve(requestHandler(req,res,next)).catch((error)=>{next})
//     }
// }

const asyncHandler = (func) => {
  async (req, res, next) => {
    try {
      await func(res, req, next);
    } catch (error) {
      res.status(error.code || 500).json({
        status: failed,
        message: error.message,
      });
    }
  };
};

export { asyncHandler };
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
