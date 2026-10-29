"""Builds assets/img/share-card.png (1200x630), the preview picture shown when
a page is shared on WhatsApp, LinkedIn or X. Not needed for the website itself."""
import sys
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG, TEXT, MUTED, LINE, ACCENT = (255, 255, 255), (27, 31, 39), (91, 99, 114), (228, 231, 236), (36, 81, 143)
F = "/usr/share/fonts/opentype/inter/"
semi = lambda s: ImageFont.truetype(F + "Inter-SemiBold.otf", s)
reg = lambda s: ImageFont.truetype(F + "Inter-Regular.otf", s)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

def blend(c, a):  # accent at opacity a over white
    return tuple(round(255 + (x - 255) * a) for x in c)

# brand mark + name
for i, (w, a) in enumerate([(40, 1), (33, .8), (37, .6), (29, .4)]):
    d.rounded_rectangle([88, 92 + i * 11, 88 + w, 92 + i * 11 + 7], radius=2, fill=blend(ACCENT, a))
d.text((144, 90), "Sandeep Singh", font=semi(34), fill=TEXT)

d.text((88, 236), "Money, markets and research,", font=semi(62), fill=TEXT)
d.text((88, 314), "explained clearly.", font=semi(62), fill=TEXT)

d.line([88, 470, W - 88, 470], fill=LINE, width=2)
d.text((88, 496), "PhD Scholar, Banking & Financial Markets", font=reg(28), fill=MUTED)
d.text((88, 540), "IIT (ISM) Dhanbad", font=reg(28), fill=MUTED)
d.rectangle([0, H - 8, W, H], fill=ACCENT)

img.save(sys.argv[1], optimize=True)
