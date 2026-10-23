# 中標津浦島物語 — 公式サイト

GitHub Pages で公開する静的サイトです（HTML / CSS / JavaScript のみ。ビルド不要）。

## フォルダ構成

```
index.html            トップページ（構造・SEO・OGP）
check.html            公開前チェック（公開URLで開くと設定を自動確認。検索結果には出ません）
MEDIA-GUIDE.md        写真・動画の差し替えガイド（初心者向け）
PUBLISH-CHECKLIST.md  公開前に用意するもののチェックリスト
DEVICE-CHECK.md       動作確認の結果と、実機での確認手順
404.html              見つからないページ
robots.txt / sitemap.xml
assets/
  css/style.css       デザイン
  js/data.js          ★ エピソード・スポット・SNS・写真/動画の設定（普段はここだけ編集）
  js/main.js          動作（通常は編集不要）
  img/                写真（ogp.jpg / favicon.svg / apple-touch-icon.png を含む）
    episodes/         エピソードのポスター写真（例: ep-01.jpg）
    places/           スポットの写真（例: kaiyodai.jpg）
  video/              ファーストビューの動画（例: hero.mp4）
※ 各フォルダの README.txt に、推奨サイズとファイル名のルールを書いています。
```

## 公開URL

公開URLは **`https://yam4k3n.github.io/nakashibetsu-story/`**（GitHub: `yam4k3n/nakashibetsu-story`）に設定済みです。
公開後に **`https://yam4k3n.github.io/nakashibetsu-story/check.html`** を開くと、URL設定が一致しているかを自動で確認できます。
将来リポジトリ名を変えた場合は、次のファイルの URL を置き換えてください（check.html が正しいURLを表示します）。

- `index.html`（canonical / og:url / og:image / twitter:image / JSON-LD）
- `404.html`
- `robots.txt` と `sitemap.xml`

## エピソードを追加する（assets/js/data.js）

`episodes` の末尾に1件追加します。古い順に並べると、サイトでは新しい順に表示されます。

```js
{
  id: "ep-04", no: "04",
  title: "（エピソード名）", titleEn: "（英語タイトル）",
  category: "MEET", categoryJa: "人に会う",   // RETURN / FIND / MEET / ASK など
  lead: "（2〜3行の紹介文）",
  image: "assets/img/ep-04.jpg",              // ポスター写真（縦長がおすすめ）
  scene: "road",                              // 写真が無い間の仮ビジュアル
  tiktok: "https://www.tiktok.com/@nakashibetsu_story/video/...",  // 投稿URL
  instagram: "https://www.instagram.com/p/...",
  published: "2026-11-01",
  places: ["spot-id"]                         // 登場スポットの id
}
```

- `places` にスポットの id を書くと、エピソード ⇔ スポットが自動で相互リンクされます。
- エピソード詳細は `index.html#ep-04` のURLで直接開けます（SNSのプロフィールリンクなどに使えます）。
- トップページには最新の **4本** だけが表示されます（`homeEpisodes` で変更可）。全話は「すべてのエピソードを見る」（`index.html#episodes`）から、カテゴリ別に見られます。何十本に増えてもトップページの長さは変わりません。

## スポットを追加する

`places` に追加します。**確認できていない情報は `null` のまま**にしてください。未入力の項目は画面に表示されず、確認できた情報だけが並びます（何も入力がない間は「詳しい情報は確認でき次第掲載します」という一文だけを表示）。

| 項目 | 内容 |
|---|---|
| `address` / `hours` / `closed` / `price` | 所在地・営業時間・定休日・料金 |
| `access` / `parking` / `phone` | アクセス・駐車場・電話番号 |
| `official` / `sns` | 公式サイト・公式SNSのURL |
| `checkedAt` | 情報を確認した日（例: `"2026-11-01"`）。「◯時点の情報」と表示 |
| `mapQuery` | Googleマップで検索する語句（施設名など） |
| `lat`, `lng` | 確認済みの座標。入れるとGoogleマップでその地点が開きます |
| `schematic` | サイト内の概略図での表示位置 `[横%, 縦%]`（演出用で、実際の位置ではありません） |
| `cat` | `FOOD` / `NATURE` / `CULTURE` / `ACTIVITY` / `LOCAL` |

スポット詳細は `index.html#spot-（id）` で直接開けます。

## 写真・動画を差し替える

**詳しい手順（サイズ・形式・保存先・書き方）は `MEDIA-GUIDE.md` にまとめています。** 概要は次のとおりです。

1. `assets/img/` や `assets/video/` にファイルをアップロード
2. `data.js` の該当箇所にパスを書く

- ファーストビュー動画：`media.hero.video`（PC用・横長）、`media.hero.videoMobile`（スマホ用・縦長）、`media.hero.poster`（読み込み前に出る静止画）
  - 目安：無音・10〜20秒・mp4（H.264）・5MB前後。動きを減らす設定や省データ設定の端末では静止画を表示します。
- そのほかの写真：`media` の各項目、各エピソード・スポットの `image`
- 写真の読み込みに失敗した場合は、自動で仮ビジュアルに戻ります。

## 仮の文章・仮の画像の表示

- 仮の紹介文には「仮テキスト」、写真が未設定の場所には「仮画像」「仮映像」のラベルが付きます。
- 文章を本番の内容に書き換えたら、そのエピソード／スポットの `draft: true` を削除（または `false`）してください。
- 写真を設定した場所のラベルは自動で消えます。
- すべてそろったら、`data.js` 先頭の `showDraftLabels` を `false` にするとラベルが一括で非表示になります。

## SNS・フォーム

`links` に設定します。`form`（情報提供フォーム）と `contact`（お問い合わせ）は、URLを入れるまで「準備中」と表示されます。

## 公開手順（GitHub Pages）

1. リポジトリ（例: `nakashibetsu-story`）を作成し、`nakashibetsu-story` フォルダの**中身**（index.html と同じ階層のファイル・フォルダすべて）をアップロード（Add file → Upload files。フォルダごとドラッグできます）
2. Settings → Pages → Branch を `main` / `(root)` に設定

## 動作確認済みの項目（2026-10-23）

GitHub Pagesと同じ「/nakashibetsu-story/」配下での配信を再現し、Chromium（Chrome・Edgeと同じエンジン）で自動チェックしました。機能テスト98項目・画面サイズ別のレイアウト検査14画面、すべて合格。
詳しい結果と、実機での確認手順は `DEVICE-CHECK.md` を見てください。

- EP.01〜EP.07 の登録順、トップは新しい順に4話（07・06・05・04）、「すべてのエピソードを見る」で全7話
- 各エピソード ⇔ スポット詳細 ⇔ 浦島マップ（ピン7個）の連携
- 320 / 375 / 390 / 412 / 430 / 768 / 1024 / 1280 / 1440px と、スマホ横向き（667・844・915・932px）、iPad縦（1024×1366）
- ノッチ・ホームバー（セーフエリア）の余白を再現した状態で、ヘッダー・下部ナビ・詳細画面が重ならないこと
