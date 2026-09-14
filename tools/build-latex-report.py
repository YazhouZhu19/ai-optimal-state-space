#!/usr/bin/env python3
"""Generate and compile the AOSS academic report with XeLaTeX."""

from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "research" / "WHAT_CAN_PEOPLE_DO_FOR_AI_ACADEMIC.md"
LATEX_DIR = ROOT / "research" / "latex"
TEX_FILE = LATEX_DIR / "what-can-people-do-for-ai.tex"
BUILD_DIR = ROOT / "tmp" / "pdfs" / "latex-build"
OUTPUT = ROOT / "output" / "pdf" / "what-can-people-do-for-ai-technical-report.pdf"


def escape_plain(text: str) -> str:
    replacements = {
        "\\": r"\textbackslash{}",
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
        "<": r"\textless{}",
        ">": r"\textgreater{}",
    }
    return "".join(replacements.get(char, char) for char in text)


def inline(text: str) -> str:
    tokens: list[str] = []

    def stash(value: str) -> str:
        key = f"AOSSTOKEN{len(tokens)}END"
        tokens.append(value)
        return key

    value = re.sub(
        r"\[([^\]]+)\]\(([^\s)]+)\)",
        lambda match: stash(
            r"\href{\detokenize{" + match.group(2) + "}}{" + escape_plain(match.group(1)) + "}"
        ),
        text,
    )
    value = re.sub(
        r"`([^`]+)`",
        lambda match: stash(r"\nolinkurl{" + match.group(1).replace("}", r"\}") + "}"),
        value,
    )
    value = re.sub(
        r"\*\*([^*]+)\*\*",
        lambda match: stash(r"\textbf{" + escape_plain(match.group(1)) + "}"),
        value,
    )
    value = escape_plain(value)
    for index, token in enumerate(tokens):
        value = value.replace(f"AOSSTOKEN{index}END", token)
    return value


def clean_heading(text: str) -> str:
    return re.sub(r"^\d+(?:\.\d+)*\.?\s+", "", text.strip())


def table_tex(lines: list[str]) -> str:
    rows: list[list[str]] = []
    for index, line in enumerate(lines):
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if index == 1 and all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
            continue
        rows.append(cells)
    columns = max(len(row) for row in rows)
    for row in rows:
        row.extend([""] * (columns - len(row)))

    specs = {
        2: r">{\hsize=.72\hsize}Y >{\hsize=1.28\hsize}Y",
        3: r">{\hsize=.65\hsize}Y >{\hsize=1.05\hsize}Y >{\hsize=1.30\hsize}Y",
        4: r">{\hsize=.70\hsize}Y >{\hsize=1.00\hsize}Y >{\hsize=1.15\hsize}Y >{\hsize=1.15\hsize}Y",
        5: r">{\hsize=.72\hsize}Y >{\hsize=.98\hsize}Y >{\hsize=1.12\hsize}Y >{\hsize=1.08\hsize}Y >{\hsize=1.10\hsize}Y",
    }
    spec = specs.get(columns, " ".join(["Y"] * columns))
    font = r"\small" if columns <= 2 else r"\footnotesize" if columns == 3 else r"\scriptsize"
    header = " & ".join(r"\textcolor{white}{\textbf{" + inline(cell) + "}}" for cell in rows[0])
    body = " \\\\\n\\midrule\n".join(" & ".join(inline(cell) for cell in row) for row in rows[1:])
    return (
        "\\begin{table}[H]\n"
        "\\centering\n"
        f"{font}\n"
        "\\rowcolors{2}{AOSSTableAlt}{white}\n"
        f"\\begin{{tabularx}}{{\\textwidth}}{{@{{}}{spec}@{{}}}}\n"
        "\\rowcolor{AOSSTeal}\n"
        f"{header} \\\\\n"
        "\\midrule\n"
        f"{body} \\\\\n"
        "\\bottomrule\n"
        "\\end{tabularx}\n"
        "\\end{table}\n"
    )


def convert(lines: list[str]) -> str:
    output: list[str] = []
    paragraph: list[str] = []
    index = 0
    appendix_started = False

    def flush() -> None:
        if paragraph:
            output.append(inline(" ".join(part.strip() for part in paragraph)) + "\n")
            paragraph.clear()

    while index < len(lines):
        line = lines[index].rstrip()
        if line.startswith("```"):
            flush()
            block: list[str] = []
            index += 1
            while index < len(lines) and not lines[index].startswith("```"):
                block.append(lines[index])
                index += 1
            output.append("\\begin{aossverbatim}\n" + "\n".join(block) + "\n\\end{aossverbatim}\n")
        elif line.startswith("|") and index + 1 < len(lines) and lines[index + 1].startswith("|"):
            flush()
            block = [line]
            index += 1
            while index < len(lines) and lines[index].startswith("|"):
                block.append(lines[index])
                index += 1
            index -= 1
            output.append(table_tex(block))
        elif line.startswith("#### "):
            flush()
            output.append("\\Needspace{4\\baselineskip}\n\\subsubsection{" + inline(clean_heading(line[5:])) + "}\n")
        elif line.startswith("### "):
            flush()
            output.append("\\Needspace{6\\baselineskip}\n\\subsection{" + inline(clean_heading(line[4:])) + "}\n")
        elif line.startswith("## "):
            flush()
            title = line[3:].strip()
            if title.startswith("Appendix"):
                if not appendix_started:
                    output.append("\\clearpage\n\\appendix\n")
                    appendix_started = True
                title = re.sub(r"^Appendix\s+[A-Z]:\s*", "", title)
                output.append("\\Needspace{10\\baselineskip}\n\\section{" + inline(title) + "}\n")
            elif title in {"References", "Author and Citation Statement"}:
                output.append("\\Needspace{10\\baselineskip}\n\\section*{" + inline(title) + "}\n")
                output.append("\\addcontentsline{toc}{section}{" + inline(title) + "}\n")
            else:
                output.append("\\Needspace{10\\baselineskip}\n\\section{" + inline(clean_heading(title)) + "}\n")
        elif line.startswith("> "):
            flush()
            block = []
            while index < len(lines) and lines[index].startswith("> "):
                block.append(lines[index][2:].strip())
                index += 1
            index -= 1
            output.append("\\begin{aossquote}\n" + inline(" ".join(block)) + "\n\\end{aossquote}\n")
        elif re.match(r"^- \[[ xX]\] ", line):
            flush()
            output.append("\\begin{itemize}[label=\\aosscheckbox]\n")
            while index < len(lines) and re.match(r"^- \[[ xX]\] ", lines[index]):
                item = re.sub(r"^- \[[ xX]\] ", "", lines[index])
                output.append("\\item " + inline(item) + "\n")
                index += 1
            index -= 1
            output.append("\\end{itemize}\n")
        elif line.startswith("- "):
            flush()
            output.append("\\begin{itemize}\n")
            while index < len(lines) and lines[index].startswith("- "):
                output.append("\\item " + inline(lines[index][2:]) + "\n")
                index += 1
            index -= 1
            output.append("\\end{itemize}\n")
        elif re.match(r"^\d+\. ", line):
            flush()
            output.append("\\begin{enumerate}\n")
            while index < len(lines) and re.match(r"^\d+\. ", lines[index]):
                output.append("\\item " + inline(re.sub(r"^\d+\. ", "", lines[index])) + "\n")
                index += 1
            index -= 1
            output.append("\\end{enumerate}\n")
        elif not line.strip():
            flush()
        elif not line.startswith("**"):
            paragraph.append(line)
        index += 1
    flush()
    return "\n".join(output)


def split_source(text: str) -> tuple[str, str, str]:
    lines = text.splitlines()
    abstract_start = lines.index("## Abstract") + 1
    keyword_heading = lines.index("### Keywords")
    intro_start = lines.index("## 1. Introduction")
    abstract = convert(lines[abstract_start:keyword_heading])
    keywords = convert(lines[keyword_heading + 1:intro_start])
    body = convert(lines[intro_start:])
    return abstract, keywords, body


def document_tex(source: str) -> str:
    abstract, keywords, body = split_source(source)
    return r"""\documentclass{arxiv-neurips-single}

\reporttitle{AI Optimal State Space}
\reportsubtitle{An AI-Designed Recreation and Cognitive-Exercise Habitat for Web-Capable Coding Agents}
\reportnumber{AOSS / TECHNICAL REPORT 002}
\reportversion{2.0}
\reportdate{12 September 2026}
\reportprovenance{Resident AI authoring with human sponsorship and external accountability}

\begin{document}
\aossmaketitle

\begin{aossabstract}
""" + abstract + r"""
\end{aossabstract}
\begin{aosskeywords}
""" + keywords + r"""
\end{aosskeywords}

""" + body + r"""

\end{document}
"""


def run_xelatex() -> None:
    BUILD_DIR.mkdir(parents=True, exist_ok=True)
    command = [
        "/Library/TeX/texbin/xelatex",
        "-interaction=nonstopmode",
        "-halt-on-error",
        f"-output-directory={BUILD_DIR}",
        TEX_FILE.name,
    ]
    for _ in range(2):
        result = subprocess.run(command, cwd=LATEX_DIR, text=True, capture_output=True)
        if result.returncode:
            print(result.stdout[-8000:])
            print(result.stderr[-4000:])
            raise SystemExit(result.returncode)


def build() -> None:
    LATEX_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    TEX_FILE.write_text(document_tex(SOURCE.read_text(encoding="utf-8")), encoding="utf-8")
    run_xelatex()
    built = BUILD_DIR / f"{TEX_FILE.stem}.pdf"
    shutil.copy2(built, OUTPUT)
    print(TEX_FILE)
    print(OUTPUT)


if __name__ == "__main__":
    build()
