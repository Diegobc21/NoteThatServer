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
import path from "path";

const port = process.env.PORT || 3000;

const app = express();

dotenv.config();

// Express config
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join("./", "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./dist/public/index.html"));
});
app.use("/user", userRoutes);
app.use("/note", noteRoutes);
//app.use("/spotify", spotifyRoutes);
app.use("/password", passwordRoutes);
app.use("/quote", quoteRoutes);

// Start server
app.listen(port, () => {
  console.log(`⚡️ Server running on port ${port}`);

  database
    .connect()
    .then(() => {
      console.log("💾 Database connected successfully");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
      app.get("*", (req, res) => {
        res.status(500).send(err);
      });
      process.exit(1);
    });
});
