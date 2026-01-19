import express from "express";
import { queryContent } from "../controllers/query.controller.js";

const router = express.Router();

router.post("/", queryContent);

export default router;
