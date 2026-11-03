import { Router } from "express";
import products from "./products";
export const router = Router();
router.get("/", (_req, res) => res.json({ service: "kavis-lifestyle-api" }));
router.use("/products", products);
