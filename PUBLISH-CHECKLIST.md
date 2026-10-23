# 公開前チェックリスト

公開した後、サイトのURLの最後に **`check.html`** を付けて開くと、下の項目のうち ★ が付いたものを自動で確認できます。
例）`https://woyatsu.github.io/nakashibetsu-story/check.html`

---

## 1. 公開URL ★

- [ ] GitHub のリポジトリ名と、サイトに書かれたURLが一致している
  - 公開URLは `https://（GitHubのユーザー名）.github.io/（リポジトリ名）/` になります
  - check.html で「要修正」と出たら、表示された正しいURLで index.html / 404.html / robots.txt / sitemap.xml の中のURLを置き換える
- [ ] Settings → Pages で公開が有効（Branch: `main` / `(root)`）

## 2. 写真・動画 ★

- [ ] ファーストビュー動画（`assets/video/hero.mp4`）
- [ ] ファーストビュー静止画（`assets/img/hero.jpg`）
- [ ] （任意）スマホ用の縦動画（`assets/video/hero-sp.mp4`）
- [ ] EP.01〜EP.03 のポスター写真（`assets/img/episodes/`）
- [ ] 3スポットの写真（`assets/img/places/`）
- [ ] プロローグの縦写真・横写真、ABOUTの写真
- [ ] SNS共有画像 `assets/img/ogp.jpg` を実写で作り直す（1200×630）
- [ ] 写真に写っている人・お店の掲載許可を取った

詳しい手順は `MEDIA-GUIDE.md` を見てください。

## 3. エピソード情報 ★

各話について `assets/js/data.js` に入力します。

| | EP.01 根室中標津空港 | EP.02 ミルクロード | EP.03 開陽台 |
|---|---|---|---|
| TikTok 投稿URL（`tiktok`） | [ ] | [ ] | [ ] |
| Instagram 投稿URL（`instagram`） | [ ] | [ ] | [ ] |
| 公開日（`published`） | [ ] | [ ] | [ ] |
| 紹介文を本番の文章に（終わったら `draft: true` を削除） | [ ] | [ ] | [ ] |
| 英語タイトル（`titleEn`）の確認 | [ ] | [ ] | [ ] |

- 投稿URLは、TikTok／Instagram アプリの「共有 → リンクをコピー」で取得できます。
- 投稿URLが空欄の間は、ボタンを押すとアカウントのトップページが開きます。

## 4. スポット情報（観光ガイド） ★

未入力の項目はサイトに表示されません。**確認できた情報だけ**入力してください。

- [ ] 所在地（`address`）— 公式サイトや施設に確認したもの
- [ ] 座標（`lat` / `lng`）— Googleマップで地点を長押し → 表示された数字（例: 43.6, 144.9）をコピー
- [ ] 営業時間・定休日・料金（ある場所のみ）— 季節で変わる場合は「4月〜10月 9:00〜17:00」のように書く
- [ ] 公式サイト・公式SNS（`official` / `sns`）
- [ ] 確認した日（`checkedAt`）— 情報を入れたら必ず入力（「◯年◯月◯日時点」と表示されます）
- [ ] 説明文を本番の文章に（終わったら `draft: true` を削除）

## 5. サイト全体の文章

- [ ] プロローグの文章（index.html の PROLOGUE）を確定
- [ ] ABOUT の本文（WHY I CAME HOME / WHY A STORY）を確定
- [ ] クレジット表記（STORYTELLER の名前など）を確認
- [ ] すべて確定したら `data.js` の `showDraftLabels` を `false` にして「仮テキスト」「仮画像」ラベルを消す ★

## 6. リンク・フォーム ★

- [ ] TikTok `@nakashibetsu_story` が開く
- [ ] Instagram `@nakashibetsu_story` が開く
- [ ] 情報提供フォーム（Googleフォームなど）を作ったら `links.form` に URL を入れる
- [ ] お問い合わせ先を決めたら `links.contact` に URL を入れる

## 7. 公開後に実機で確認

- [ ] iPhone と Android で、ファーストビューの動画が再生される
- [ ] エピソード詳細・スポット詳細を開いて閉じたあと、画面下のナビが戻ってくる
- [ ] 「すべてのエピソードを見る」から全話が見られる
- [ ] 「Googleマップで開く」で正しい場所が開く
- [ ] LINE や X にサイトのURLを貼り、共有画像とタイトルが表示される
  - 古い画像が出るときは、時間をおいてから再度試す（SNS側で画像が保存されているため）
- [ ] check.html で「要修正」が 0 件
