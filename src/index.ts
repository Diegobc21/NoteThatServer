import database from "./config/db.js";
// import corsOptions from "./middlewares/cors.js";
import noteRoutes from "./routes/noteRoutes.js";
//import spotifyRoutes from "./routes/spotifyRoutes.js";
import passwordRoutes from "./routes/passwordRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import quoteRoutes from "./routes/quoteRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";

dotenv.config();

const port = Number(process.env.PORT) || 3000;
const app = express();
const allowedOrigins = process.env.CORS_ORIGIN
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Express config
app.use(cors({ origin: allowedOrigins?.length ? allowedOrigins : true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join("./", "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./dist/public/index.html"));
});
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/user", userRoutes);
app.use("/note", noteRoutes);
//app.use("/spotify", spotifyRoutes);
app.use("/password", passwordRoutes);
app.use("/section", sectionRoutes);
app.use("/quote", quoteRoutes);

// Do not accept requests until MongoDB is ready.
const start = async (): Promise<void> => {
  try {
    await database.connect();
    console.log("💾 Database connected successfully");
    app.listen(port, () => console.log(`⚡️ Server running on port ${port}`));
  } catch (error) {
    console.error("Database connection error:", error);
    process.exitCode = 1;
  }
};

void start();
