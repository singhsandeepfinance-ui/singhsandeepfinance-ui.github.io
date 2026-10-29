"""Builds assets/img/share-card.png (1200x630), the preview picture shown when
a page is shared on WhatsApp, LinkedIn or X. Not needed for the website itself."""
import sys
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
INK, INK2 = (21, 32, 59), (30, 43, 77)
COLS = [(143, 127, 214), (242, 183, 5), (126, 143, 99), (47, 180, 200)]
F = "/usr/share/fonts/opentype/inter/"
bold = lambda s: ImageFont.truetype(F + "Inter-ExtraBold.otf", s)
med = lambda s: ImageFont.truetype(F + "Inter-Medium.otf", s)
reg = lambda s: ImageFont.truetype(F + "Inter-Regular.otf", s)

img = Image.new("RGB", (W, H), INK)
d = ImageDraw.Draw(img)

# fanned notes, large, on the right
widths = [420, 360, 395, 330]
for i, (c, w) in enumerate(zip(COLS, widths)):
    y = 150 + i * 92
    d.rounded_rectangle([W - 80 - w, y, W - 80, y + 64], radius=12, fill=c)

# small brand mark + name
for i, (c, w) in enumerate(zip(COLS, [44, 38, 41, 34])):
    d.rounded_rectangle([80, 86 + i * 12, 80 + w, 86 + i * 12 + 8], radius=2, fill=c)
d.text((140, 82), "Sandeep Singh", font=bold(40), fill="white")

d.text((80, 230), "Money, markets", font=bold(76), fill="white")
d.text((80, 318), "and research,", font=bold(76), fill="white")
d.text((80, 406), "explained clearly.", font=bold(76), fill="white")

d.line([80, 528, W - 80, 528], fill=INK2, width=2)
d.text((80, 552), "PhD Scholar, Banking & Financial Markets  |  IIT (ISM) Dhanbad", font=med(28), fill=(211, 218, 232))

img.save(sys.argv[1], optimize=True)
