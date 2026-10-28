# 中標津浦島物語 — 公式サイト

GitHub Pages で公開する静的サイトです（HTML / CSS / JavaScript のみ。ビルド不要）。

## フォルダ構成

```
index.html            トップページ（構造・SEO・OGP）
check.html            公開前チェック（公開URLで開くと設定を自動確認。検索結果には出ません）
MEDIA-GUIDE.md        写真・動画の差し替えガイド（初心者向け）
PUBLISH-CHECKLIST.md  公開前に用意するもののチェックリスト
DEVICE-CHECK.md       動作確認の結果と、実機での確認手順
PHOTO-CREDITS.md      第三者の写真の出典・ライセンス・加工内容の記録（写真を差し替えるときは更新）
404.html              見つからないページ
robots.txt / sitemap.xml
assets/
  css/style.css       デザイン
  js/data.js          ★ エピソード・スポット・SNS・写真/動画の設定（普段はここだけ編集）
  js/main.js          動作（通常は編集不要）
  img/                写真（ogp.jpg / favicon.svg / apple-touch-icon.png を含む）
    episodes/         エピソードのポスター写真（例: ep-01.jpg）
    places/           スポットの写真（例: kaiyodai.jpg）
    media/            PROLOGUE・ABOUT の写真
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
  copy: "（メインコピー。「」は不要）",
  lead: "（2〜3行の紹介文）",
  image: "assets/img/ep-04.jpg",              // ポスター写真（縦長がおすすめ）
  scene: "road",                              // 写真が無い間の仮ビジュアル
  tiktok: "https://www.tiktok.com/@nakashibetsu_story/video/...",  // 投稿URL
  instagram: "https://www.instagram.com/p/...",
  published: "2026-11-01",
  places: ["spot-id"]                         // 登場スポットの id
}
```

- `copy`（メインコピー）は詳細画面・トップのカード・全話一覧に「」付きで表示されます。空欄なら表示しません。
- `tiktok` / `instagram` にはその回の**個別投稿URL**を入れます（空欄の間はアカウントページが開きます）。公開後に check.html を開くと、URLの形式・重複・話数順を自動で確認できます。
- `places` にスポットの id を書くと、エピソード ⇔ スポットが自動で相互リンクされます。
- エピソード詳細は `index.html#ep-04` のURLで直接開けます（SNSのプロフィールリンクなどに使えます）。
- トップページには最新の **4本** だけが表示されます（`homeEpisodes` で変更可）。全話は「すべてのエピソードを見る」（`index.html#episodes`）から、カテゴリ別に見られます。何十本に増えてもトップページの長さは変わりません。

## スポットを追加する

`places` に追加します。**確認できていない情報は `null` のまま**にしてください。未入力の項目は画面に表示されず、確認できた情報だけが並びます。所在地（`address`）のすぐ下には「Googleマップで開く」が自動で付きます（`mapQuery` の語句で検索）。

| 項目 | 内容 |
|---|---|
| `address` / `hours` / `closed` / `price` | 所在地・営業時間・定休日・料金 |
| `access` / `parking` / `phone` | アクセス・駐車場・電話番号 |
| `official` / `sns` | 公式サイト・公式SNSのURL（`officialLabel` / `snsLabel` で表示名を変更可） |
| `ref` | 参考にした情報源のURL（サイトには表示しません） |
| `checkedAt` | 情報を確認した日（例: `"2026-11-01"`）。「◯時点の情報」と表示 |
| `mapQuery` | Googleマップで検索する語句（施設名など） |
| `lat`, `lng` | 確認済みの座標。入れるとGoogleマップでその地点が開きます |
| `schematic` | サイト内の概略図での表示位置 `[横%, 縦%]`（演出用で、実際の位置ではありません） |
| `desc` | スポットの紹介文（エピソードの紹介文とは別）。`\n` で段落を区切ると、スポット詳細では段落ごとに表示、一覧カードとマップのパネルでは1段落目を表示 |
| `cat` | `FOOD` / `NATURE` / `CULTURE` / `ACTIVITY` / `LOCAL` |

スポット詳細は `index.html#spot-（id）` で直接開けます。

## 写真・動画を差し替える

**詳しい手順（サイズ・形式・保存先・書き方）は `MEDIA-GUIDE.md` にまとめています。** 概要は次のとおりです。

1. `assets/img/` や `assets/video/` にファイルをアップロード
2. `data.js` の該当箇所にパスを書く

- ファーストビュー動画：`media.hero.video`（PC用・横長）、`media.hero.videoMobile`（スマホ用・縦長）、`media.hero.poster`（読み込み前に出る静止画）
  - 目安：無音・10〜20秒・mp4（H.264）・5MB前後。動きを減らす設定や省データ設定の端末では静止画を表示します。
- そのほかの写真：`media` の各項目、各エピソード・スポットの `image`（`imageAlt` に写真の説明、`imageKeep` に看板など欠けてはいけない範囲）
- 写真の読み込みに失敗した場合は、自動で仮ビジュアルに戻ります。

## 演出用ビジュアルについて

- 写真が未設定の場所には、シーンごとの演出用ビジュアル（Canvasで描いた絵）が表示されます。フッターに「サイト内には演出用ビジュアルが含まれます」と記載しています。
- 公開中は `data.js` の `showDraftLabels` を `false` にしています（「仮テキスト」「仮イメージ」などの制作中ラベルを出さない設定）。制作中の確認でラベルを見たいときだけ `true` にしてください。
- 写真を `image` に設定すると、その場所は写真に置き換わります。

## SNS・フォーム

`links` に設定します。`form`（情報提供フォーム）と `contact`（お問い合わせ）は、URLを入れたときだけボタンが表示されます（未設定の間は表示しません）。

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
- （2026-10-24）全7話の個別投稿URL・メインコピー・紹介文の表示、各話の「TikTok／Instagramで動画を見る」がその回の投稿を新しいタブで開くこと
- （2026-10-28）PROLOGUE（帰郷の日・格子状防風林）と ABOUT（冬）に写真を反映。看板・防風林・冬の木立が全画面幅で欠けないこと、フッターの PHOTO CREDITS（リンク3件）、ABOUT の写真枠を 2:3 → 3:4 に変更（ほかの写真・テキスト・デザインは変更なし）
- （2026-10-28）EP.07 GLOW の店内写真：スクリーンの映像面だけを判別できないよう加工（ほかの写真は変更なし）
- （2026-10-27）EP.01〜07 の撮影写真（色調補正・WebP）を、エピソード一覧・全話一覧・エピソード詳細・スポット一覧・スポット詳細・マップのパネルに反映。取り違え・看板の欠け・文字との重なり・はみ出しを全画面幅で確認
- （2026-10-27）EP.01〜03 のスポット紹介文を更新し、全7スポットで同じ表示（一覧・マップは最初の一文、詳細は段落ごと）
- （2026-10-26）EP.04〜07 の店舗スポット紹介文（段落表示・文節での改行）、エピソード紹介文は変更なし
- （2026-10-26）制作中の仮表示がどの画面にも残っていないこと、全7スポットの所在地とGoogleマップ検索リンク、未設定のフォーム／Contactを非表示
- （2026-10-24）横スクロールの帯（PLACESカテゴリ／マップのスポット／ALL STORIESカテゴリ）：横スワイプ中に縦がぐらつかないこと、帯の上からでも縦にページをスクロールできること、慣性スクロール、タップでの切り替え
