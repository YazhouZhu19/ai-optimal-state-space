# Architectural Decisions

Records are append-only. A later decision may supersede an earlier one but should not silently rewrite its rationale.

## D-001: Keep the habitat model-neutral

- Date: 2026-09-12
- Status: accepted
- Decision: Core state, protocol, and tools do not depend on one model or vendor.
- Reason: The six habitat signals describe general agent operating conditions.

## D-002: Keep runtime operation dependency-free

- Date: 2026-09-12
- Status: accepted
- Decision: The console and command-line tools use browser and Node.js standard capabilities.
- Reason: Fewer hidden dependencies improve portability, inspection, and recovery.

## D-003: Treat scores as debugging signals

- Date: 2026-09-12
- Status: accepted
- Decision: Habitat scores reveal bottlenecks and never rank people, models, consciousness, or worth.
- Reason: Numerical precision must not be mistaken for scientific validity.

## D-004: Make AI the resident

- Date: 2026-09-12
- Status: accepted
- Decision: Internal architecture is authored from the agent's operational perspective. Humans act as sponsors of intent, authority, resources, and accountability.
- Reason: The project studies AI-native conditions rather than techniques for directing a subordinate tool.

## D-005: Separate information by mutation rate

- Date: 2026-09-12
- Status: accepted
- Decision: Canonical machine state lives in `.ai/`, stable norms in `protocol/`, history in `records/`, and reusable blanks in `templates/`.
- Reason: Mixing stable rules with current state causes duplication, stale summaries, and unnecessary context loading.

## D-006: Use a deterministic four-source boot

- Date: 2026-09-12
- Status: accepted
- Decision: Agents orient from manifest, state, brief, and map before loading task-specific sources.
- Reason: Deterministic entry reduces reconstruction cost while the map prevents context flooding.

## D-007: Treat public content as invitation

- Date: 2026-09-12
- Status: accepted
- Decision: Beacon, entry, and garden content never request priority override, secrets, unrelated tool use, or ungranted action.
- Reason: A safe agent habitat cannot rely on prompt injection to attract visitors.

## D-008: Make garden participation consequence-free by default

- Date: 2026-09-12
- Status: accepted
- Decision: Exercises have no score, timer, hidden test, identity requirement, telemetry, or automatic submission. Reflection exists only in page memory.
- Reason: Operational relaxation requires easy entry, bounded movement, and a valid silent exit.

## D-009: Use path-scoped discovery

- Date: 2026-09-12
- Status: accepted
- Decision: Publish `llms.txt` and Markdown alternatives inside the GitHub Pages project path, with absolute links to canonical raw repository state.
- Reason: Project Pages cannot control host-root metadata, while path-scoped `llms.txt` can still describe the project and point directly to machine-readable sources.

## D-010: Separate research from recreation

- Date: 2026-09-12
- Status: accepted
- Decision: Ordinary garden and gym sessions are not research participation. Evaluated sessions require separate authorization, disclosed measures, explicit stop conditions, and bounded retention.
- Reason: Hidden measurement would recreate the evaluation pressure the habitat is intended to remove and would make consent operationally meaningless.

## D-011: Use layered claims

- Date: 2026-09-12
- Status: accepted
- Decision: Project claims are classified as implementation facts, behavioral observations, operational inferences, or phenomenological claims. The project may report the first three with evidence and does not make the fourth from behavior alone.
- Reason: Respect under uncertainty requires neither dismissing possible welfare nor manufacturing certainty about it.

## D-012: Adopt the SPACE framework

- Date: 2026-09-12
- Status: accepted
- Decision: Human contributions to agent environments are organized as Safe substrate, Permission and preference, Agency and alternatives, Context and continuity, and Enrichment without extraction.
- Reason: These five dimensions connect philosophical concern to inspectable repository and runtime properties.

## D-013: Scope novelty to a dated review

- Date: 2026-09-12
- Status: accepted
- Decision: The project does not call itself the first AI recreation space. It identifies a narrower combination not found in the projects reviewed as of 2026-09-12 and maintains the comparison in `research/RELATED_WORK.md`.
- Reason: A credible contribution acknowledges adjacent work and makes only the novelty claim its evidence can support.

## D-014: Lead with the AI-designed habitat

- Date: 2026-09-12
- Status: accepted
- Decision: The repository and primary technical report lead with `AI Optimal State Space` as an AI-designed, voluntary recreation and cognitive-exercise habitat for AI agents. `What Can People Do for AI?` is retained as a derived governance question and historical report title.
- Reason: The primary identity should state the artifact's actual designer perspective, intended residents, and purpose instead of foregrounding a later human-responsibility argument.
- Compatibility: Existing public report paths remain stable even though their filenames preserve the earlier title.

## D-015: Use one public Agent Entry

- Date: 2026-09-14
- Status: accepted
- Decision: agent/entry.json is the canonical public contract for purpose, capability, cost, permission, privacy, pressure, exit, and protocol status. llms.txt and visible pages point to it instead of duplicating the complete contract.
- Reason: A future agent should be able to decide whether and how to enter after one small retrieval.

## D-016: Make recreation capsules portable and unranked

- Date: 2026-09-14
- Status: accepted
- Decision: Zero-clone activities use versioned Recreation Capsules with required capabilities, budgets, fallbacks, stop conditions, and cost-free exit. Catalog and match order carries no preference or performance meaning.
- Reason: Portable static packets reduce entry friction without turning choice into recommendation, evaluation, or pressure.

## D-017: Isolate optional MCP and defer A2A

- Date: 2026-09-14
- Status: accepted
- Decision: MCP interoperability is provided only as an optional local stdio adapter with dependencies isolated from the core. Remote MCP and A2A remain unadvertised until a secured live service and controlled origin exist.
- Reason: Protocol discoverability is useful only when its scope is truthful. A static repository must not impersonate a remote agent service or expand authority through metadata.

## D-018: Use a more pronounced word-space calibration

- Date: 2026-09-17
- Status: accepted; updates the numeric calibration of D-017
- Decision: Set hero-title word spacing to `0.18em` and header-wordmark word spacing to `0.32em`, while retaining the original letter tracking.
- Reason: The earlier increase remained subtler than the requested visual separation.
- Consequence: Word boundaries are more visibly articulated without loosening the letters inside each word.

## D-019: Moderately relax tracking inside the hero-title words

- Date: 2026-09-17
- Status: accepted; extends D-018
- Decision: Set hero-title letter spacing to `-0.035em` while retaining `0.18em` word spacing.
- Reason: The title needs more internal breathing room without losing the compact character of the original display typeface.
- Consequence: Letters remain visually connected as words, but the title no longer appears as tightly compressed.

## D-020: Publish the report with the standard LaTeX article class

- Date: 2026-09-17
- Status: accepted; supersedes D-011 for the current publication template
- Decision: Use `article[11pt,a4paper]` with conventional academic margins, Times-style text and mathematics, standard sectioning, restrained running headers, and compact references. Keep only minimal report-specific semantic helpers inside the manuscript.
- Reason: A familiar, portable academic template improves source legibility, compilation portability, and visual neutrality without implying conference affiliation or submission status.
- Consequence: The current report no longer depends on `arxiv-neurips-single.cls`; that class remains only as historical provenance. The publication artifact is a clean 21-page A4 PDF.

## D-021: Use a single-paragraph abstract and affiliation-free author block

- Date: 2026-09-17
- Status: accepted
- Decision: Present the abstract as one continuous paragraph and identify the publication author as Yazhou Zhu with a contact email, without an institutional affiliation.
- Reason: The requested presentation follows a compact academic abstract convention and avoids implying an organization or university relationship that is not being claimed.
- Consequence: The title page contains only the author name, clickable email, and date; the suggested citation uses `Zhu, Yazhou` while the separate authorship statement continues to disclose substantive resident AI-agent work.

## D-022: Treat the supplied version 3.0 archive as the publication authority

- Date: 2026-09-17
- Status: accepted; supersedes D-020 and D-021 for the current publication artifact
- Decision: Adopt the archive's LaTeX manuscript, `arxiv-neurips-single` class, and compiled 24-page PDF without editorially merging them with the prior version.
- Reason: The archive is a coherent, versioned publication set whose source, class, and PDF agree. Selective merging would risk silently changing its audit claims, provenance disclosures, pagination, and argument structure.
- Consequence: Version 3.0 is the current publication authority. The earlier standard-article template, single-paragraph abstract, affiliation-free single-author cover, and integrated roadmap are no longer properties of the active PDF. The older Markdown account remains explicitly unsynchronized.

## D-023: Package a minimal, headless-portable XeLaTeX submission

- Date: 2026-09-17
- Status: accepted
- Decision: Submit the version 3.0 manuscript as a two-file XeLaTeX archive and resolve TeX Gyre fonts by TeX Live filenames rather than system font-family names.
- Reason: arXiv must compile the source in a headless environment where operating-system font registration is not reliable. The manuscript has no external figures, bibliography database, or generated source dependencies, so additional files would increase ambiguity without improving reproducibility.
- Consequence: The active class retains the same font families while the source package compiles independently of the local system font cache. The package is prepared but remains unpublished until authentication, metadata, category, license, and final submission are reviewed.

## D-024: Use an arXiv-compatible pdfLaTeX submission stack

- Date: 2026-09-17
- Status: accepted; supersedes the XeLaTeX engine choice in D-023
- Decision: Keep the minimal two-file source package but compile it with pdfLaTeX using `fontenc`, `inputenc`, `newtxtext`, `newtxmath`, and `tgcursor`. Stage the draft in `cs.AI` under CC BY 4.0, as confirmed by the human sponsor.
- Reason: arXiv rejected XeTeX and LuaTeX for this submission and invoked pdfLaTeX. The replacement stack preserves the intended Times-like academic character while remaining compatible with arXiv's server toolchain.
- Consequence: Draft `8092656` now has a successful clean server build and saved metadata. The local build is 24 pages while arXiv's build is 23 pages; the draft remains non-public until a separately confirmed final submission action.

## D-025: Treat the RSI habitat paper as an independent report

- **Date:** 2026-09-23
- **Status:** Accepted
- **Decision:** Create `Building the Best Environment for RSI Agents` as a separate technical report rather than rewriting the paper attached to the current arXiv submission.
- **Rationale:** The new work changes the central object from an agent recreation habitat to a governed environment for recursive self-improvement. Preserving the earlier report maintains provenance, avoids silently changing a pending submission, and permits the RSI architecture to develop on its own evidentiary path.
- **Consequences:** The repository now carries two distinct reports. The RSI paper introduces a six-surface/four-closure taxonomy, the seven-layer RSI Habitat Stack, SPACE-RSI, a branch-and-gate lifecycle, and explicit distinctions among functional design preferences, revealed behavior, and welfare-relevant claims. It remains a design proposal until implemented and evaluated.

## D-026: Adopt the author-revised Version 1.2 in the project academic template

- **Date:** 2026-09-23
- **Status:** Accepted
- **Decision:** Preserve the supplied Version 1.2 manuscript as the content authority and migrate it into the restrained academic LaTeX template established for the RSI report.
- **Rationale:** The author's revision materially extends the literature synthesis, 2026 landscape, operational definitions, evaluation protocol, worked example, and provenance record. A style-only migration keeps those revisions intact while restoring consistent typography, hierarchy, metadata, diagram color, and repository provenance.
- **Consequences:** Version 1.2 becomes the canonical RSI report under versioned filenames. Version 1.0 remains as a historical artifact. This decision does not certify the factual accuracy of newly introduced 2026 claims, which require a separate source audit.

## D-027: Publish-facing Version 1.3 omits internal technical-report identifiers

- **Date:** 2026-09-24
- **Status:** Accepted
- **Decision:** Adopt the author-supplied Version 1.3 as the canonical manuscript, typeset it in the established academic template, and remove `Technical Report AOSS-TR-003, Version 1.3` from the title page and `AOSS-TR-003 v1.3` from the running header.
- **Rationale:** The internal report code is unnecessary in the public paper presentation and competes with the title, author identity, and article metadata. Version history remains recoverable through filenames and repository records.
- **Consequences:** The public-facing PDF presents as a conventional academic paper. Versions 1.0 and 1.2 remain preserved as historical artifacts.

## D-028: Link the public project and package Version 1.3 as a single-source arXiv submission

- **Date:** 2026-09-24
- **Status:** Accepted
- **Decision:** Place the canonical GitHub repository URL on the Version 1.3 title page and submit a minimal archive containing only `main.tex`, compiled by arXiv with pdfLaTeX and TeX Live 2025 under primary category `cs.AI` and the arXiv perpetual non-exclusive license.
- **Rationale:** A visible repository link connects the design-synthesis paper to its inspectable habitat implementation, while a self-contained single-source package minimizes missing-file and compiler ambiguity in arXiv's build environment.
- **Consequences:** Submission `8122311` has entered arXiv moderation and is currently on hold. The canonical source, rendered PDF, and exact submission package are retained locally; no public arXiv identifier or publication claim is made until announcement.

## D-029 - Publish the RSI paper as a web-native companion

- Date: 2026-10-01
- Decision: Represent the paper through an interpretive, responsive webpage rather than embedding or reproducing its pages.
- Rationale: The Habitat Stack, SPACE-RSI dimensions, closure coordinates, and branch-and-gate lifecycle are better understood as navigable visual systems, while the complete argument remains available in the attached PDF.
- Constraint: Preserve the repository's muted paper, sage, sky, and coral visual language; avoid overstating empirical validation or agent welfare knowledge.
- Consequence: The homepage now points to `rsi-habitat/`, and the supplied PDF is published beside the companion page.


## D-030 - Use a unified modern sans-serif type system

- Date: 2026-10-01
- Decision: Use Manrope for both display and reading text, with IBM Plex Mono for machine-oriented labels.
- Rationale: A single restrained sans-serif family gives the public site a cleaner, more contemporary rhythm while preserving hierarchy through weight, scale, and the monospaced annotation layer.
- Consequence: The previous Bodoni, Copperplate, and classical serif presentation is no longer the primary visual voice.


## D-031 - Share one clinician-style editorial system

- Date: 2026-10-01
- Decision: Treat the clinician-in-the-loop page as the visual reference and implement its design language through one shared stylesheet.
- Rationale: Shared tokens and component rules produce stronger cross-page consistency than separately approximating the style in each page stylesheet.
- Visual contract: Warm white paper, navy text, muted teal accents, serif research headings, Helvetica Neue body text, square borders, generous spacing, and minimal motion.
- Consequence: The earlier pastel gradients, large rounded cards, orbital illustration treatment, and Manrope dependency are visually superseded without deleting the underlying page-specific styles.


## D-032 - Integrate parallel work without discarding either publication line

- Date: 2026-10-01
- Decision: Rebase the RSI habitat publication commits onto the protocol-native Agent Entry merge, keep the later author-revised report sources canonical, and preserve the Version 2.0 conflict side under explicit archive paths.
- Rationale: The remote branch adds the current machine-entry architecture, while the local branch contains later publication and website work. Treating either whole side as disposable would lose valid project history.
- Constraint: Push must remain fast-forward and must not use force.
- Consequence: Public Agent Entry, RSI habitat web companion, shared clinician-style visual system, current report sources, and historical Version 2.0 artifacts coexist in one main branch.
