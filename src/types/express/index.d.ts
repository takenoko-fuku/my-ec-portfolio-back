import admin from 'firebase-admin';

// Expressの既存の型定義を拡張するために、'express-serve-static-core'からモジュールをインポートする
// Expressの型定義の内部的な仕組みであり、この方法が公式で推奨されている
declare module 'express-serve-static-core' {
  interface Request {
    // req.userにDecodedIdToken、または未定義の型を付与
    user?: admin.auth.DecodedIdToken;
  }
}

export {};