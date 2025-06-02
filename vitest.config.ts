import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,        // describe, it, expect などをグローバルスコープで利用可能にする
    environment: 'node',  // バックエンドのテストなのでNode.js環境を指定
    // setupFiles: ['./tests/setup.ts'], // (オプション) テスト全体のセットアップファイルがあれば指定
    // include: ['tests/**/*.test.ts'], // (オプション) テストファイルのパターン指定
  },
});