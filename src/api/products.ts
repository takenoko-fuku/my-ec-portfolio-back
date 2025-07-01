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
    // 検索・ソート用クエリパラメータ
    const searchTerm = typeof req.query.search === 'string'? req.query.search : undefined;
    const categoryTerm = typeof req.query.category === 'string'? req.query.category : undefined;
    const sortBy = typeof req.query.sortBy === 'string'? req.query.sortBy : 'id';
    const sortOrder = req.query.sortOrder === 'desc'? 'desc' : 'asc';

    // ページネーション用クエリパラメータ
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 8;
    const skip = (page - 1) * pageSize;

    try {
        // 検索条件を動的に構築するためのオブジェクトを準備
        const where: Prisma.ProductWhereInput = {}; 

        if(searchTerm) {
            where.title = {
                contains: searchTerm,
                // 大文字小文字を区別しない
                mode: 'insensitive',
            };
        }
        if(categoryTerm) {
            where.category = categoryTerm;
        }

        // orderBy区オブジェクトの準備
        let orderBy: Prisma.ProductOrderByWithRelationInput;
        // ratingはデータベースでは'ratingRate'というカラム名なので変換する
        switch(sortBy) {
            case 'price':
                orderBy = {price: sortOrder};
                break;
            case 'rating':
                orderBy = {ratingRate: sortOrder};
                break;
            default:
                orderBy = {id: sortOrder};
                break;
        }

        // 商品データとページネーション用の商品総数をトランザクションを使い取得（配列分割代入）
        const [productsFromDb, totalProducts] = await prisma.$transaction([
            prisma.product.findMany({
                where: where,
                orderBy: orderBy,
                skip: skip,
                take: pageSize,
            }),
            prisma.product.count({where})
        ]);
        
        // フロントエンドが期待する「ネストした」形式に変換する
        const productForFrontend = productsFromDb.map(transformProductForFrontend);
        // 総ページ数の計算
        const totalPages = Math.ceil(totalProducts / pageSize);
        
        res.status(200).json({
            products: productForFrontend,
            totalPages: totalPages,
            currentPage: page,
            totalProducts: totalProducts,
        });
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