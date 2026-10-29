"""Builds the sample cheat-sheet PDF in /pdfs. Not needed for the website itself."""
import sys
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, white
from reportlab.pdfgen import canvas

pdfmetrics.registerFont(TTFont("Sans", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("SansB", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Serif", "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"))

INK, MUTED, LINE = HexColor("#15203B"), HexColor("#566074"), HexColor("#D9DFE8")
SUN, LAV, STONE, BLUE = HexColor("#F2B705"), HexColor("#8F7FD6"), HexColor("#7E8F63"), HexColor("#2FB4C8")

def sip(p, y, rate):
    r = rate / 12 / 100; n = y * 12
    return p * ((1 + r) ** n - 1) / r * (1 + r)

def fmt(v):
    return f"₹{v/1e7:.2f} crore" if v >= 1e7 else f"₹{v/1e5:.1f} lakh"

out = sys.argv[1]
W, H = A4
c = canvas.Canvas(out, pagesize=A4)
c.setTitle("Compounding and SIP cheat sheet")
c.setAuthor("Sandeep Singh")

# Header band
c.setFillColor(INK); c.rect(0, H - 110, W, 110, stroke=0, fill=1)
for i, (col, w) in enumerate([(LAV, 26), (SUN, 22), (STONE, 24), (BLUE, 20)]):
    c.setFillColor(col); c.roundRect(40, H - 44 - i * 8, w, 5, 1.5, stroke=0, fill=1)
c.setFillColor(white); c.setFont("SansB", 22); c.drawString(78, H - 58, "Compounding and SIP cheat sheet")
c.setFont("Sans", 10.5); c.setFillColor(HexColor("#C6CEDD"))
c.drawString(78, H - 78, "Sandeep Singh  |  PhD Research Scholar in Finance, IIT (ISM) Dhanbad")

y = H - 150
def heading(text):
    global y
    c.setFillColor(INK); c.setFont("SansB", 13.5); c.drawString(40, y, text); y -= 20

def para(text, size=10.5, color=None):
    global y
    c.setFillColor(color or HexColor("#1A2233")); c.setFont("Serif", size)
    for line in text.split("\n"):
        c.drawString(40, y, line); y -= size * 1.55
    y -= 4

heading("1. The SIP formula")
para("FV = P × [((1 + r)^n − 1) ÷ r] × (1 + r)")
para("P = amount invested each month,  r = monthly return (yearly % ÷ 12 ÷ 100),  n = number of months.\nAssumes each instalment is made at the start of the month and the return is steady.", 9.5, MUTED)

y -= 6
heading("2. Ready reckoner: ₹10,000 a month at 12% a year")
cols = [40, 140, 290, 440]
heads = ["Years", "You invest", "Value at the end", "Value ÷ invested"]
c.setFont("SansB", 10); c.setFillColor(INK)
for x, h in zip(cols, heads): c.drawString(x, y, h)
y -= 7; c.setStrokeColor(INK); c.setLineWidth(1.4); c.line(40, y, W - 40, y); y -= 16
c.setLineWidth(0.6); c.setStrokeColor(LINE)
for yrs in (5, 10, 15, 20, 25, 30):
    fv = sip(10000, yrs, 12); inv = 10000 * 12 * yrs
    c.setFont("Sans", 10); c.setFillColor(HexColor("#1A2233"))
    for x, v in zip(cols, [str(yrs), fmt(inv), fmt(fv), f"{fv/inv:.2f}×"]): c.drawString(x, y, v)
    y -= 7; c.line(40, y, W - 40, y); y -= 16

y -= 10
heading("3. Same money, different start")
para("₹10,000 a month for 20 years  →  about " + fmt(sip(10000, 20, 12)) + "\n₹20,000 a month for 10 years  →  about " + fmt(sip(20000, 10, 12)) + "\nBoth invest ₹24 lakh. Starting earlier gives compounding more years to work.")

heading("4. The rule of 72")
para("Years to double ≈ 72 ÷ yearly return in %.   At 12% → about 6 years.   At 8% → about 9 years.")

heading("5. Remember")
para("• Returns vary from year to year; treat any projection as a scenario, not a promise.\n• At 6% inflation, ₹1 crore in 20 years buys roughly what ₹31 lakh buys today.\n• Expense ratios and taxes reduce what you keep. Check current tax rules before redeeming.")

# Footer
c.setStrokeColor(LINE); c.line(40, 70, W - 40, 70)
c.setFont("Sans", 8.5); c.setFillColor(MUTED)
c.drawString(40, 54, "For education only. Not investment advice. Consult a SEBI-registered investment adviser before investing.")
c.drawString(40, 40, "Figures are illustrations computed with the formula above.")
c.save()
