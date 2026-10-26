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
  /* 制作中の確認用ラベル（「仮テキスト」「仮イメージ」など）を表示するか。公開中は false */
  showDraftLabels: false,

  /* トップページに表示するエピソードの本数（それ以外は「すべてのエピソードを見る」から） */
  homeEpisodes: 4,

  /* SNS・フォーム */
  links: {
    tiktok: "https://www.tiktok.com/@nakashibetsu_story",
    instagram: "https://www.instagram.com/nakashibetsu_story/",
    form: "",      // 情報提供フォーム（Googleフォーム等）のURL。空欄の間はボタン自体を表示しません
    contact: ""    // お問い合わせ先のURL。空欄の間はフッターの Contact を表示しません
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
  /* ---------- エピソード（古い順に並べる） ----------
     copy  : メインコピー（詳細画面とトップのカードに大きく表示。「」は不要）
     lead  : 紹介文（あらすじ）
     ※ 紹介文は暫定の掲載案です。ここを書き換えるだけでサイト全体に反映されます。
     tiktok / instagram : その回の個別投稿URL（空欄の間はアカウントページが開きます）
  */
  episodes: [
    {
      id: "ep-01", no: "01",
      title: "根室中標津空港", titleEn: "ARRIVAL",
      category: "RETURN", categoryJa: "帰ってくる",
      copy: "物語は、ここから始まる。",
      lead: "10年ぶりに降り立った故郷。懐かしいはずの場所から、まだ知らない中標津を探す旅が始まる。",
      draft: false,         // 文章が仮置きの場合は true（「仮テキスト」ラベルが付きます）
      image: "",            // ポスター用の写真（縦長 4:5 推奨）例: "assets/img/episodes/ep-01.jpg"
      scene: "airport",     // 写真が無い間の仮ビジュアル
      tiktok: "https://www.tiktok.com/@nakashibetsu_story/video/7691546741308443924",
      instagram: "https://www.instagram.com/reel/Dd764AyTPXG/",
      published: "",        // 公開日 例: "2026-10-01"（空欄なら表示しません）
      places: ["airport"]
    },
    {
      id: "ep-02", no: "02",
      title: "ミルクロード", titleEn: "MILK ROAD",
      category: "FIND", categoryJa: "違いを探す",
      copy: "この道は、どこまで続くんだろう。",
      lead: "どこまでもまっすぐに伸びるミルクロード。見慣れたはずの景色が、10年という時間を経て、少し違って見えた。",
      draft: false,
      image: "",
      scene: "road",
      tiktok: "https://www.tiktok.com/@nakashibetsu_story/video/7692364849640131860",
      instagram: "https://www.instagram.com/reel/DeB66Atzu2_/",
      published: "",
      places: ["milk-road"]
    },
    {
      id: "ep-03", no: "03",
      title: "開陽台", titleEn: "KAIYODAI",
      category: "FIND", categoryJa: "違いを探す",
      copy: "変わらない景色に、変わった自分がいた。",
      lead: "目の前に広がる開陽台の大パノラマ。あの頃と同じ景色を、今の自分はどう感じるのだろう。",
      draft: false,
      image: "",
      scene: "panorama",
      tiktok: "https://www.tiktok.com/@nakashibetsu_story/video/7693161377418038534",
      instagram: "https://www.instagram.com/reel/DeHOjtKTYFS/",
      published: "",
      places: ["kaiyodai"]
    },
    {
      id: "ep-04", no: "04",
      title: "ラ・キンコ", titleEn: "",   // titleEn：英語表記（未定なら空欄のままでOK）
      category: "MEET", categoryJa: "人に会う",   // カテゴリは仮（変更可）
      copy: "あの味は、まだここにあった。",
      lead: "故郷で再び訪れたラ・キンコ。懐かしさと新しい発見が交差する、思い出の一皿。",
      draft: false,
      image: "",
      scene: "town",
      tiktok: "https://www.tiktok.com/@nakashibetsu_story/video/7694579820864392468",
      instagram: "https://www.instagram.com/reel/DeRlw7PT_5q/",
      published: "",
      places: ["la-kinko"]
    },
    {
      id: "ep-05", no: "05",
      title: "夢みるケーキ屋 ポルテ", titleEn: "",   // titleEn：英語表記（未定なら空欄のままでOK）
      category: "MEET", categoryJa: "人に会う",   // カテゴリは仮（変更可）
      copy: "選べない幸せが、ここにある。",
      lead: "ショーケースに並ぶ、色とりどりのケーキたち。どれにしようか迷う時間さえ楽しい。ポルテで見つけた、小さな幸せ。",
      draft: false,
      image: "",
      scene: "cafe",
      tiktok: "https://www.tiktok.com/@nakashibetsu_story/video/7697191292333214996",
      instagram: "https://www.instagram.com/reel/DejMiCCzt5l/",
      published: "",
      places: ["porte"]
    },
    {
      id: "ep-06", no: "06",
      title: "らー麺 たら福", titleEn: "",   // titleEn：英語表記（未定なら空欄のままでOK）
      category: "MEET", categoryJa: "人に会う",   // カテゴリは仮（変更可）
      copy: "変わらない一杯に、会いに行く。",
      lead: "故郷で味わう、らー麺 たら福の一杯。湯気の向こうに広がる、また食べたくなる味。",
      draft: false,
      image: "",
      scene: "food",
      tiktok: "https://www.tiktok.com/@nakashibetsu_story/video/7698307003323567380",
      instagram: "https://www.instagram.com/reel/Deq8LDQT4Kw/",
      published: "",
      places: ["tarafuku"]
    },
    {
      id: "ep-07", no: "07",
      title: "GLOW -Amusement Bar-", titleEn: "GLOW -AMUSEMENT BAR-",
      posterTitle: "GLOW",   // ポスターの縦書きタイトル（長い名前を短く見せたいときだけ指定）
      category: "MEET", categoryJa: "人に会う",   // カテゴリは仮（変更可）
      copy: "この街の夜は、まだまだ面白い。",
      lead: "豊富なボードゲームと、気軽に遊べる驚きの価格。GLOWで出会った、中標津の夜の新しい楽しみ方。",
      draft: false,
      image: "",
      scene: "shelf",
      tiktok: "https://www.tiktok.com/@nakashibetsu_story/video/7699788500802997525",
      instagram: "https://www.instagram.com/reel/De1NtArT_mv/",
      published: "",
      places: ["glow"]
    }
  ],

  /* ---------- スポット ----------
     下の観光情報は「確認できたものだけ」記入してください。null や空欄の項目はサイトに表示されません。
       address  所在地      hours   営業時間（改行は \n）  closed  定休日
       price    料金        access  アクセス              parking 駐車場     phone 電話番号
       official 公式サイトURL（officialLabel で表示名を変更可）
       sns 公式SNSのURL（snsLabel で表示名を変更可）   ref 参考にした情報源（表示しません）
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
      address: "北海道標津郡中標津町北中16番地9",
      hours: null, closed: null, price: null, access: null, parking: null, phone: null,
      official: "https://www.nakashibetsu-airport.jp/",
      sns: null,
      ref: null,   // 参考にした情報源（サイトには表示しません）
      checkedAt: null,
      mapQuery: "根室中標津空港 北海道標津郡中標津町北中16番地9",
      lat: null, lng: null,   // 座標は未確認のため空欄（Googleマップは mapQuery で検索）
      schematic: [44, 72]
    },
    {
      id: "milk-road", no: "02",
      name: "ミルクロード", nameEn: "Milk Road",
      cat: "NATURE", scene: "road", image: "",
      desc: "牧草地のあいだを延びる道。EP.02の舞台になりました。",
      draft: true,
      address: "北海道標津郡中標津町字開陽・町道北19号道路",   // 道路のため番地はありません
      hours: null, closed: null, price: null, access: null, parking: null, phone: null,
      official: null,
      sns: null,
      ref: "https://kaiyoudai.jp/index.php/sightseeing/spot/milk_road/",   // 参考にした情報源（サイトには表示しません）
      checkedAt: null,
      mapQuery: "中標津 ミルクロード 開陽 北19号道路",
      lat: null, lng: null,   // 座標は未確認のため空欄（Googleマップは mapQuery で検索）
      schematic: [33, 32]
    },
    {
      id: "kaiyodai", no: "03",
      name: "開陽台", nameEn: "Kaiyodai",
      cat: "NATURE", scene: "panorama", image: "",
      desc: "牧草地と防風林が地平線まで続く景色を見渡せる展望台。",
      draft: true,
      address: "北海道標津郡中標津町俣落2256番地17",
      hours: null, closed: null, price: null, access: null, parking: null, phone: null,
      official: "https://nakashibetsu.jp/kankou/kankou_jouhou/kaiyoudai/", officialLabel: "中標津町 観光情報",
      sns: null,
      ref: null,   // 参考にした情報源（サイトには表示しません）
      checkedAt: null,
      mapQuery: "開陽台展望館 北海道中標津町俣落2256-17",
      lat: null, lng: null,   // 座標は未確認のため空欄（Googleマップは mapQuery で検索）
      schematic: [26, 17]
    },
    {
      id: "la-kinko", no: "04",
      name: "ラ・キンコ", nameEn: "",
      cat: "FOOD", scene: "town", image: "",
      desc: "EP.04の舞台になったお店。",
      draft: true,
      address: "北海道標津郡中標津町西3条北2丁目1",
      hours: null, closed: null, price: null, access: null, parking: null, phone: null,
      official: null,
      sns: "https://www.instagram.com/la_kinko__/", snsLabel: "Instagram",
      ref: "https://kaiyoudai.jp/index.php/restaurant/gourmet-la-kinko/",   // 参考にした情報源（サイトには表示しません）
      checkedAt: null,
      mapQuery: "ラ・キンコ 中標津 西3条北2丁目1",
      lat: null, lng: null,   // 座標は未確認のため空欄（Googleマップは mapQuery で検索）
      schematic: [44, 45]
    },
    {
      id: "porte", no: "05",
      name: "夢みるケーキ屋 ポルテ", nameEn: "",
      cat: "FOOD", scene: "cafe", image: "",
      desc: "EP.05の舞台になったお店。",
      draft: true,
      address: "北海道標津郡中標津町大通南2丁目1-1",
      hours: null, closed: null, price: null, access: null, parking: null, phone: null,
      official: "https://www.portecake.com/",
      sns: null,
      ref: null,   // 参考にした情報源（サイトには表示しません）
      checkedAt: null,
      mapQuery: "夢みるケーキ屋 ポルテ 中標津 大通南2丁目1-1",
      lat: null, lng: null,   // 座標は未確認のため空欄（Googleマップは mapQuery で検索）
      schematic: [60, 42]
    },
    {
      id: "tarafuku", no: "06",
      name: "らー麺 たら福", nameEn: "",
      cat: "FOOD", scene: "food", image: "",
      desc: "EP.06の舞台になったお店。",
      draft: true,
      address: "北海道標津郡中標津町西7条南1丁目",   // 番地は未確認（推測で補完しない）
      hours: null, closed: null, price: null, access: null, parking: null, phone: null,
      official: null,
      sns: null,
      ref: "https://nakashibetsu-inshokugyo.com/navigation_meshi/",   // 参考にした情報源（サイトには表示しません）
      checkedAt: null,
      mapQuery: "らー麺 たら福 中標津 西7条南1丁目",
      lat: null, lng: null,   // 座標は未確認のため空欄（Googleマップは mapQuery で検索）
      schematic: [54, 57]
    },
    {
      id: "glow", no: "07",
      name: "GLOW -Amusement Bar-", nameEn: "",
      cat: "FOOD", scene: "shelf", image: "",
      desc: "EP.07の舞台になったお店。",
      draft: true,
      address: "北海道標津郡中標津町大通北2丁目1番地 MYビル1階中央",   // MYビルの表記は公開前に店舗へ最終確認を推奨
      hours: null, closed: null, price: null, access: null, parking: null, phone: null,
      official: null,
      sns: null,
      ref: "https://bodoge.hoobby.net/spaces/glow/access",   // 参考にした情報源（サイトには表示しません）
      checkedAt: null,
      mapQuery: "GLOW Amusement Bar 中標津 大通北2丁目1 MYビル",
      lat: null, lng: null,   // 座標は未確認のため空欄（Googleマップは mapQuery で検索）
      schematic: [67, 55]
    }
  ]
};
