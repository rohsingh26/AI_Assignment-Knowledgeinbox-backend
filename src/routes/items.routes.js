import express from "express";
import { getItems, deleteItem, createItem } from "../controllers/items.controller.js";

const router = express.Router();

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:id", deleteItem);

export default router;
