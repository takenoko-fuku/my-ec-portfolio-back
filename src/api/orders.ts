import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// GET /api/orders - 注文履歴の取得
router.get('/', async (req: Request, res: Response) => {
    if(!req.user){
        res.status(401).json({error: '認証情報がありません。'});
        return;
    }
    const userId = req.user.uid;

    try {
        const orders = await prisma.order.findMany({
            where: {
                userId: userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });
        res.status(200).json(orders);
    } catch (error: any) {
        console.error("[orders] Failed to fetch orders:", error);
        res.status(500).json({error: "注文履歴の取得に失敗しました。"});
    }
});

// POST /api/orders - 新しい注文を作成する
router.post('/', async (req: Request, res: Response) => {
    if(!req.user){
        res.status(401).json({error: '認証情報がありません。'});
        return;
    }
    const userId = req.user.uid;

    try {
        const cartItems = await prisma.cartItem.findMany({
            where: {userId: userId},
            include: {product: true},
        });

        if (cartItems.length === 0) {
            res.status(400).json({error: "カートが空です。"});
            return;
        }

        const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        // 【Prisma解説】$transaction: 複数のDB操作を「一つの処理単位」として実行します。
        // これにより、途中でエラーが起きた場合、全ての操作が取り消され（ロールバック）、
        // データが中途半端な状態になるのを防ぎます。非常に重要で実践的な機能です。
        const createOrder = await prisma.$transaction(async (tx) => {
            // 1.テーブル作成
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    totalPrice: totalPrice,
                }
            });

            // 2.カートの中身をOrderItemテーブルにコピー
            await tx.orderItem.createMany({
                data: cartItems.map((item) => ({
                    orderId: order.id,
                    quantity: item.quantity,
                    price: item.product.price,
                    productId: item.productId,
                })),
            });

            //3.CartItemテーブルから、このユーザーのカートを全削除
            await tx.cartItem.deleteMany({
                where: {userId: userId}
            });

            return order;
        });

        const newCompleteOrder = await prisma.order.findUnique({
            where: {
                id: createOrder.id
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        res.status(201).json(newCompleteOrder);
    }catch (error: any) {
        console.error("[order] Failed to create order:", error);
        res.status(500).json({error: "注文の作成に失敗しました。"});
    }
});

export default router;