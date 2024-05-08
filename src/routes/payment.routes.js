import { Router } from "express";
import { createOrder, webhook } from "../controllers/payment.controller.js";

const router = Router();

router.get('/create-order', createOrder)

router.post('/webhook', webhook)

export default router;