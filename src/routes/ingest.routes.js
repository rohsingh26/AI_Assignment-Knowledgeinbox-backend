import express from "express";
import { ingestContent } from "../controllers/ingest.controller.js";

const router = express.Router();

router.post("/", ingestContent);

export default router;
