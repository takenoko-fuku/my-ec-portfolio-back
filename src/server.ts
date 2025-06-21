import express, { Express, Request, Response } from "express";
import cors from 'cors';
import 'dotenv/config';

import authMiddleware from "./middleware/authMiddleware";
import productApiRoutes from './api/products';
import cartApiRoutes from './api/cart';
import orderApiRoutes from './api/orders';
import paymentApiRoutes from './api/payment';

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('API is running!');
})

app.use('/api/cart', authMiddleware, cartApiRoutes);
app.use('/api/products', productApiRoutes);
app.use('/api/orders', authMiddleware, orderApiRoutes);
app.use('/api/payment-intents', authMiddleware, paymentApiRoutes);

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
})