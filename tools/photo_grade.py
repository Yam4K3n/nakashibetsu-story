#!/usr/bin/env python3
"""中標津浦島物語 — 全10話の写真を「CINEMATIC × NOSTALGIC × EMOTIONAL」の色調にそろえる

写真の内容（被写体・建物・看板・文字・構図）は変更しない。行うのは色・明暗・粒子と、
既存と同じ位置での切り抜き（エピソード用 4:5）と縮小だけ。

共通の処理（強さは写真の種類ごとに調整）
  1. 明るすぎる部分をなだらかに抑える（ハイライトの肩）／暗部を少し沈めて奥行きを出す
  2. 控えめなS字コントラスト
  3. 彩度を少し落ち着かせる。極端に鮮やかな色ほど強めに抑える（ディテールは残す）
  4. 青空：美しさは残し、わずかにシアン寄り・落ち着いた映画的な青へ
     緑：黄緑を深緑寄りに、明るさと彩度を少し落とす
     暖色（照明・紅葉・れんが）：色相はそのまま、温かさを維持
  5. フィルムの色かぶり：暗部はわずかに青緑、明部はわずかにクリーム
  6. うっすらとしたフィルムグレイン（固定シードで再現可能）

プロファイル
  nature … 自然・屋外風景（開放感を残す）
  shop   … 飲食店の外観・看板（温かさを残す）
  night  … 夜の店内（GLOW。照明・ネオンの美しさを残す）
  film   … EP.08〜10 の写真（すでにフィルム調の加工があるため、同じ方向へ軽めに）
"""
import numpy as np
from PIL import Image, ImageFilter

PROFILES = {
    # knee/white：ハイライトの肩と白の上限  toe：暗部の沈み  s：S字  sat：彩度  sk/sr：極彩度の圧縮（sk を超えた分を sr 倍）
    # blue/green/tone：青・緑・分割トーンの効き  grain：粒子
    "nature": dict(knee=0.70, white=0.965, toe=0.20, s=0.22, sat=0.97, sk=0.70, sr=0.55, blue=1.0, green=1.0, tone=1.0, grain=0.008),
    "shop":   dict(knee=0.72, white=0.97,  toe=0.16, s=0.18, sat=0.97, sk=0.72, sr=0.60, blue=0.8, green=0.8, tone=0.8, grain=0.007),
    "night":  dict(knee=0.78, white=0.98,  toe=0.10, s=0.10, sat=0.98, sk=0.80, sr=0.70, blue=0.4, green=0.5, tone=0.6, grain=0.007),
    "film":   dict(knee=0.72, white=0.965, toe=0.06, s=0.04, sat=0.97, sk=0.78, sr=0.65, blue=0.6, green=0.7, tone=0.7, grain=0.005),
}

def rgb2hsv(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx = a.max(-1); mn = a.min(-1); d = mx - mn
    h = np.zeros_like(mx)
    m = d > 1e-6
    rc = np.where(m, (mx - r) / np.where(m, d, 1), 0); gc = np.where(m, (mx - g) / np.where(m, d, 1), 0); bc = np.where(m, (mx - b) / np.where(m, d, 1), 0)
    h = np.where(r == mx, bc - gc, np.where(g == mx, 2.0 + rc - bc, 4.0 + gc - rc))
    h = (h / 6.0) % 1.0; h = np.where(m, h, 0)
    s = np.where(mx > 1e-6, d / np.where(mx > 1e-6, mx, 1), 0)
    return h, s, mx

def hsv2rgb(h, s, v):
    i = np.floor(h * 6.0); f = h * 6.0 - i; i = i.astype(int) % 6
    p = v * (1 - s); q = v * (1 - s * f); t = v * (1 - s * (1 - f))
    r = np.choose(i, [v, q, p, p, t, v]); g = np.choose(i, [t, v, v, q, p, p]); b = np.choose(i, [p, p, t, v, v, q])
    return np.stack([r, g, b], -1)

def hue_w(h, center, width):
    d = np.abs(((h - center / 360.0) + 0.5) % 1.0 - 0.5) * 360.0
    return np.exp(-(d / width) ** 2)

def tone(L, P):
    k, w, toe, s = P["knee"], P["white"], P["toe"], P["s"]
    # ハイライトの肩：k より上をなだらかに圧縮し、白を w に
    c = 1.8
    hi = k + (w - k) * (1 - np.exp(-(L - k) / (1 - k) * c)) / (1 - np.exp(-c))
    y = np.where(L > k, hi, L)
    # 暗部を少し沈める（0.3 未満）
    y = np.where(y < 0.3, y * (np.clip(y, 1e-4, 1) / 0.3) ** toe, y)
    # 控えめなS字（中間 0.45 付近を中心）
    y = y + s * (y - 0.45) * (1 - np.abs(2 * y - 0.9).clip(0, 1)) * 0.5
    return np.clip(y, 0, 1)

def grade(im, profile, seed=1):
    P = PROFILES[profile]
    a = np.asarray(im.convert("RGB"), np.float32) / 255.0
    L = a @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    L2 = tone(L, P)
    ratio = L2 / np.maximum(L, 1e-4)
    a = a * ratio[..., None]
    # 明部で色が飛ばないよう、はみ出した分は白へなだらかに寄せる
    over = a.max(-1, keepdims=True)
    a = np.where(over > 1, a / np.maximum(over, 1), a)

    h, s, v = rgb2hsv(np.clip(a, 0, 1))
    # 色ごとの調整量は、ノイズに反応してまだらにならないよう、少しぼかした写真の色から決める
    _im = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)); _w, _h = _im.size
    blur = np.asarray(_im.resize((max(1, _w // 8), max(1, _h // 8)), Image.BOX).filter(ImageFilter.GaussianBlur(3)).resize((_w, _h), Image.BILINEAR), np.float32) / 255.0
    hb, sb, vb = rgb2hsv(blur)
    satw = np.clip((sb - 0.04) / 0.30, 0, 1)        # ほぼ無彩色（白い雲・灰色の路面）には効かせない
    # 彩度：全体を少し落ち着かせ、極端に鮮やかな色ほど強めに抑える
    s = s * P["sat"]
    s = np.where(s > P["sk"], P["sk"] + (s - P["sk"]) * P["sr"], s)
    # 青空（190〜245°）：少しシアン寄り・彩度と明るさを少し抑える
    wb = hue_w(hb, 218, 26) * satw * P["blue"]
    h = (h - wb * (4 / 360.0)) % 1.0
    s = s * (1 - 0.06 * wb); v = v * (1 - 0.04 * wb)
    # 緑・黄緑（70〜150°）：深緑寄りへ（色相を少し青側、明るさ・彩度を少し下げる）
    wg = hue_w(hb, 100, 28) * satw * P["green"]
    h = (h + wg * (6 / 360.0)) % 1.0
    s = s * (1 - 0.14 * wg); v = v * (1 - 0.08 * wg)
    a = hsv2rgb(h, np.clip(s, 0, 1), np.clip(v, 0, 1))

    # 分割トーン（暗部：わずかに青緑／明部：わずかにクリーム）
    L = a @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    t = P["tone"]
    a = a + t * (np.array([-0.014, 0.004, 0.012], np.float32) * ((1 - L) ** 2)[..., None]
                 + np.array([0.012, 0.006, -0.010], np.float32) * (L ** 2)[..., None])
    # フィルムの黒（ごくわずかに持ち上げる）
    a = 0.008 + a * (1 - 0.008)

    # うっすらとしたフィルムグレイン（明るさの粒子のみ。少しだけぼかして粒子感を柔らかく）
    rng = np.random.default_rng(seed)
    H, W = L.shape
    g = rng.normal(0, 1, (H, W)).astype(np.float32)
    g = np.asarray(Image.fromarray(((g * 40) + 128).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)), np.float32)
    g = (g - 128) / 40 / 0.55
    amp = P["grain"] * (0.6 + 0.8 * L * (1 - L) * 4 / 2)   # 中間調で少し強く、白と黒では弱く
    a = a + (g * amp)[..., None]
    return Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8))


# ---------------------------------------------------------------------------
# コマンドとして使う（EP.11 以降の写真を同じ色調で書き出す）
#   python3 tools/photo_grade.py <元写真> <プロファイル> <名前> [--crop 左,上,右,下] [--place スポットid]
#   例: python3 tools/photo_grade.py ~/Desktop/ep11.jpg nature ep-11-xxxx --place xxxx
#   → assets/img/episodes/ep-11-xxxx.webp（4:5・1000×1250）と assets/img/places/xxxx.webp（長辺2000px以下）
#   プロファイル: nature（自然・屋外）／shop（飲食店）／night（夜の店内）／film（すでにフィルム調の写真）
#   --crop を省くと、写真の中央を 4:5 で切り抜きます（ピクセルで指定すると位置を選べます）
#   必要なもの: Python 3、numpy、Pillow（pip install numpy pillow）
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import argparse, pathlib
    ap = argparse.ArgumentParser(description="写真をサイトの色調で書き出す")
    ap.add_argument("src"); ap.add_argument("profile", choices=list(PROFILES)); ap.add_argument("name")
    ap.add_argument("--crop"); ap.add_argument("--place"); ap.add_argument("--seed", type=int, default=1)
    a = ap.parse_args()
    root = pathlib.Path(__file__).resolve().parent.parent / "assets" / "img"
    g = grade(Image.open(a.src), a.profile, seed=a.seed)
    W, H = g.size
    if a.crop:
        box = tuple(int(v) for v in a.crop.split(","))
    else:
        cw, ch = (W, round(W * 1.25)) if W / H < 0.8 else (round(H * 0.8), H)
        box = ((W - cw) // 2, (H - ch) // 2, (W - cw) // 2 + cw, (H - ch) // 2 + ch)
    ep = g.crop(box).resize((1000, 1250), Image.LANCZOS)
    out = root / "episodes" / f"{a.name}.webp"; ep.save(out, "WEBP", quality=82, method=6); print("書き出し:", out)
    if a.place:
        m = max(g.size); pl = g if m <= 2000 else g.resize((round(W * 2000 / m), round(H * 2000 / m)), Image.LANCZOS)
        out = root / "places" / f"{a.place}.webp"; pl.save(out, "WEBP", quality=82, method=6); print("書き出し:", out)
