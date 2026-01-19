import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import ingestRoutes from "./src/routes/ingest.routes.js";
import queryRoutes from "./src/routes/query.routes.js";
import itemsRoutes from "./src/routes/items.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* middleware */
app.use(cors());
app.use(express.json());

/* health check */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* routes */
app.use("/api/ingest", ingestRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/items", itemsRoutes);

/* global error handler */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

/* start server */
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
