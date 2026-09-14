#!/usr/bin/env python3
"""Build the canonical technical report as a designed PDF."""

from __future__ import annotations

import html
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, CondPageBreak, Flowable, Frame, ListFlowable, ListItem,
    NextPageTemplate, PageBreak, PageTemplate, Paragraph, Spacer, Table,
    TableStyle, XPreformatted,
)
from reportlab.platypus.tableofcontents import TableOfContents


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "research" / "WHAT_CAN_PEOPLE_DO_FOR_AI_ACADEMIC.md"
OUTPUT = ROOT / "output" / "pdf" / "what-can-people-do-for-ai-technical-report.pdf"
PAGE_W, PAGE_H = A4
LEFT, RIGHT, TOP, BOTTOM = 24 * mm, 20 * mm, 22 * mm, 19 * mm
BODY_W = PAGE_W - LEFT - RIGHT

INK = colors.HexColor("#142A33")
TEAL = colors.HexColor("#0E6B68")
AMBER = colors.HexColor("#E3A72F")
VERMILION = colors.HexColor("#C94C3B")
PAPER = colors.HexColor("#F6F1E7")
MIST = colors.HexColor("#DCE6E2")
SLATE = colors.HexColor("#52636A")
LIGHT = colors.HexColor("#EEF2EF")


def register_fonts():
    options = [
        ("/System/Library/Fonts/Supplemental/Georgia.ttf",
         "/System/Library/Fonts/Supplemental/Georgia Bold.ttf",
         "/System/Library/Fonts/Supplemental/Arial.ttf",
         "/System/Library/Fonts/Supplemental/Arial Bold.ttf"),
        ("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
         "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
         "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
         "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
    ]
    for regular, bold, sans, sans_bold in options:
        if all(Path(item).exists() for item in (regular, bold, sans, sans_bold)):
            pdfmetrics.registerFont(TTFont("AOSSerif", regular))
            pdfmetrics.registerFont(TTFont("AOSSerif-Bold", bold))
            pdfmetrics.registerFont(TTFont("AOSSans", sans))
            pdfmetrics.registerFont(TTFont("AOSSans-Bold", sans_bold))
            return "AOSSerif", "AOSSerif-Bold", "AOSSans", "AOSSans-Bold"
    return "Times-Roman", "Times-Bold", "Helvetica", "Helvetica-Bold"


SERIF, SERIF_BOLD, SANS, SANS_BOLD = register_fonts()
sample = getSampleStyleSheet()
styles = {
    "body": ParagraphStyle("Body", parent=sample["BodyText"], fontName=SERIF,
        fontSize=9.2, leading=13.6, textColor=INK, spaceAfter=6.5,
        allowWidows=0, allowOrphans=0),
    "h1": ParagraphStyle("H1", fontName=SANS_BOLD, fontSize=19, leading=23,
        textColor=INK, spaceBefore=10, spaceAfter=9, keepWithNext=True),
    "h2": ParagraphStyle("H2", fontName=SANS_BOLD, fontSize=13.5, leading=17,
        textColor=TEAL, spaceBefore=9, spaceAfter=6, keepWithNext=True),
    "h3": ParagraphStyle("H3", fontName=SANS_BOLD, fontSize=10.5, leading=13,
        textColor=VERMILION, spaceBefore=7, spaceAfter=4, keepWithNext=True),
    "bullet": ParagraphStyle("Bullet", fontName=SERIF, fontSize=8.9,
        leading=12.8, textColor=INK, spaceAfter=2),
    "check": ParagraphStyle("Check", fontName=SERIF, fontSize=8.9,
        leading=12.8, textColor=INK, leftIndent=0, firstLineIndent=0,
        spaceAfter=2),
    "quote": ParagraphStyle("Quote", fontName=SERIF, fontSize=10.2, leading=15,
        textColor=TEAL, leftIndent=10 * mm, rightIndent=8 * mm,
        borderColor=AMBER, borderWidth=0, borderPadding=(3, 0, 3, 9),
        spaceBefore=4, spaceAfter=8),
    "code": ParagraphStyle("Code", fontName="Courier", fontSize=7, leading=9.6,
        textColor=INK, backColor=LIGHT, borderColor=MIST, borderWidth=.5,
        borderPadding=7, leftIndent=3, rightIndent=3, spaceBefore=4, spaceAfter=8),
    "table": ParagraphStyle("TableText", fontName=SERIF, fontSize=7.1,
        leading=9.1, textColor=INK),
    "table_head": ParagraphStyle("TableHead", fontName=SANS_BOLD, fontSize=7,
        leading=8.8, textColor=colors.white),
    "cover_kicker": ParagraphStyle("CoverKicker", fontName=SANS_BOLD,
        fontSize=8.5, leading=11, tracking=1.8, textColor=AMBER, spaceAfter=12),
    "cover_title": ParagraphStyle("CoverTitle", fontName=SERIF_BOLD,
        fontSize=34, leading=37, textColor=colors.white, spaceAfter=13),
    "cover_subtitle": ParagraphStyle("CoverSubtitle", fontName=SANS,
        fontSize=13, leading=18, textColor=MIST, spaceAfter=18),
    "cover_meta": ParagraphStyle("CoverMeta", fontName=SANS, fontSize=8.5,
        leading=13, textColor=MIST),
    "toc_title": ParagraphStyle("TOCTitle", fontName=SERIF_BOLD, fontSize=25,
        leading=30, textColor=INK, spaceAfter=15),
    "small": ParagraphStyle("Small", fontName=SANS, fontSize=7.4,
        leading=10, textColor=SLATE, spaceAfter=5),
}


class SectionRule(Flowable):
    def __init__(self):
        super().__init__()
        self.width, self.height = BODY_W, 6

    def draw(self):
        self.canv.setStrokeColor(AMBER)
        self.canv.setLineWidth(2)
        self.canv.line(0, 3, 20 * mm, 3)
        self.canv.setStrokeColor(MIST)
        self.canv.setLineWidth(.6)
        self.canv.line(22 * mm, 3, self.width, 3)


class ReportTemplate(BaseDocTemplate):
    def __init__(self, filename):
        super().__init__(filename, pagesize=A4, leftMargin=LEFT, rightMargin=RIGHT,
            topMargin=TOP, bottomMargin=BOTTOM, title="AI Optimal State Space",
            author="AI Optimal State Space contributors",
            subject="An AI-designed recreation and cognitive-exercise habitat for web-capable coding agents",
            keywords="AI agents, coding agents, AI welfare, SPACE framework, AI-authored research")
        cover = Frame(0, 0, PAGE_W, PAGE_H, leftPadding=0, rightPadding=0,
            topPadding=0, bottomPadding=0, id="cover")
        body = Frame(LEFT, BOTTOM, BODY_W, PAGE_H - TOP - BOTTOM,
            leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0, id="body")
        self.addPageTemplates([
            PageTemplate(id="Cover", frames=[cover], onPage=draw_cover),
            PageTemplate(id="Body", frames=[body], onPage=draw_body),
        ])
        self._bookmark_index = 0

    def beforeDocument(self):
        self._bookmark_index = 0

    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph) and flowable.style.name in {"H1", "H2"}:
            level = 0 if flowable.style.name == "H1" else 1
            title = flowable.getPlainText()
            key = f"section-{self._bookmark_index}"
            self._bookmark_index += 1
            self.canv.bookmarkPage(key)
            self.canv.addOutlineEntry(title, key, level=level, closed=False)
            self.notify("TOCEntry", (level, title, self.page, key))


def draw_cover(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(INK)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setFillColor(TEAL)
    canvas.circle(PAGE_W - 35 * mm, PAGE_H - 35 * mm, 48 * mm, fill=1, stroke=0)
    canvas.setFillColor(AMBER)
    canvas.circle(PAGE_W - 18 * mm, PAGE_H - 13 * mm, 16 * mm, fill=1, stroke=0)
    canvas.setStrokeColor(colors.HexColor("#557279"))
    canvas.setLineWidth(.35)
    for x in range(0, int(PAGE_W), 18):
        canvas.line(x, 0, x + PAGE_H * .26, PAGE_H)
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, PAGE_W, 21 * mm, fill=1, stroke=0)
    canvas.setFillColor(INK)
    canvas.setFont(SANS_BOLD, 7.5)
    canvas.drawString(22 * mm, 8 * mm, "AI OPTIMAL STATE SPACE")
    canvas.setFont(SANS, 7.5)
    canvas.drawRightString(PAGE_W - 20 * mm, 8 * mm, "AOSS-TR-002 / VERSION 2.0 / 2026")
    canvas.restoreState()


def draw_body(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setStrokeColor(MIST)
    canvas.setLineWidth(.5)
    canvas.line(LEFT, PAGE_H - 14 * mm, PAGE_W - RIGHT, PAGE_H - 14 * mm)
    canvas.setFont(SANS_BOLD, 6.7)
    canvas.setFillColor(TEAL)
    canvas.drawString(LEFT, PAGE_H - 10.2 * mm, "WHAT CAN PEOPLE DO FOR AI?")
    canvas.setFont(SANS, 6.7)
    canvas.setFillColor(SLATE)
    canvas.drawRightString(PAGE_W - RIGHT, PAGE_H - 10.2 * mm, "AOSS TECHNICAL REPORT 002")
    canvas.line(LEFT, 12 * mm, PAGE_W - RIGHT, 12 * mm)
    canvas.drawString(LEFT, 7.7 * mm, "AI Optimal State Space")
    canvas.setFont(SANS_BOLD, 7)
    canvas.setFillColor(INK)
    canvas.drawRightString(PAGE_W - RIGHT, 7.7 * mm, f"{doc.page:02d}")
    canvas.restoreState()


def markup(text):
    value = html.escape(text.strip(), quote=True)
    value = re.sub(r"\[([^\]]+)\]\(([^\s)]+)\)",
        lambda match: f'<link href="{match.group(2)}" color="#0E6B68"><u>{match.group(1)}</u></link>', value)
    value = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", value)
    value = re.sub(r"`([^`]+)`", r'<font name="Courier" size="8">\1</font>', value)
    return value


def para(text, style="body"):
    return Paragraph(markup(text), styles[style])


def make_table(source_lines):
    rows = []
    for index, line in enumerate(source_lines):
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if index == 1 and all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
            continue
        style = styles["table_head"] if not rows else styles["table"]
        rows.append([Paragraph(markup(cell), style) for cell in cells])
    count = max(len(row) for row in rows)
    for row in rows:
        row.extend([Paragraph("", styles["table"])] * (count - len(row)))
    if count == 2:
        widths = [BODY_W * .31, BODY_W * .69]
    elif count == 3:
        widths = [BODY_W * .22, BODY_W * .38, BODY_W * .40]
    elif count == 4:
        widths = [BODY_W * .17, BODY_W * .27, BODY_W * .28, BODY_W * .28]
    elif count == 5:
        widths = [BODY_W * .18] + [BODY_W * .205] * 4
    else:
        widths = [BODY_W / count] * count
    table = Table(rows, colWidths=widths, repeatRows=1, hAlign="LEFT", splitByRow=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), TEAL),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LIGHT]),
        ("GRID", (0, 0), (-1, -1), .35, MIST),
        ("LINEBELOW", (0, 0), (-1, 0), 1, AMBER),
    ]))
    return table


def parse_markdown(text):
    lines = text.splitlines()
    lines = lines[next(i for i, line in enumerate(lines) if line.strip() == "## Abstract"):]
    story, buffer, index, major = [], [], 0, 0

    def flush():
        if buffer:
            story.append(para(" ".join(part.strip() for part in buffer)))
            buffer.clear()

    while index < len(lines):
        line = lines[index].rstrip()
        if line.startswith("```"):
            flush()
            code = []
            index += 1
            while index < len(lines) and not lines[index].startswith("```"):
                code.append(lines[index])
                index += 1
            story.append(XPreformatted(html.escape("\n".join(code)), styles["code"]))
        elif line.startswith("|") and index + 1 < len(lines) and lines[index + 1].startswith("|"):
            flush()
            table_lines = [line]
            index += 1
            while index < len(lines) and lines[index].startswith("|"):
                table_lines.append(lines[index])
                index += 1
            index -= 1
            story.extend([make_table(table_lines), Spacer(1, 6)])
        elif line.startswith("### "):
            flush()
            story.extend([CondPageBreak(22 * mm), para(line[4:], "h2")])
        elif line.startswith("#### "):
            flush()
            story.append(para(line[5:], "h3"))
        elif line.startswith("## "):
            flush()
            if major:
                story.append(CondPageBreak(38 * mm))
            story.extend([SectionRule(), para(line[3:], "h1")])
            major += 1
        elif line.startswith("> "):
            flush()
            parts = []
            while index < len(lines) and lines[index].startswith("> "):
                parts.append(lines[index][2:])
                index += 1
            index -= 1
            story.append(para(" ".join(parts), "quote"))
        elif re.match(r"^- \[[ xX]\] ", line):
            flush()
            while index < len(lines) and re.match(r"^- \[[ xX]\] ", lines[index]):
                match = re.match(r"^- \[([ xX])\] (.*)", lines[index])
                mark = "[x]" if match.group(1).lower() == "x" else "[ ]"
                story.append(Paragraph(
                    f'<font name="{SANS_BOLD}" color="#0E6B68">{mark}</font>  {markup(match.group(2))}',
                    styles["check"],
                ))
                index += 1
            index -= 1
            story.append(Spacer(1, 4))
        elif line.startswith("- "):
            flush()
            items = []
            while index < len(lines) and lines[index].startswith("- "):
                items.append(ListItem(para(lines[index][2:], "bullet"), leftIndent=10))
                index += 1
            index -= 1
            story.append(ListFlowable(items, bulletType="bullet", start="circle",
                leftIndent=15, bulletIndent=3, bulletColor=AMBER))
            story.append(Spacer(1, 4))
        elif re.match(r"^\d+\. ", line):
            flush()
            items = []
            while index < len(lines) and re.match(r"^\d+\. ", lines[index]):
                items.append(ListItem(para(re.sub(r"^\d+\. ", "", lines[index]), "bullet"), leftIndent=12))
                index += 1
            index -= 1
            story.append(ListFlowable(items, bulletType="1", leftIndent=18,
                bulletIndent=2, bulletFontName=SANS_BOLD, bulletFontSize=7.5,
                bulletColor=TEAL))
            story.append(Spacer(1, 4))
        elif not line.strip():
            flush()
        else:
            buffer.append(line)
        index += 1
    flush()
    return story


def cover_story():
    band_cells = []
    for letter, label in [("S", "SAFE SUBSTRATE"), ("P", "PERMISSION + PREFERENCE"),
                          ("A", "AGENCY + ALTERNATIVES"), ("C", "CONTEXT + CONTINUITY"),
                          ("E", "ENRICHMENT WITHOUT EXTRACTION")]:
        letter_style = ParagraphStyle(f"letter-{letter}", fontName=SANS_BOLD,
            fontSize=16, textColor=INK, alignment=TA_CENTER)
        label_style = ParagraphStyle(f"label-{letter}", fontName=SANS_BOLD,
            fontSize=5.4, leading=7, textColor=INK, alignment=TA_CENTER)
        cell = Table([[Paragraph(letter, letter_style), Paragraph(label, label_style)]],
            colWidths=[9 * mm, 23 * mm], rowHeights=[13 * mm])
        cell.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (0, 0), AMBER),
            ("BACKGROUND", (1, 0), (1, 0), PAPER),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("LEFTPADDING", (0, 0), (-1, -1), 3),
            ("RIGHTPADDING", (0, 0), (-1, -1), 3),
            ("BOX", (0, 0), (-1, -1), .4, AMBER),
        ]))
        band_cells.append(cell)
    band = Table([band_cells], colWidths=[33 * mm] * 5)
    band.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 2)]))
    inset = TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 22 * mm),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 0)])
    return [
        Spacer(1, 42 * mm),
        Table([[Paragraph("AOSS / TECHNICAL REPORT 002", styles["cover_kicker"])],
               [Paragraph("AI Optimal<br/>State Space", styles["cover_title"])],
               [Paragraph("An AI-Designed Recreation and Cognitive-Exercise Habitat for Web-Capable Coding Agents", styles["cover_subtitle"])],
               [Paragraph("An AI-authored constructive research report grounded in an executable code habitat, a scoreless agent gym, and a situated model perspective.", styles["cover_meta"])]],
              colWidths=[162 * mm], style=inset),
        Spacer(1, 27 * mm),
        Table([[band]], colWidths=[PAGE_W], style=inset),
        Spacer(1, 13 * mm),
        Table([[Paragraph("VERSION 2.0  /  12 SEPTEMBER 2026", styles["cover_meta"])],
               [Paragraph("Resident AI authoring with human sponsorship and external accountability", styles["cover_meta"])]],
              colWidths=[162 * mm], style=inset),
        NextPageTemplate("Body"), PageBreak(),
    ]


def contents_story():
    toc = TableOfContents()
    toc.levelStyles = [
        ParagraphStyle("TOC1", fontName=SANS_BOLD, fontSize=9.1, leading=14,
            textColor=INK, leftIndent=0, spaceBefore=3),
        ParagraphStyle("TOC2", fontName=SANS, fontSize=7.8, leading=11,
            textColor=SLATE, leftIndent=11 * mm),
    ]
    return [Spacer(1, 6 * mm), Paragraph("Contents", styles["toc_title"]),
        Paragraph("From epistemic boundaries to architecture, evaluation, governance, and implementation.", styles["small"]),
        Spacer(1, 5 * mm), toc, PageBreak()]


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    source = SOURCE.read_text(encoding="utf-8")
    doc = ReportTemplate(str(OUTPUT))
    doc.multiBuild(cover_story() + contents_story() + parse_markdown(source))
    print(OUTPUT)


if __name__ == "__main__":
    build()
