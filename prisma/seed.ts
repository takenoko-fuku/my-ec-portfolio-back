import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const allProducts = [
    { title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops', price: 109.95, description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday', category: "men's clothing", image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//01%2081fPKd-2AYL._AC_SL1500_.jpg', ratingRate: 3.9, ratingCount: 120 },
    { title: 'Mens Casual Premium Slim Fit T-Shirts ', price: 22.3, description: 'Slim-fitting style, contrast raglan sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.', category: "men's clothing", image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//02%2071-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', ratingRate: 4.1, ratingCount: 259 },
    { title: 'Mens Cotton Jacket', price: 55.99, description: 'great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.', category: "men's clothing", image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//03%2071li-ujtlUL._AC_UX679_.jpg', ratingRate: 4.7, ratingCount: 500 },
    { title: 'Mens Casual Slim Fit', price: 15.99, description: 'The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.', category: "men's clothing", image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//04%2071YXzeOuslL._AC_UY879_.jpg', ratingRate: 2.1, ratingCount: 430 },
    { title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet", price: 695, description: "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.", category: 'jewelery', image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//05%2071pWzhdJNwL._AC_UL640_QL65_ML3_.jpg', ratingRate: 4.6, ratingCount: 400 },
    { title: 'Solid Gold Petite Micropave ', price: 168, description: 'Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by HaHaHa Inc. USA warehouses.', category: 'jewelery', image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//06%2061sbMiUnoGL._AC_UL640_QL65_ML3_.jpg', ratingRate: 3.9, ratingCount: 70 },
    { title: 'White Gold Plated Princess', price: 9.99, description: "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...", category: 'jewelery', image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//07%2071YAIFU48IL._AC_UL640_QL65_ML3_.jpg', ratingRate: 3, ratingCount: 400 },
    { title: 'Pierced Owl Rose Gold Plated Stainless Steel Double', price: 10.99, description: 'Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel', category: 'jewelery', image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//08%2051UDEzMJVpL._AC_UL640_QL65_ML3_.jpg', ratingRate: 1.9, ratingCount: 100 },
    { title: 'WD 2TB Elements Portable External Hard Drive - USB 3.0 ', price: 64, description: 'USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system', category: 'electronics', image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//09%2061IBBVJvSDL._AC_SY879_.jpg', ratingRate: 3.3, ratingCount: 203 },
    { title: 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s', price: 109, description: 'Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)', category: 'electronics', image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//10%2061U7T1koQqL._AC_SX679_.jpg', ratingRate: 2.9, ratingCount: 470 },
    { title: 'switch2', price: 449.99, description: 'Play with greater detail and clarity thanks to a high-definition LCD display featuring support for HDR, VRR, and up to 120 fps in compatible games.', category: 'game', image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//11%20switch2.jpg',ratingRate: 4.8, ratingCount: 2050 },
    // --- Electronics ---
    {title: 'ウルトラHD 4Kモニター 27インチ',price: 45000,description: '鮮明でリアルな映像体験を提供する、プロフェッショナル向け4Kモニター。USB-C接続にも対応。',category: "Electronics",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//12%20HD%204K%20monitor.jpg',ratingRate: 4.7,ratingCount: 320},
    {title: 'メカニカル・ゲーミングキーボード RGB',price: 18000,description: '高速応答と心地よい打鍵感を両立したメカニカルキーボード。カスタマイズ可能なRGBバックライト搭載。',category: "Electronics",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//13_sampleImage.jpg',ratingRate: 4.8,ratingCount: 450},
    {title: 'ポータブルSSD 1TB 高速転送',price: 15000,description: '名刺サイズで持ち運びに便利な1TBのポータブルSSD。大量のデータを素早く転送できます。',category: "Electronics",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//14_sampleImage.jpg',ratingRate: 4.9,ratingCount: 512},
    {title: '完全ワイヤレスイヤホン ANC搭載',price: 22000,description: 'アクティブノイズキャンセリング機能を搭載した高音質ワイヤレスイヤホン。周囲の騒音を気にせず音楽に集中できます。',category: "Electronics",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//15_sampleImage.jpg',ratingRate: 4.6,ratingCount: 880},
    {title: 'スマートウォッチ GPSモデル',price: 35000,description: '健康管理から通知確認まで、あなたの生活をサポートする多機能スマートウォッチ。',category: "Electronics",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//16_sampleImage.jpg',ratingRate: 4.5,ratingCount: 650},
    // --- Jewelery ---
    {title: 'プラチナ・ダイヤモンドリング',price: 120000,description: '永遠の輝きを放つ、0.5カラットのダイヤモンドをあしらったプラチナリング。',category: "Jewelery",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//17_sampleImage.jpg',ratingRate: 4.9,ratingCount: 150},
    {title: '18Kゴールド・チェーンネックレス',price: 58000,description: 'どんなスタイルにも合わせやすい、シンプルで洗練された18Kゴールドのネックレス。',category: "Jewelery",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//18_sampleImage.jpg',ratingRate: 4.7,ratingCount: 210},
    {title: 'シルバー・インフィニティピアス',price: 12000,description: '「無限」をモチーフにしたエレガントなシルバーピアス。日常使いにも特別な日にも。',category: "Jewelery",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//19_sampleImage.jpg',ratingRate: 4.6,ratingCount: 330},
    {title: '天然石パワーストーンブレスレット',price: 8500,description: 'ローズクォーツとアメジストを使用した、心安らぐパワーストーンブレスレット。',category: "Jewelery",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//20_sampleImage.jpg',ratingRate: 4.8,ratingCount: 420},
    {title: 'パールペンダント・シルバー925',price: 25000,description: '上品な輝きを放つ淡水パールを使用した、クラシックなデザインのペンダント。',category: "Jewelery",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//21_sampleImage.jpg',ratingRate: 4.7,ratingCount: 180},
    // --- Men's Clothing ---
    {title: 'オーガニックコットン・オックスフォードシャツ',price: 8900,description: '肌触りの良いオーガニックコットンを使用した、定番のボタンダウンシャツ。オンオフ問わず活躍します。',category: "Men's Clothing",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//22_sampleImage.jpg',ratingRate: 4.6,ratingCount: 280},
    {title: 'スリムフィット・ストレッチチノパンツ',price: 9800,description: '動きやすさと美しいシルエットを両立したストレッチ素材のチノパンツ。',category: "Men's Clothing",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//23_sampleImage.jpg',ratingRate: 4.5,ratingCount: 350},
    {title: '軽量撥水マウンテンパーカー',price: 17500,description: '急な天候の変化にも対応できる、軽量で撥水性に優れたマウンテンパーカー。アウトドアシーンに最適。',category: "Men's Clothing",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//24_sampleImage.jpg',ratingRate: 4.7,ratingCount: 190},
    {title: 'ウールブレンド・チェスターコート',price: 28000,description: '暖かく上品な印象を与えるウール混素材のチェスターコート。ビジネスシーンにも対応。',category: "Men's Clothing",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//25_sampleImage.jpg',ratingRate: 4.8,ratingCount: 120},
    {title: 'プレミアムコットン・クルーネックTシャツ 3枚セット',price: 6000,description: '一枚でもインナーとしても使える、上質なコットン100%のベーシックなTシャツセット。',category: "Men's Clothing",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//26_sampleImage.jpg',ratingRate: 4.9,ratingCount: 950},
    // --- Women's Clothing ---
    {title: 'リネンブレンド・Aラインワンピース',price: 12000,description: '涼しげでナチュラルな風合いのリネン混素材を使用した、美しいAラインシルエットのワンピース。',category: "Women's Clothing",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//27_sampleImage.jpg',ratingRate: 4.7,ratingCount: 310},
    {title: 'ハイウエスト・スキニーデニム',price: 9500,description: '脚長効果抜群のハイウエストデザインと、抜群のフィット感を誇るストレッチデニム。',category: "Women's Clothing",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//28_sampleImage.jpg',ratingRate: 4.4,ratingCount: 520},
    {title: 'シルキータッチ・Vネックブラウス',price: 7800,description: '滑らかな肌触りが心地よい、エレガントなVネックブラウス。オフィスでもプライベートでも活躍。',category: "Women's Clothing",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//29_sampleImage.jpg',ratingRate: 4.6,ratingCount: 410},
    {title: 'プリーツロングスカート',price: 8800,description: '動くたびに優雅に揺れる、繊細なプリーツが美しいロングスカート。',category: "Women's Clothing",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//30_sampleImage.jpg',ratingRate: 4.8,ratingCount: 290},
    {title: 'カシミアタッチ・カーディガン',price: 11000,description: 'カシミアのような柔らかさと暖かさを実現したカーディガン。季節の変わり目に重宝します。',category: "Women's Clothing",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//31_sampleImage.jpg',ratingRate: 4.9,ratingCount: 380},
    // --- Game ---
    {title: 'エルダーソウル・クロニクルズ',price: 8800,description: '広大なオープンワールドを冒険する、壮大なファンタジーアクションRPG。',category: "Game",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//32_sampleImage.jpg',ratingRate: 4.9,ratingCount: 1250},
    {title: 'ギャラクシー・レーサーズ・アルティメット',price: 7600,description: '未来都市を舞台にした超高速反重力レースゲーム。オンライン対戦が熱い。',category: "Game",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//33_sampleImage.jpg',ratingRate: 4.5,ratingCount: 680},
    {title: 'ピクセルファーム・ストーリー',price: 4500,description: '自分だけの農場を作り、村人との交流を楽しむ、心温まるスローライフシミュレーション。',category: "Game",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//34_sampleImage.jpg',ratingRate: 4.8,ratingCount: 980},
    {title: 'シャドウ・ストライク：サイレントアサシン',price: 8200,description: '影に潜み、敵を討つ。緊張感あふれるステルスアクションゲームの決定版。',category: "Game",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//35_sampleImage.jpg',ratingRate: 4.6,ratingCount: 720},
    {title: 'ミステリー・オブ・ザ・クロックタワー',price: 5800,description: '呪われた時計塔の謎を解き明かす、ゴシックホラーアドベンチャーゲーム。',category: "Game",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//36_sampleImage.jpg',ratingRate: 4.7,ratingCount: 550},
    // --- Book ---
    {title: '思考する葦：AIと人間の未来',price: 2200,description: '人工知能はどこまで進化するのか？哲学と科学の視点から人間性の本質に迫る一冊。',category: "Book",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//37_sampleImage.jpg',ratingRate: 4.8,ratingCount: 480},
    {title: '最後の航海士：失われた海図の謎',price: 1800,description: '伝説の海図を巡る、手に汗握る海洋冒険ミステリー小説。',category: "Book",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//38_sampleImage.jpg',ratingRate: 4.6,ratingCount: 650},
    {title: 'ミニマリストの整理術：心が軽くなる部屋づくり',price: 1500,description: '物だけでなく、情報や人間関係もシンプルにするための思考法と実践テクニックを紹介。',category: "Book",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//39_sampleImage.jpg',ratingRate: 4.7,ratingCount: 890},
    {title: '10分でわかる！量子力学入門',price: 1900,description: '難解な量子力学の世界を、イラストと平易な文章で誰にでも分かりやすく解説。',category: "Book",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//40_sampleImage.jpg',ratingRate: 4.4,ratingCount: 320},
    {title: '星降る夜のベーカリー',price: 1600,description: '不思議なパン屋を舞台に繰り広げられる、心温まる連作短編集。',category: "Book",image: 'https://xxjsgfxocvrthakvbtxa.supabase.co/storage/v1/object/public/product-images//41_sampleImage.jpg',ratingRate: 4.9,ratingCount: 1100},
  // ... (fakestoreapi.com/products から他の商品データを追加するか、一部でテスト)
];

const main = async () => {
    for (const p of allProducts) {
        // 【Prisma解説】 upsert: レコードの「更新または挿入」を行います。
        // 同じnameの商品が既にあれば更新、なければ新規作成します。
        // これにより、seedスクリプトを何回実行してもデータが重複しないようになります。
        const product = await prisma.product.upsert({
            where: { title : p.title }, // ユニークなフィールドで検索
            update: { image: p.image }, // 既にある場合は何もしない（更新したい項目があればここに記述）
            create: {
                title: p.title,
                price: p.price,
                description: p.description,
                category: p.category,
                image: p.image,
                ratingRate: p.ratingRate,
                ratingCount: p.ratingCount,
            },
        });
    }
}

main()
    .catch((error: any) => {
        console.error(error);
        process.exit(1);
    })
    .finally (async () => {
        await prisma.$disconnect();
    })