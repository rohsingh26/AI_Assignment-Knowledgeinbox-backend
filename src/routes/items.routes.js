import express from "express";
import { getItems, deleteItem } from "../controllers/items.controller.js";

const router = express.Router();

router.get("/", getItems);
router.delete("/:id", deleteItem);

export default router;
