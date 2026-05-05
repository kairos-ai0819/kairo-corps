# kairos-corp

株式会社kairos (kairos, Inc.) のコーポレートサイト。

- **Astro 5.x + TypeScript** (静的サイト生成)
- **Tailwind CSS v4** (CSS-first config)
- **i18n**: ja (default) / en
- **pnpm** + **Docker** for local dev
- **Cloudflare Pages** for production

## ローカル開発

```sh
docker compose up
```

- 起動後、ブラウザで http://localhost:3013 を開く
- 英語版: http://localhost:3013/en
- ホットリロード対応 (ファイル保存で自動更新)

初回起動時は `pnpm install` が走るため数分かかる。

### 別の便利コマンド

```sh
# コンテナ停止
docker compose down

# 依存追加 (例)
docker compose run --rm web pnpm add <package>

# 型チェック
docker compose run --rm web pnpm typecheck

# 静的ビルド (dist/ に出力)
docker compose run --rm web pnpm build
```

## ポート

| サービス | ホスト | コンテナ |
| -------- | ------ | -------- |
| Astro    | 3013   | 4321     |

他プロジェクト (AgentSignal: 3003 / 5176 / 3309 / 6382) とは衝突しない。

## Cloudflare Pages へのデプロイ

1. Cloudflare ダッシュボード → Workers & Pages → "Create application" → "Pages" → "Connect to Git"
2. このリポジトリを選択
3. ビルド設定:
   - **Framework preset**: `Astro`
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
   - **Root directory**: `kairos-corp` (モノレポ運用の場合)
   - **Environment variables**:
     - `NODE_VERSION` = `22`
     - `PNPM_VERSION` = `9.12.0`

`pnpm build` で `dist/` に純粋な静的 HTML / CSS / JS が出力される。サーバーサイドランタイムは不要。

## i18n の追加方法

`src/i18n/{locale}.json` にキーを追加するだけ。新しい言語を追加する場合:

1. `src/i18n/{new}.json` を作成 (構造は ja.json と完全に一致させる)
2. `astro.config.mjs` の `i18n.locales` に追加
3. `src/i18n/utils.ts` の `locales` 配列と `dictionaries` に追加
4. `src/pages/{new}/index.astro` を作成

ja のみ / en のみのキーは作らない。**構造は完全に一致させる**こと。

## ディレクトリ構成

```
kairos-corp/
├── docker-compose.yml
├── Dockerfile.dev
├── package.json
├── astro.config.mjs
├── tsconfig.json
├── src/
│   ├── i18n/                # ja.json / en.json / utils.ts
│   ├── styles/global.css    # Tailwind v4 entry + theme
│   ├── layouts/BaseLayout.astro
│   ├── components/          # Header / Footer / Hero / Mission / Products / Company / Contact
│   └── pages/
│       ├── index.astro      # /  (ja)
│       └── en/index.astro   # /en
├── public/
│   ├── favicon.svg
│   └── ogp.png
└── README.md
```

## やっていないこと (意図的なスコープ外)

- バックエンド / API / DB
- お問い合わせフォーム送信処理 (mailto: で十分)
- アクセス解析タグ (Cloudflare Analytics で代替)
- 認証
- ja / en 以外の言語
