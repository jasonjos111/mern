import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const dbConnect = async () => {
  try {
    const dbConnection = await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_Name}`);
    console.log(
      `Connected to database ${DB_Name}!!!\n host:${dbConnection.connection.host}`
    );
  } catch (error) {
    console.log(`Error connecting to db ${DB_Name} host: \n ${error}`);
    process.exit(1);
  }
};

export default dbConnect;
