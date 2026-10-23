/* =========================================================
   SITE DATA — このファイルを編集するだけで、サイトの内容を更新できます
   ---------------------------------------------------------
   ■ エピソードを追加する
     episodes の末尾に { ... } を1つ追加。no は "04" のように2桁。
     places に、そのエピソードに登場するスポットの id を並べると相互リンクされます。
   ■ スポットを追加する
     places に追加。確認できていない情報は null のまま（画面には「確認中」と表示）。
   ■ 写真・動画を差し替える
     assets/img/ や assets/video/ にファイルを置き、image / media のパスを書き換えるだけ。
     空欄の間は、シーンごとの仮ビジュアルが自動で表示されます。
   ========================================================= */
const SITE = {
  /* 仮の文章・仮の画像に「仮テキスト」「仮画像」ラベルを表示する（本番の内容がそろったら false に） */
  showDraftLabels: true,

  /* トップページに表示するエピソードの本数（それ以外は「すべてのエピソードを見る」から） */
  homeEpisodes: 4,

  /* SNS・フォーム */
  links: {
    tiktok: "https://www.tiktok.com/@nakashibetsu_story",
    instagram: "https://www.instagram.com/nakashibetsu_story/",
    form: "",      // 情報提供フォーム（Googleフォーム等）のURL。空欄の間は「準備中」表示
    contact: ""    // お問い合わせ先のURL。空欄の間は「準備中」表示（Instagram DMを案内）
  },

  /* ページ固定の写真・映像（パスを入れるだけで差し替わります） */
  media: {
    hero: {
      video: "",          // 例: "assets/video/hero.mp4"（横長・無音・10〜20秒・5MB程度が目安）
      videoMobile: "",    // 例: "assets/video/hero-sp.mp4"（縦長。空欄ならPC用を使用）
      poster: "",         // 例: "assets/img/hero.jpg"（動画読み込み前・省データ時に表示）
      alt: "中標津の一本道に立つ主人公"
    },
    "prologue-portrait": { src: "", alt: "" },   // 例: "assets/img/prologue-portrait.jpg"（縦長 3:4）
    "prologue-wide":     { src: "", alt: "" },   // 例: "assets/img/prologue-wide.jpg"（横長 2.39:1）
    "about":             { src: "", alt: "" }    // 例: "assets/img/about.jpg"（縦長 2:3）
  },

  categories: [
    { id: "ALL",      en: "ALL",          ja: "すべて" },
    { id: "FOOD",     en: "FOOD & DRINK", ja: "食べる・飲む" },
    { id: "NATURE",   en: "NATURE",       ja: "自然・風景" },
    { id: "CULTURE",  en: "CULTURE",      ja: "カルチャー" },
    { id: "ACTIVITY", en: "ACTIVITY",     ja: "体験" },
    { id: "LOCAL",    en: "LOCAL SPOTS",  ja: "まちの場所" }
  ],

  /* ---------- エピソード（古い順に並べる） ---------- */
  episodes: [
    {
      id: "ep-01", no: "01",
      title: "根室中標津空港", titleEn: "ARRIVAL",
      category: "RETURN", categoryJa: "帰ってくる",
      lead: "10年ぶりの帰郷。物語は、根室中標津空港から始まる。",
      draft: true,          // 紹介文が仮の場合は true（「仮テキスト」ラベルが付きます）
      image: "",            // ポスター用の写真（縦長 4:5 推奨）例: "assets/img/episodes/ep-01.jpg"
      scene: "airport",     // 写真が無い間の仮ビジュアル
      tiktok: "",           // 投稿のURL。空欄ならアカウントページへ
      instagram: "",
      published: "",        // 公開日 例: "2026-10-01"
      places: ["airport"]
    },
    {
      id: "ep-02", no: "02",
      title: "ミルクロード", titleEn: "MILK ROAD",
      category: "FIND", categoryJa: "違いを探す",
      lead: "牧草地のあいだを延びる一本道へ。変わったものと、変わらなかったもの。",
      draft: true,
      image: "", scene: "road",
      tiktok: "", instagram: "", published: "",
      places: ["milk-road"]
    },
    {
      id: "ep-03", no: "03",
      title: "開陽台", titleEn: "KAIYODAI",
      category: "FIND", categoryJa: "違いを探す",
      lead: "地平線まで続く景色を、もう一度見に行く。",
      draft: true,
      image: "", scene: "panorama",
      tiktok: "", instagram: "", published: "",
      places: ["kaiyodai"]
    },
    {
      id: "ep-04", no: "04",
      title: "ラ・キンコ", titleEn: "",   // titleEn：英語表記（未定なら空欄のままでOK）
      category: "MEET", categoryJa: "人に会う",   // カテゴリは仮（変更可）
      lead: "EP.04の舞台は「ラ・キンコ」。",
      draft: true,
      image: "", scene: "town",
      tiktok: "", instagram: "", published: "",
      places: ["la-kinko"]
    },
    {
      id: "ep-05", no: "05",
      title: "夢みるケーキ屋 ポルテ", titleEn: "",   // titleEn：英語表記（未定なら空欄のままでOK）
      category: "MEET", categoryJa: "人に会う",   // カテゴリは仮（変更可）
      lead: "EP.05の舞台は「夢みるケーキ屋 ポルテ」。",
      draft: true,
      image: "", scene: "cafe",
      tiktok: "", instagram: "", published: "",
      places: ["porte"]
    },
    {
      id: "ep-06", no: "06",
      title: "らー麺 たら福", titleEn: "",   // titleEn：英語表記（未定なら空欄のままでOK）
      category: "MEET", categoryJa: "人に会う",   // カテゴリは仮（変更可）
      lead: "EP.06の舞台は「らー麺 たら福」。",
      draft: true,
      image: "", scene: "food",
      tiktok: "", instagram: "", published: "",
      places: ["tarafuku"]
    },
    {
      id: "ep-07", no: "07",
      title: "GLOW -Amusement Bar-", titleEn: "GLOW -AMUSEMENT BAR-",
      posterTitle: "GLOW",   // ポスターの縦書きタイトル（長い名前を短く見せたいときだけ指定）
      category: "MEET", categoryJa: "人に会う",   // カテゴリは仮（変更可）
      lead: "EP.07の舞台は「GLOW -Amusement Bar-」。",
      draft: true,
      image: "", scene: "shelf",
      tiktok: "", instagram: "", published: "",
      places: ["glow"]
    }
  ],

  /* ---------- スポット ----------
     下の観光情報は「確認できたものだけ」記入してください。null や空欄の項目はサイトに表示されません。
       address  所在地      hours   営業時間（改行は \n）  closed  定休日
       price    料金        access  アクセス              parking 駐車場     phone 電話番号
       official 公式サイトURL    sns 公式SNSのURL
       checkedAt 情報を確認した日（例: "2026-11-01"）→「◯◯時点の情報」と表示されます
     mapQuery : Googleマップで検索する語句（施設名など）
     lat, lng : 確認済みの座標。入れるとGoogleマップでピンポイント表示になります
     schematic: 概略図上の表示位置 [横%, 縦%]（演出用。実際の位置ではありません）
  */
  places: [
    {
      id: "airport", no: "01",
      name: "根室中標津空港", nameEn: "Nemuro Nakashibetsu Airport",
      cat: "LOCAL", scene: "airport",
      image: "",            // 例: "assets/img/places/airport.jpg"（横長 16:10 推奨）
      desc: "物語のはじまりの場所。主人公が10年ぶりに故郷へ降り立った、空の玄関口。",
      draft: true,          // 説明文が仮の場合は true
      address: null, hours: null, closed: null, price: null,
      access: null, parking: null, phone: null, official: null, sns: null, checkedAt: null,
      mapQuery: "根室中標津空港", lat: null, lng: null,
      schematic: [44, 72]
    },
    {
      id: "milk-road", no: "02",
      name: "ミルクロード", nameEn: "Milk Road",
      cat: "NATURE", scene: "road", image: "",
      desc: "牧草地のあいだを延びる道。EP.02の舞台になりました。",
      draft: true,
      address: null, hours: null, closed: null, price: null,
      access: null, parking: null, phone: null, official: null, sns: null, checkedAt: null,
      mapQuery: "ミルクロード 中標津", lat: null, lng: null,
      schematic: [33, 32]
    },
    {
      id: "kaiyodai", no: "03",
      name: "開陽台", nameEn: "Kaiyodai",
      cat: "NATURE", scene: "panorama", image: "",
      desc: "牧草地と防風林が地平線まで続く景色を見渡せる展望台。",
      draft: true,
      address: null, hours: null, closed: null, price: null,
      access: null, parking: null, phone: null, official: null, sns: null, checkedAt: null,
      mapQuery: "開陽台", lat: null, lng: null,
      schematic: [26, 17]
    },
    {
      id: "la-kinko", no: "04",
      name: "ラ・キンコ", nameEn: "",
      cat: "FOOD", scene: "town", image: "",
      desc: "EP.04の舞台になったお店。",
      draft: true,
      address: null, hours: null, closed: null, price: null,
      access: null, parking: null, phone: null, official: null, sns: null, checkedAt: null,
      mapQuery: "ラ・キンコ 中標津", lat: null, lng: null,
      schematic: [44, 45]
    },
    {
      id: "porte", no: "05",
      name: "夢みるケーキ屋 ポルテ", nameEn: "",
      cat: "FOOD", scene: "cafe", image: "",
      desc: "EP.05の舞台になったお店。",
      draft: true,
      address: null, hours: null, closed: null, price: null,
      access: null, parking: null, phone: null, official: null, sns: null, checkedAt: null,
      mapQuery: "夢みるケーキ屋 ポルテ 中標津", lat: null, lng: null,
      schematic: [60, 42]
    },
    {
      id: "tarafuku", no: "06",
      name: "らー麺 たら福", nameEn: "",
      cat: "FOOD", scene: "food", image: "",
      desc: "EP.06の舞台になったお店。",
      draft: true,
      address: null, hours: null, closed: null, price: null,
      access: null, parking: null, phone: null, official: null, sns: null, checkedAt: null,
      mapQuery: "らー麺 たら福 中標津", lat: null, lng: null,
      schematic: [54, 57]
    },
    {
      id: "glow", no: "07",
      name: "GLOW -Amusement Bar-", nameEn: "",
      cat: "FOOD", scene: "shelf", image: "",
      desc: "EP.07の舞台になったお店。",
      draft: true,
      address: null, hours: null, closed: null, price: null,
      access: null, parking: null, phone: null, official: null, sns: null, checkedAt: null,
      mapQuery: "GLOW -Amusement Bar- 中標津", lat: null, lng: null,
      schematic: [67, 55]
    }
  ]
};
