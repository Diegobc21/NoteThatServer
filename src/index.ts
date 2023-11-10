import database from "./config/db.js";
import corsOptions from "./middlewares/cors.js";
import noteRoutes from "./routes/noteRoutes.js";
import spotifyRoutes from "./routes/spotifyRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import express from "express";
import dotenv from "dotenv";

const port = process.env.PORT || 3000;

const app = express();

database
  .connect()
  .then(() => {
    console.log("💾 Base de datos conectada");
    dotenv.config();

    app.use(corsOptions);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get("", (req, res) => {
      res.send("NoteThat back-end");
    });

    app.use("/user", userRoutes);
    app.use("/note", noteRoutes);
    app.use("/spotify", spotifyRoutes);

    app.listen(port, () => {
      console.log(`⚡️ Servidor funcionando en puerto ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error de conexión a la base de datos:", err);
    app.get("*", (req, res) => {
      res.status(500).send(err);
    });
    process.exit(1);
  });
