import { Router, Request, Response } from "express";
import { Prisma, PrismaClient, Product } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

const transformProductForFrontend = (product: Product) => {
    return {
        id: product.id,
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        rating: {
            rate: product.ratingRate,
            count: product.ratingCount,
        },
    };
};

// GET /api/products - 商品一覧を取得
router.get('/', async (req: Request, res: Response) => {
    const searchTerm = typeof req.query.search === 'string'? req.query.search : undefined;
    const categoryTerm = typeof req.query.category === 'string'? req.query.category : undefined;

    try {
        // 検索条件を動的に構築するためのオブジェクトを準備
        const where: Prisma.ProductWhereInput = {}; 

        if(searchTerm) {
            where.title = {
                contains: searchTerm,
                mode: 'insensitive',
            };
        }
        if(categoryTerm) {
            where.category = categoryTerm;
        }

        // Step A: DBからは「平坦な」データを取得する
        const productsFromDb = await prisma.product.findMany({
            where: where,
            orderBy: {
                id: 'asc',
            }
        });

        // Step B: フロントエンドが期待する「ネストした」形式に変換する
        const productForFrontend = productsFromDb.map(transformProductForFrontend);

        // Step C: 変換後のデータをフロントエンドに返す
        res.status(200).json(productForFrontend);
    } catch (error: any) {
        console.error("Failed to fetch products:", error);
        res.status(500).json({ error: "商品情報の取得に失敗しました。" });
    }
});

// GET /api/products/:productId
router.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    if(isNaN(productId)) {
        res.status(400).json({error: '商品IDが不正です'});
        return;
    }

    try {
        const productFromDb = await prisma.product.findUnique({
            where: { id: productId },
        });

        if(!productFromDb){
            res.status(404).json({message: 'Product not found'});
            return;
        }

        const productForFrontend = transformProductForFrontend(productFromDb);

        res.status(200).json(productForFrontend);
    } catch (error: any){
        console.error("Failed to fetch product detail:", error);
        res.status(500).json({ error: "商品詳細の取得に失敗しました。" });
    }
})

export default router;