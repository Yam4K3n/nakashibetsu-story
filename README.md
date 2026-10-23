# 中標津浦島物語 — 公式サイト

GitHub Pages で公開する静的サイトです（HTML / CSS / JavaScript のみ。ビルド不要）。

## フォルダ構成

```
index.html            トップページ（構造・SEO・OGP）
check.html            公開前チェック（公開URLで開くと設定を自動確認。検索結果には出ません）
MEDIA-GUIDE.md        写真・動画の差し替えガイド（初心者向け）
PUBLISH-CHECKLIST.md  公開前に用意するもののチェックリスト
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

## 最初に1回だけ：公開URLを設定する

このサイトは公開URLを `https://woyatsu.github.io/nakashibetsu-story/` と仮定しています。
公開後に **`（公開URL）/check.html`** を開くと、実際のURLと一致しているかを自動で確認し、違う場合は正しいURLを表示します。
リポジトリ名が違う場合は、次のファイルの URL を置き換えてください。

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

GitHub Pagesと同じ「/nakashibetsu-story/」配下での配信を再現し、Chromiumで自動チェックしました。

- 全ファイルの読み込み（404なし）、JavaScriptエラーなし
- EP.01 根室中標津空港 / EP.02 ミルクロード / EP.03 開陽台 の登録と表示順（新しい順）
- 30話に増やした場合も、トップページは最新4本のみ・「すべてのエピソード」で全30話とカテゴリ絞り込みが動くこと
- エピソード詳細・スポット詳細・全話一覧の開閉（CLOSE・Esc・ブラウザの戻る）、相互リンク、URL直接指定
- 詳細画面を閉じたあと、スマホ下部ナビが再表示されること（CLOSE・Esc・戻る・「概略図で見る」の各経路）
- 観光情報：未入力の項目は表示されず、入力済みの項目だけが並ぶこと
- マップのピン・スポット一覧・Googleマップリンク、カテゴリ絞り込み、メニュー
- 幅 320 / 375 / 390 / 430 / 768px で横はみ出しなし、ポスターの縦書きタイトルが枠内に収まること
- 「動きを減らす」設定での表示、動画・写真の差し替えと読み込み失敗時の自動切り替え
- check.html：URLが一致する場合はOK、違う場合は要修正と正しいURLを表示すること
