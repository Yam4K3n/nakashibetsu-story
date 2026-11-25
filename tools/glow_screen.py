#!/usr/bin/env python3
"""EP.07 GLOW 店内写真：右側スクリーンの映像だけを判別できないように処理する（2026-10-28 と同じ処理）
usage: python3 -I glow_screen.py <元写真.jpg> <出力.jpg>
・処理するのはスクリーンの映像面（四隅で指定した四角形の内側）だけ。壁・ネオン・カウンター・椅子には触れない。
・映像面は「極端に縮小 → 拡大」で形や輪郭の情報を消し、明るさと彩度を落として店内の照明になじむ暗い面にする。
"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
SRC, OUT = sys.argv[1], sys.argv[2]
QUAD = [(797.0, 703.0), (1152.0, 641.5), (1152.0, 905.5), (798.0, 871.5)]
SS = 4; WALL_DARK = 0.60; SAT = 0.72
im = Image.open(SRC).convert("RGB"); W, H = im.size
assert (W, H) == (1152, 1536), "想定と異なる写真です"
a = np.asarray(im, dtype=np.float32) / 255.0
big = Image.new("L", (W * SS, H * SS), 0)
ImageDraw.Draw(big).polygon([(x * SS, y * SS) for x, y in QUAD], fill=255)
m = (np.asarray(big.resize((W, H), Image.BOX), np.float32) / 255.0)[..., None]
ring_out = Image.new("L", (W, H), 0); d = ImageDraw.Draw(ring_out)
d.polygon(QUAD, fill=255); ring_out = ring_out.filter(ImageFilter.MaxFilter(49))
ring_in = Image.new("L", (W, H), 0); ImageDraw.Draw(ring_in).polygon(QUAD, fill=255); ring_in = ring_in.filter(ImageFilter.MaxFilter(13))
ring = (np.asarray(ring_out) > 0) & ~(np.asarray(ring_in) > 0)
yy_, xx_ = np.mgrid[0:H, 0:W]
ring &= (yy_ > 800) | (xx_ < 800)
wall = a[ring].mean(axis=0)
x0, y0 = int(min(p[0] for p in QUAD)), int(min(p[1] for p in QUAD))
x1, y1 = int(max(p[0] for p in QUAD)), int(max(p[1] for p in QUAD))
box = im.crop((x0, y0, x1, y1))
low = np.asarray(box.resize((3, 2), Image.BOX).resize(box.size, Image.BICUBIC).filter(ImageFilter.GaussianBlur(40)), np.float32) / 255.0
lowl = low @ np.array([0.2126, 0.7152, 0.0722], np.float32)
var = (lowl - lowl.mean()) / max(lowl.mean(), 1e-3)
wl = float(wall @ np.array([0.2126, 0.7152, 0.0722], np.float32))
base = wl + SAT * (wall - wl)
field = np.array(a)
patch = base[None, None, :] * WALL_DARK * (1 + 0.10 * np.clip(var, -1, 1))[..., None]
yy = np.linspace(-1, 1, y1 - y0, dtype=np.float32)[:, None, None]
patch = patch * (1.02 - 0.06 * yy)
field[y0:y1, x0:x1] = patch
rng = np.random.default_rng(7)
g = rng.normal(0, 1, (H, W)).astype(np.float32)[..., None]
field = field + g * 0.012
out = a * (1 - m) + np.clip(field, 0, 1) * m
res = Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))
res.save(OUT, "JPEG", quality=95, subsampling=0)
diff = np.abs(np.asarray(res, np.int16) - np.asarray(im, np.int16)).max(axis=2)
print(f"変更した画素: {int((diff > 2).sum())} / スクリーンの外で変わった画素: {int(((diff > 2) & ~(m[...,0] > 0)).sum())}")
