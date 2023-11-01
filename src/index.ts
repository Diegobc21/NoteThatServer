import database from "./config/db.js";
import corsOptions from "./middlewares/cors.js";
import noteRoutes from "./routes/noteRoutes.js";
import spotifyRoutes from "./routes/spotifyRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import express from "express";
import dotenv from "dotenv";

database.connect();
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

app.use(corsOptions);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("", (req: any, res: any) => {
  res.send("NoteThat back-end");
});

app.use("/user", userRoutes);
app.use("/note", noteRoutes);
app.use("/spotify", spotifyRoutes);

app.listen(port, () => {
  console.log(`⚡️ Servidor funcionando en puerto ${port}`);
});
