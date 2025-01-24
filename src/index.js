import connectDB from "./db/index.js";
import { app } from "./app.js";
// import dotenv from "dotenv";

// dotenv.config({ path: "./env" });

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.get("/", (req, res) => {
      res.send("hello");
    });
    app.listen(PORT, () => {
      console.log(`App listening on Port:${PORT}`);
    });
    app.on("error", (err) => console.log("Express Error ", err));
  })
  .catch((err) => {
    console.log("!!!Error in database connection!!! :", err);
  });

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
