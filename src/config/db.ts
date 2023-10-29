import mongoose from "mongoose";
const dotenv = require("dotenv");

dotenv.config();

// URI para conectar al cluster
const uri = process.env.DB_URI || "mongodb://127.0.0.1:27017/TodoApp";

// Opciones para el cliente de MongoDB
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "NoteThat",
};

mongoose.set("strictQuery", false);

// Se exporta la función que inicia la conexión a la BBDD
export default {
  connect: function () {
    mongoose
      .connect(uri, options)
      .then(() => console.log("💾 Base de datos conectada"))
      .catch((err) => console.log(err));
  },
};
