import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// POST /api/cart - カートに商品を追加
router.post('/', async (req: Request, res: Response) => {
    // 認証ミドルウェアでreq.userがセットされていることが保証される
    if(!req.user) {
        res.status(401).json({ error: '認証情報がありません。' });
        return;
    }
    const userId = req.user!.uid;
    const {productId, quantity} = req.body;

    if(!productId || !quantity){
        res.status(400).json({ error: '商品IDと数量は必須です。' });
        return;
    }

    // ...Prismaを使ったDB操作ロジックは同じ...
    // Prismaのおかげで、newItemなどの変数は自動で型がつく
    try {
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                userId_productId: {
                    userId: userId,
                    productId: productId,
                },
            },
        });
        if(existingItem) {
            const updatedItem = await prisma.cartItem.update({
                where: {
                    id: existingItem.id,
                },
                data: {
                    quantity: existingItem.quantity + quantity,
                },
            });
            res.json(updatedItem);
        } else {
            const newItem = await prisma.cartItem.create({
                data: {
                    userId: userId,
                    productId: productId,
                    quantity: quantity,
                },
            });
            res.status(201).json(newItem);
        }
    } catch (error: any){
        res.status(500).json({ error: 'カートの操作に失敗しました。' });
    }
})

export default router;