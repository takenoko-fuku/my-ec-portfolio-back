import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-05-28.basil",
    typescript: true,
});

// POST /api/payment-intents - 決済の意思(PaymentIntent)を作成する
router.post('/', async (req: Request, res: Response) => {
    if(!req.user) {
        res.status(401).json({error: '認証情報がありません。'})
        return;
    }
    const userId = req.user.uid;

    try {
        const cartItems = await prisma.cartItem.findMany({
            where: {
                userId: userId,
            },
            include: {
                product: true,
            }
        });

        if(cartItems.length === 0) {
            res.status(400).json({error: 'カートが空です。'});
            return;
        }

        const amount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        if (amount < 50) {
            res.status(400).json({ error: '合計金額が50円未満のため、決済に進めません。' });
            return;
        }

        // stripe - paymentIntents
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount),
            currency: 'jpy',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(201).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error: any) {
        console.log('[payment] Failed to post', error);
        res.status(500).json({error: '決済の準備に失敗しました。'});
    }
});

export default router;