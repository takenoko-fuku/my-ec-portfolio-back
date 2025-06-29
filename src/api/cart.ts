import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

interface AddToCartRequestBody {
  productId: number;
  quantity: number;
};
interface UpdateCartRequestParams {
    cartItemId: string;
};
interface UpdateCartRequestBody {
    quantity: number;
};

const prisma = new PrismaClient();
const router = Router();

// GET /api/cart - カート情報を取得
router.get('/', async (req: Request, res: Response) => {
    if(!req.user){
        res.status(401).json({error: '認証情報がありません。'});
        return;
    }
    const userId = req.user!.uid;

    try {
        const cartItem = await prisma.cartItem.findMany({
            where: {
                userId: userId,
            },
            include: {
                product: true,
            },
            orderBy: {
                id: 'desc',
            },
        });

        res.status(200).json(cartItem);
    } catch (error: any) {
        console.error("(GET) Failed to fetch cart:", error);
        res.status(500).json({error: 'カート情報の取得に失敗しました。'})
    }
});

// POST /api/cart - カートに商品を追加
router.post('/', async (req: Request<{},{},AddToCartRequestBody>, res: Response) => {
    // 認証ミドルウェアでreq.userがセットされていることが保証される
    if(!req.user) {
        res.status(401).json({ error: '認証情報がありません。' });
        return;
    }
    const { uid: userId, email } = req.user;
    if (!email) {
        res.status(400).json({ error: 'ユーザー情報にEmailが含まれていません。' });
        return;
    }

    const {productId, quantity} = req.body;

    if(typeof productId !== 'number' || typeof quantity !== 'number' || quantity < 0) {
        res.status(400).json({error: 'リクエストの形式が不正です。'});
        return;
    }

    // upsertを使い、userIdがまだ存在しなければ新規作成する
    try {
        await prisma.user.upsert({
            where: {id: userId},
            update: {},
            create: {
                id: userId,
                email: email,
            }
        });

        const updateItem = await prisma.cartItem.upsert({
            where: {
                userId_productId: {userId, productId},
            },
            update: {
                quantity: {increment: quantity},
            },
            create: {
                userId,
                productId,
                quantity,
            },
            include: {product: true}
        });
        res.status(200).json(updateItem);
    } catch (error: any){
        console.error("(POST) Failed to update fetch cart:", error);
        res.status(500).json({ error: 'カートの操作に失敗しました。' });
    }
});

// PUT /api/cart/:cartItemId - 特定のカートアイテムの数量を変更
router.put('/:cartItemId', async (req:Request<UpdateCartRequestParams,{},UpdateCartRequestBody>, res: Response) => {
    if(!req.user){
        res.status(401).json({error: '認証情報がありません。'});
        return;
    }
    const userId = req.user!.uid;
    const {cartItemId} = req.params;
    const {quantity} = req.body;
    
    const cartItemIdNum = parseInt(cartItemId, 10);
    if (isNaN(cartItemIdNum)) {
        res.status(400).json({error: "アイテムIDが不正です。"});
        return;
    }
    if(typeof quantity !== 'number' || quantity <= 0){
        res.status(400).json({error: "数量が不正です。"});
        return;
    }
    try {
        const result = await prisma.cartItem.updateMany({
            where: {
                userId: userId,
                id: cartItemIdNum,
            },
            data: {
                quantity: quantity,
            }
        });
        if(result.count === 0){
            res.status(404).json({ error: '更新対象のアイテムが見つからないか、権限がありません。' });
            return;
        }
        const updateItem = await prisma.cartItem.findUnique({
            where: {id: cartItemIdNum},
            include: {product: true},
        });
        res.status(200).json(updateItem);
    } catch (error: any) {
        console.log("(PUT) Failed to update cart item:", error);
        res.status(500).json({error: "カートアイテムの更新に失敗しました。"});
    }
});

// DELETE /api/cart/:cartItemId - 特定のカートアイテムを削除
router.delete('/:cartItemId', async (req: Request, res: Response) => {
    if(!req.user){
        res.status(401).json({error: '認証情報がありません。'});
        return;
    }
    const userId = req.user!.uid;
    const {cartItemId} = req.params;
    const cartItemIdNum = parseInt(cartItemId, 10);

    if (isNaN(cartItemIdNum)) {
        res.status(400).json({ error: 'アイテムIDが不正です。' });
        return;
    }

    try {
        const result = await prisma.cartItem.deleteMany({
            where:{
                id: cartItemIdNum,
                userId: userId,
            }
        });
        if(result.count === 0) {
            res.status(404).json({ error: '更新対象のアイテムが見つからないか、権限がありません。' });
            return;
        }
        res.status(204).send();
    } catch (error: any) {
        console.error("(DELETE) Failed to delete cart item:", error);
        res.status(500).json({error: "カートアイテムの削除に失敗しました。"});
    }
});

// DELETE /api/cart/ - カートを削除
router.delete('/', async (req: Request, res: Response) => {
    if(!req.user){
        res.status(401).json({error: '認証情報がありません。'});
        return;
    }
    const userId = req.user.uid;

    try {
        await prisma.cartItem.deleteMany({
            where: {
                userId: userId,
            }
        });

        res.status(204).send();
    }catch (error: any) {
        console.error("(DELETE) Failed to delete cart:", error);
        res.status(500).json({error: "カートの削除に失敗しました。"});
    }
});

export default router;