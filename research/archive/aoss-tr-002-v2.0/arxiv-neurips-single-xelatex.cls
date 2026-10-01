\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{arxiv-neurips-single}[2026/09/12 Clean single-column arXiv preprint]

\LoadClass[10pt,a4paper]{article}

\RequirePackage[a4paper,top=23mm,bottom=25mm,left=27mm,right=27mm,headheight=14pt]{geometry}
\RequirePackage{fontspec}
\RequirePackage{microtype}
\RequirePackage[table]{xcolor}
\RequirePackage{graphicx}
\RequirePackage{booktabs}
\RequirePackage{tabularx}
\RequirePackage{array}
\RequirePackage{enumitem}
\RequirePackage{titlesec}
\RequirePackage{fancyhdr}
\RequirePackage{fvextra}
\RequirePackage{float}
\RequirePackage{needspace}
\RequirePackage{xurl}
\RequirePackage{hyperref}

\setmainfont[
  Path=/System/Library/Fonts/Supplemental/,
  UprightFont=Times New Roman.ttf,
  BoldFont=Times New Roman Bold.ttf,
  ItalicFont=Times New Roman Italic.ttf,
  BoldItalicFont=Times New Roman Bold Italic.ttf,
  Ligatures=TeX
]{Times New Roman}

\definecolor{PreprintBlack}{HTML}{171717}
\definecolor{PreprintGray}{HTML}{5F6368}
\definecolor{PreprintRule}{HTML}{C9CDD2}
\definecolor{PreprintShade}{HTML}{F2F3F4}
\definecolor{PreprintLink}{HTML}{174A75}

% Compatibility colors used by the Markdown-to-LaTeX converter.
\definecolor{AOSSNavy}{HTML}{171717}
\definecolor{AOSSTeal}{HTML}{34383D}
\definecolor{AOSSGold}{HTML}{AEB3B8}
\definecolor{AOSSSlate}{HTML}{5F6368}
\definecolor{AOSSMist}{HTML}{E2E4E7}
\definecolor{AOSSPaper}{HTML}{FFFFFF}
\definecolor{AOSSTableAlt}{HTML}{F2F3F4}

\hypersetup{
  colorlinks=true,
  linkcolor=PreprintBlack,
  citecolor=PreprintLink,
  urlcolor=PreprintLink,
  pdfborder={0 0 0}
}

\setlength{\parindent}{1em}
\setlength{\parskip}{0pt}
\setlength{\emergencystretch}{1.5em}
\linespread{1.02}
\widowpenalty=10000
\clubpenalty=10000
\displaywidowpenalty=10000

\titleformat{\section}
  {\large\bfseries\color{PreprintBlack}}
  {\thesection.}{0.55em}{}
\titleformat{\subsection}
  {\normalsize\bfseries\color{PreprintBlack}}
  {\thesubsection}{0.55em}{}
\titleformat{\subsubsection}
  {\normalsize\itshape\color{PreprintBlack}}
  {\thesubsubsection}{0.55em}{}
\titlespacing*{\section}{0pt}{2.6ex plus .7ex minus .2ex}{1.0ex}
\titlespacing*{\subsection}{0pt}{2.0ex plus .5ex minus .2ex}{.7ex}
\titlespacing*{\subsubsection}{0pt}{1.7ex plus .4ex minus .2ex}{.5ex}

\setlist[itemize]{leftmargin=1.7em,itemsep=.2ex,topsep=.45ex,parsep=0pt}
\setlist[enumerate]{leftmargin=1.9em,itemsep=.2ex,topsep=.45ex,parsep=0pt}
\renewcommand{\labelitemi}{\textbullet}
\renewcommand{\arraystretch}{1.12}
\setlength{\tabcolsep}{5pt}
\newcolumntype{Y}{>{\raggedright\arraybackslash}X}

\fancypagestyle{preprint}{%
  \fancyhf{}
  \fancyhead[L]{\footnotesize\itshape\color{PreprintGray}AI Optimal State Space}
  \fancyhead[R]{\footnotesize\color{PreprintGray}\thepage}
  \renewcommand{\headrulewidth}{0.35pt}
  \renewcommand{\footrulewidth}{0pt}
}
\fancypagestyle{plain}{%
  \fancyhf{}
  \fancyfoot[C]{\footnotesize\color{PreprintGray}\thepage}
  \renewcommand{\headrulewidth}{0pt}
  \renewcommand{\footrulewidth}{0pt}
}
\pagestyle{preprint}

\makeatletter
\def\@reporttitle{}
\def\@reportsubtitle{}
\def\@reportnumber{}
\def\@reportversion{}
\def\@reportdate{}
\def\@reportprovenance{}
\def\@reportauthor{AI Optimal State Space contributors}
\newcommand{\reporttitle}[1]{\gdef\@reporttitle{#1}}
\newcommand{\reportsubtitle}[1]{\gdef\@reportsubtitle{#1}}
\newcommand{\reportnumber}[1]{\gdef\@reportnumber{#1}}
\newcommand{\reportversion}[1]{\gdef\@reportversion{#1}}
\newcommand{\reportdate}[1]{\gdef\@reportdate{#1}}
\newcommand{\reportprovenance}[1]{\gdef\@reportprovenance{#1}}
\newcommand{\reportauthor}[1]{\gdef\@reportauthor{#1}}

\newcommand{\aossmaketitle}{%
  \hypersetup{
    pdftitle={\@reporttitle},
    pdfsubject={\@reportsubtitle},
    pdfauthor={\@reportauthor},
    pdfkeywords={AI agents, coding agents, agent environments, AI welfare, human-AI interaction}
  }
  \thispagestyle{plain}
  \vspace*{-2.5em}
  \begin{center}
    {\LARGE\bfseries\color{PreprintBlack}\@reporttitle\par}
    \vspace{0.65em}
    {\large\color{PreprintBlack}\@reportsubtitle\par}
    \vspace{1.2em}
    {\normalsize\@reportauthor\par}
    \vspace{0.2em}
    {\small\color{PreprintGray}\@reportdate\quad Version \@reportversion\par}
  \end{center}
  \vspace{0.8em}
}
\makeatother

\newenvironment{aossabstract}
  {\begin{center}\begin{minipage}{0.90\textwidth}
   \small\noindent\textbf{Abstract}\par\smallskip\noindent\ignorespaces}
  {\par\end{minipage}\end{center}\vspace{0.35em}}

\newenvironment{aosskeywords}
  {\begin{center}\begin{minipage}{0.90\textwidth}
   \footnotesize\noindent\textbf{Keywords: }\ignorespaces}
  {\par\end{minipage}\end{center}\vspace{0.9em}}

\newenvironment{aossquote}
  {\begin{quote}\small\itshape\color{PreprintGray}\ignorespaces}
  {\end{quote}}

\DefineVerbatimEnvironment{aossverbatim}{Verbatim}{
  breaklines=true,
  breakanywhere=true,
  fontsize=\footnotesize,
  frame=single,
  rulecolor=\color{PreprintRule},
  framesep=6pt,
  xleftmargin=0.4em,
  xrightmargin=0.4em
}

\newenvironment{aossnote}
  {\begin{quote}\small\color{PreprintGray}\noindent}
  {\end{quote}}
\newcommand{\aosscheckbox}{\ensuremath{\square}}
\newcommand{\spacecell}[2]{\textbf{#1}: #2}

\setcounter{tocdepth}{2}
\setcounter{secnumdepth}{3}
