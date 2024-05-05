import database from "./config/db.js";
// import corsOptions from "./middlewares/cors.js";
import noteRoutes from "./routes/noteRoutes.js";
//import spotifyRoutes from "./routes/spotifyRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import quoteRoutes from "./routes/quoteRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";

const port = process.env.PORT || 3000;

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("", (req, res) => {
  res.send("NoteThat back-end");
});

app.use("/user", userRoutes);
app.use("/note", noteRoutes);
//app.use("/spotify", spotifyRoutes);
app.use("/password", passwordRoutes);
app.use("/quote", quoteRoutes);

app.listen(port, () => {
  console.log(`⚡️ Servidor funcionando en puerto ${port}`);

  database
    .connect()
    .then(() => {
      console.log("💾 Base de datos conectada");
    })
    .catch((err) => {
      console.error("Error de conexión a la base de datos:", err);
      app.get("*", (req, res) => {
        res.status(500).send(err);
      });
      process.exit(1);
    });
});
