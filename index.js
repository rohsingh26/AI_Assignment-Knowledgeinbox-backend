import "dotenv/config";
import express from "express";
import cors from "cors";

import ingestRoutes from "./src/routes/ingest.routes.js";
import queryRoutes from "./src/routes/query.routes.js";
import itemsRoutes from "./src/routes/items.routes.js";

import { backfillEmbeddings } from "./scripts/backfillEmbeddings.js";
import { rehydrateVectorStore } from "./src/services/rehydrateVectorStore.service.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));

app.use("/api/ingest", ingestRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/items", itemsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);

  await backfillEmbeddings();

  await rehydrateVectorStore();
});
