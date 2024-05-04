import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// URI to connect to cluster
const uri = process.env.DB_URI || "mongodb://127.0.0.1:27017/TodoApp";

// MongoDB client options
const options = {
  dbName: "NoteThat"
};

mongoose.set("strictQuery", false);

// DDBB connection function
export default {
  connect: function () {
    return mongoose.connect(uri, options)
  }
}
