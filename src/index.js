import express from "express";
import connectDB from "./db/index.js";
// import dotenv from "dotenv";

// dotenv.config({ path: "./env" });

connectDB();

/*const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_Name}`);
    app.on("error", (error) => {
      console.log("Express Error", error);
      throw err;
    });
    app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));
  } catch (error) {
    console.error(error);
    throw err;
  }
})();*/
