# HTML defence presentation

Open **index.html** in Edge or Chrome for the self-contained offline **29-page deck**. Cover counts as P1. Canonical standalone previews are **page1.html through page29.html**; `cover.html` is a cover alias. The two three-page insertions were revoked on 30 October 2026. Their editable sources and assets are retained, but are not registered or rendered in the active deck. Stale page30–35 outputs now display retirement notices.

## Current page/source mapping

| Displayed page | Stable manifest / scene IDs | States |
| --- | --- | ---: |
| 1 | cover | 1 |
| 2 | page1 | 9 |
| 3 | page2 | 9 |
| 4 | page4 | 5 |
| 5 | page5 | 8 |
| 6 | page6 | 8 |
| 7 | page7 | 5 |
| 8 | page8 | 7 |
| 9 | page9 | 3 |
| 10 | page10 | 6 |
| 11 | page11 | 8 |
| 12 | merged12 (page12, page13) | 10 |
| 13 | merged13 (page14, page15, page16) | 3 |
| 14 | page17 | 5 |
| 15 | page18 | 4 |
| 16 | page19 | 4 |
| 17 | page20 | 8 |
| 18 | page21 | 12 |
| 19 | page22 | 10 |
| 20 | page23 | 8 |
| 21 | page24 | 4 |
| 22 | page25 | 1 |
| 23 | aeic25 | 8 |
| 24 | aeic26_27 | 14 |
| 25 | aeic28 | 2 |
| 26 | aeic29 | 8 |
| 27 | aeic30 | 1 |
| 28 | aeic31 | 3 |
| 29 | aeic32 | 1 |

## Authoring and animation

Edit `slides.json`, source fragments/controllers in `slides/`, and shared styles/navigation; rebuild through `build.py`. Never hand-edit generated preview contents. Source IDs are stable technical identifiers, independent of displayed numbering. The builder resolves displayed footers from manifest order and retires leftover preview numbers when the manifest shrinks.

`merged12` wraps legacy page12+page13; `merged13` wraps page14+page15+page16. Their existing scene controllers provide the reversible internal object Morphs. Preserve their object geometry and correspondence.

Page boundaries switch immediately except P5's semantic pyramid-to-progress-bar entrance and normal-Next P12 final→P13 first (500 ms) and P13 final→P14 first (750 ms). The latter reuse the original page14/page17 engines and require predecessor final state/destination first state. Direct hashes, backward navigation and restart settle without replaying those two entrances. Reduced motion is immediate and cancellation stops stale wrapper/child frames. Other historical page-linking Morphs remain disabled.

P18 `page21` uses 12 states: states 1–10 retain the original sequence and 500 ms internal Morph, then Verilog and LLVM IR appear on separate clicks. Its straight code-to-code arrows and overlapping target panels follow AEiC P20; the final LLVM panel covers the lower part of Verilog. Each target click keeps a 250 ms route wipe followed by its target/code appearance. Source SVG artwork and the Page 5 code-panel reference remain unchanged.

P23 `aeic25` preserves seven paragraph clicks, including the held 25% opacity assignment to the first approach. P24 `aeic26_27` retains 14 states and its reversible 500 ms move of the same code object. P25 `aeic28` reveals the transformed FIR expression in one click. P26 `aeic29` retains eight mapping-experiment states, its IR/network/schedule and communication guides. P27 `aeic30` retains all three complete result plots in one state. P28 `aeic31` has three conclusion/future-work states; P29 `aeic32` is the static closing. Both closing positions remain provisional.

## Inactive insertions

- Chapter 3: `contracts`, `rv32i_contracts`, `rv32i_process`; historical plans `../slides-detail/page16a.md`–`page16c.md` and prompts.
- Section 4.4: `fifo_evidence`, `fm_model`, `fm_validation`; historical plans `../slides-detail/page25a.md`–`page25c.md` and prompts.

Do not register these sources from their old prompts without a new user request. The preserved source audits record code versions, evidence limits, figure provenance and earlier validation; their former page numbers are historical. Removed manifest entries are recorded in `../slides-detail/references/revoked-insertions-2026-10-30/manifest-entries.json`. Current active numbering and backup status are in `../currentplan.md` and `../defense-backup-slides.md`.
