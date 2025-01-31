import express from "express";
import cookieParser from "cookie-parser";

import cors from "cors";

const app = express();

//INFO Configuring app
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//Routes import
import userRouter from "./routes/user.routes.js";

//Router declaration
app.use("/api/user", userRouter);
//When the user is on /api/v1/user url, express calls the specified router which here is userRouter and the final url would be
//http://localhost:PORT/api/register

export { app };
