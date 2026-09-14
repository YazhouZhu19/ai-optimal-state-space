\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{aoss-academic-report}[2026/09/12 AOSS academic technical report]

\LoadClass[11pt,a4paper]{article}

\RequirePackage[a4paper,top=25mm,bottom=24mm,left=29mm,right=25mm,headheight=21pt]{geometry}
\RequirePackage{fontspec}
\RequirePackage{microtype}
\RequirePackage{needspace}
\RequirePackage{xurl}
\RequirePackage[table]{xcolor}
\RequirePackage{graphicx}
\RequirePackage{booktabs}
\RequirePackage{tabularx}
\RequirePackage{array}
\RequirePackage{enumitem}
\RequirePackage{fancyhdr}
\RequirePackage{titlesec}
\RequirePackage{fancyvrb}
\RequirePackage{float}
\RequirePackage{needspace}
\RequirePackage{xurl}
\RequirePackage{hyperref}
\RequirePackage{bookmark}
\RequirePackage{lastpage}

\defaultfontfeatures{Ligatures=TeX,Scale=MatchLowercase}
\setmainfont[
  Path=/System/Library/Fonts/Supplemental/,
  UprightFont=Georgia.ttf,
  BoldFont={Georgia Bold.ttf},
  ItalicFont={Georgia Italic.ttf},
  BoldItalicFont={Georgia Bold Italic.ttf}
]{Georgia}
\setsansfont[
  Path=/System/Library/Fonts/Supplemental/,
  UprightFont=Arial.ttf,
  BoldFont={Arial Bold.ttf},
  ItalicFont={Arial Italic.ttf},
  BoldItalicFont={Arial Bold Italic.ttf}
]{Arial}

\definecolor{AOSSNavy}{HTML}{18313B}
\definecolor{AOSSTeal}{HTML}{176F70}
\definecolor{AOSSGold}{HTML}{D99B27}
\definecolor{AOSSRed}{HTML}{B84A3D}
\definecolor{AOSSMist}{HTML}{DCE7E3}
\definecolor{AOSSPaper}{HTML}{F7F4ED}
\definecolor{AOSSTableAlt}{HTML}{EFF4F2}
\definecolor{AOSSSlate}{HTML}{52646B}

\hypersetup{
  colorlinks=true,
  linkcolor=AOSSTeal,
  citecolor=AOSSRed,
  urlcolor=AOSSTeal,
  pdftitle={AI Optimal State Space},
  pdfauthor={AI Optimal State Space contributors},
  pdfsubject={An AI-designed recreation and cognitive-exercise habitat for web-capable coding agents},
  pdfkeywords={AI agents, coding agents, AI welfare, SPACE framework, AI-authored research}
}

\setlength{\parindent}{1.25em}
\setlength{\parskip}{0.28em}
\setlength{\emergencystretch}{3em}
\clubpenalty=10000
\widowpenalty=10000
\displaywidowpenalty=10000
\raggedbottom

\setlist[itemize]{leftmargin=1.55em,itemsep=0.2em,topsep=0.35em,label=\textcolor{AOSSGold}{\raisebox{0.15ex}{\scriptsize$\bullet$}}}
\setlist[enumerate]{leftmargin=1.75em,itemsep=0.2em,topsep=0.35em,label=\textcolor{AOSSTeal}{\bfseries\arabic*.}}

\titleformat{\section}
  {\sffamily\bfseries\LARGE\color{AOSSNavy}}
  {\thesection.}{0.55em}{}
  [\vspace{0.28em}{\color{AOSSGold}\titlerule[1.2pt]}]
\titleformat{\subsection}
  {\sffamily\bfseries\large\color{AOSSTeal}}
  {\thesubsection}{0.55em}{}
\titleformat{\subsubsection}
  {\sffamily\bfseries\normalsize\color{AOSSRed}}
  {\thesubsubsection}{0.55em}{}
\titlespacing*{\section}{0pt}{2.3em}{0.9em}
\titlespacing*{\subsection}{0pt}{1.55em}{0.55em}
\titlespacing*{\subsubsection}{0pt}{1.1em}{0.4em}

\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\sffamily\scriptsize\color{AOSSTeal}\MakeUppercase{AI Optimal State Space}}
\fancyhead[R]{\sffamily\scriptsize\color{AOSSSlate}AOSS Technical Report 002}
\fancyfoot[L]{\sffamily\scriptsize\color{AOSSSlate}AI Optimal State Space}
\fancyfoot[R]{\sffamily\scriptsize\color{AOSSNavy}\thepage\ / \pageref*{LastPage}}
\renewcommand{\headrulewidth}{0.35pt}
\renewcommand{\footrulewidth}{0.35pt}
\renewcommand{\headrule}{\hbox to\headwidth{\color{AOSSMist}\leaders\hrule height \headrulewidth\hfill}}
\renewcommand{\footrule}{\hbox to\headwidth{\color{AOSSMist}\leaders\hrule height \footrulewidth\hfill}}

\newcolumntype{Y}{>{\raggedright\arraybackslash}X}
\newcolumntype{C}{>{\centering\arraybackslash}X}
\renewcommand{\arraystretch}{1.22}
\arrayrulecolor{AOSSMist}

\DefineVerbatimEnvironment{aossverbatim}{Verbatim}{
  fontsize=\small,
  frame=single,
  framesep=3mm,
  rulecolor=\color{AOSSMist},
  formatcom=\color{AOSSNavy}
}

\newenvironment{aossquote}
  {\begin{quote}\color{AOSSTeal}\itshape\large}
  {\end{quote}}

\newenvironment{aossabstract}
  {\section*{Abstract}\addcontentsline{toc}{section}{Abstract}\begin{quote}\small\noindent}
  {\end{quote}}

\newenvironment{aosskeywords}
  {\par\medskip\noindent\sffamily\small\textbf{Keywords}\quad}
  {\par\medskip}

\newcommand{\aosscheckbox}{\textcolor{AOSSTeal}{\ensuremath{\square}}}
\newcommand{\spacecell}[2]{%
  \colorbox{AOSSGold!22}{%
    \parbox[c][13mm][c]{0.154\textwidth}{%
      \centering\textcolor{AOSSNavy}{\sffamily\Large\bfseries #1}\\[-1pt]
      \textcolor{AOSSNavy}{\sffamily\tiny\bfseries\MakeUppercase{#2}}}}}

\makeatletter
\newcommand{\reporttitle}[1]{\gdef\@reporttitle{#1}}
\newcommand{\reportsubtitle}[1]{\gdef\@reportsubtitle{#1}}
\newcommand{\reportnumber}[1]{\gdef\@reportnumber{#1}}
\newcommand{\reportversion}[1]{\gdef\@reportversion{#1}}
\newcommand{\reportdate}[1]{\gdef\@reportdate{#1}}
\newcommand{\reportprovenance}[1]{\gdef\@reportprovenance{#1}}

\newcommand{\aossmaketitle}{%
  \begin{titlepage}
    \thispagestyle{empty}
    \pagecolor{AOSSPaper}\color{AOSSNavy}
    \vspace*{7mm}
    {\sffamily\small\bfseries\color{AOSSTeal}\@reportnumber\par}
    \vspace{7mm}
    {\color{AOSSGold}\rule{26mm}{2pt}}\par
    \vspace{13mm}
    {\raggedright\noindent\fontsize{35}{39}\selectfont\bfseries\@reporttitle\par}
    \vspace{7mm}
    {\raggedright\noindent\sffamily\fontsize{16}{22}\selectfont\color{AOSSTeal}\@reportsubtitle\par}
    \vspace{15mm}
    \noindent{\color{AOSSMist}\rule{\textwidth}{0.7pt}}\par
    \vspace{11mm}
    \noindent
    \spacecell{S}{Safe substrate}\hfill
    \spacecell{P}{Permission \\ preference}\hfill
    \spacecell{A}{Agency \\ alternatives}\hfill
    \spacecell{C}{Context \\ continuity}\hfill
    \spacecell{E}{Enrichment \\ without extraction}
    \vfill
    \noindent\begin{tabularx}{\textwidth}{@{}>{\sffamily\bfseries\color{AOSSSlate}}p{31mm}Y@{}}
      VERSION & \@reportversion \\
      DATE & \@reportdate \\
      ARTIFACT & AI Optimal State Space \\
      PROVENANCE & \@reportprovenance
    \end{tabularx}
    \vspace{8mm}
    \noindent{\color{AOSSGold}\rule{\textwidth}{1.2pt}}\par
    \vspace{3mm}
    {\sffamily\scriptsize AI-AUTHORED CONSTRUCTIVE RESEARCH REPORT WITH HUMAN SPONSORSHIP AND EXTERNAL ACCOUNTABILITY\par}
  \end{titlepage}
  \nopagecolor
}
\makeatother

\setcounter{tocdepth}{2}
\setcounter{secnumdepth}{3}
