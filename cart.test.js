const request = require('supertest');
const app = require('./server');
import {expect} from 'vitest';

describe('Cart API Endpoints', () => {
    let initialProductsInCart = [];

    beforeEach(() => {
    });
    afterEach(async() => {
        await request(app).delete('/api/cart');
    });

    describe('GET /api/cart', () => {
        it('カートが空の状態で返ってくる', async () => {
            const res = await request(app).get('/api/cart');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });
    });
    describe('POST /api/cart/items', () => {
        it('カートに商品を追加すると、更新されたカートが返ってくる', async () => {
            const newItem = {productId: 1, quantity: 2};
            const res = await request(app).post('/api/cart/items').send(newItem);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBe(1);
            expect(res.body[0]).toMatchObject({id:1, quantity:2});
            expect(res.body[0]).toHaveProperty('title');
        });
        it('既にカートにある商品を追加した場合、個数を増やす', async () => {
            await request(app).post('/api/cart/items').send({productId:1, quantity:1});
            const res = await request(app).post('/api/cart/items').send({productId:1, quantity:2});

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].quantity).toBe(3);
        });
        it('不正なPOSTを受信した場合はステータスコード"400"を返す', async () => {
            const res = await request(app).post('/api/cart/items').send({foo: 'var'});

            expect(res.statusCode).toEqual(400);
        });
        it('存在しない商品を追加しようとした場合、ステータスコード"404"を返す', async () => {
            const res = await request(app).post('/api/cart/items').send({productId: 99, quantity: 3});

            expect(res.statusCode).toEqual(404);
        });
    });
    describe('PUT /api/cart/items/:puroductId', () => {
        beforeEach(async () => {
            await request(app).post('/api/cart/items').send({productId:1, quantity: 2});
        });

        it('既存の商品の数量を更新し、更新されたカートを返す', async () => {
            const res = await request(app).put('/api/cart/items/1').send({quantity: 5});

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].id).toBe(1);
            expect(res.body[0].quantity).toBe(5);
        });
        it('商品個数が0個の場合、商品をカートから削除する', async () => {
            const res = await request(app).put('/api/cart/items/1').send({quantity: 0});

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(0);
        });
        it('存在しない商品を更新しようとした場合、ステータスコード"404"を返す', async () => {
            const res = await request(app).put('/api/cart/items/99').send({quantity: 3});

            expect(res.statusCode).toEqual(404);
        })
    });
    describe('DELETE /api/cart/items/:productId', () => {
        beforeEach(async () => {
            await request(app).post('/api/cart/items').send({ productId: 1, quantity: 1 });
            await request(app).post('/api/cart/items').send({ productId: 2, quantity: 1 });
        });

        it('指定の商品を削除し、更新されたカートを返す', async () => {
            const res = await request(app).delete('/api/cart/items/1');

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(1);
            expect(res.body.find(item => item.id === 1)).toBeUndefined();
            expect(res.body.find(item => item.id === 2)).toBeDefined();
        });
        it('存在しない商品を削除しようとした場合、ステータスコード"404"を返す', async () => {
            const res = request(app).delete('/api/cart/items/999');

            expect((await res).statusCode).toEqual(404);
        });
    });
    describe('DELETE /api/cart', () => {
        beforeEach(async () => {
            await request(app).post('/api/cart/items').send({ productId: 1, quantity: 1 });
            await request(app).post('/api/cart/items').send({ productId: 2, quantity: 1 });
        });

        it('カートの中身をすべて削除する', async () => {
            const res = await request(app).delete('/api/cart');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });
    });
})