import { Request, Response, NextFunction } from "express";
import adimn from 'firebase-admin';
import { cert, ServiceAccount } from "firebase-admin/app";

import serviceAccountJson from '../../config/my-portfolio-ec-site-firebase-adminsdk-fbsvc-32e967b49d.json';
const serviceAccount = serviceAccountJson as ServiceAccount;

if(!adimn.apps.length) {
    adimn.initializeApp({
        credential: cert(serviceAccount)
    });
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        res.status(401).send({ error: '認証トークンがありません。' });
        return;
    }

    try {
        const decodedToken = await adimn.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error: any) {
        console.error('Error verifying token:', error);
        res.status(403).send({ error: '認証に失敗しました。' });
        return;
    }
};

export default authMiddleware;