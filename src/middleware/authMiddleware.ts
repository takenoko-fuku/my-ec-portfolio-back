import { Request, Response, NextFunction } from "express";
import adimn from 'firebase-admin';
import { applicationDefault } from "firebase-admin/app";

// // ExpressのRequest型を拡張して、userプロパティを持てるようにする
// // これで、他の場所でreq.userを安全に使えるようになる
// declare global {
//     namespace Express {
//         interface Request {
//             user?: adimn.auth.DecodedIdToken;
//         }
//     }
// }
if(!adimn.apps.length) {
    adimn.initializeApp({
        credential: applicationDefault(),
    })
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