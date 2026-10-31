# HTML defence presentation

Open **index.html** in Edge or Chrome for the self-contained offline **33-page deck**. Cover counts as P1. Canonical standalone previews are **page1.html through page33.html**; `cover.html` is a cover alias. Planning 25B is active as **Building the FM Receiver in SynQ**, P26 (`fm_model`, seven states). The FM results page and FIFO remain inactive. Planning 16a remains the eight-state visual page **Specifying Component Behaviour**, P17 (`contracts`); its earlier code/memory version is archived. Stale page34–35 outputs display retirement notices.

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
| 17 | contracts | 8 |
| 18 | language_boundary | 5 |
| 19 | page20 | 6 |
| 20 | rv32i_process | 5 |
| 21 | page21 | 12 |
| 22 | page22 | 10 |
| 23 | page23 | 8 |
| 24 | page24 | 4 |
| 25 | page25 | 1 |
| 26 | fm_model | 7 |
| 27 | aeic25 | 8 |
| 28 | aeic26_27 | 14 |
| 29 | aeic28 | 2 |
| 30 | aeic29 | 8 |
| 31 | aeic30 | 1 |
| 32 | aeic31 | 3 |
| 33 | aeic32 | 1 |

## Authoring and animation

Edit `slides.json`, source fragments/controllers in `slides/`, and shared styles/navigation; rebuild through `build.py`. Never hand-edit generated preview contents. Source IDs are stable technical identifiers, independent of displayed numbering. The builder resolves displayed footers from manifest order and retires leftover preview numbers when the manifest shrinks.

`merged12` wraps legacy page12+page13; `merged13` wraps page14+page15+page16. Their existing scene controllers provide the reversible internal object Morphs. Preserve their object geometry and correspondence.

Page boundaries switch immediately except P5's semantic pyramid-to-progress-bar entrance and normal-Next P12 final→P13 first (500 ms) and P13 final→P14 first (750 ms). The latter reuse the original page14/page17 engines and require predecessor final state/destination first state. Direct hashes, backward navigation and restart settle without replaying those two entrances. Reduced motion is immediate and cancellation stops stale wrapper/child frames. Other historical page-linking Morphs remain disabled.

P17 `contracts` uses the user's three-row draft structure with concise 32 px introductions on an equal 205 px pitch: native setter comparison, one animated left construction with fixed native temporal reference, then original equivalence and exact contract. Native figures are uniformly scaled to balance those rows; the reference/28 px contract share one column and the last law/code share a vertical centre. The eight-state opening starts with two empty native bodies/ports; the first click reveals original set label/good arrow and the second reveals the bad inner arrow, without added text. States 4–8 retain feedback, unfolding, grouping, required wire and final contract. Three 600 ms Morphs now occur 4→5/5→6/6→7; opening reveals are immediate. Earlier rows remain visible. Added below-diagram captions/time labels stay oral. Original geometry, paint order, opacity and ports remain; only two short state-arrow refs use the corrected 1.5-unit peer marker. Original draft/other arrows stay unchanged. Reverse/direct/restart/reduced motion settle exactly; busy input is guarded and leaving/direct/R cancels frames. Prior versions are archived.

P21 `page21` uses 12 states: states 1–10 retain the original sequence and 500 ms internal Morph, then Verilog and LLVM IR appear on separate clicks. Its straight code-to-code arrows and overlapping target panels follow AEiC P20; the final LLVM panel covers the lower part of Verilog. Each target click keeps a 250 ms route wipe followed by its target/code appearance. Source SVG artwork and the Page 5 code-panel reference remain unchanged.

P27 `aeic25` preserves seven paragraph clicks, including the held 25% opacity assignment to the first approach. P28 `aeic26_27` retains 14 states and its reversible 500 ms move of the same code object. P29 `aeic28` reveals the transformed FIR expression in one click. P30 `aeic29` retains eight mapping-experiment states, its IR/network/schedule and communication guides. P31 `aeic30` retains all three complete result plots in one state. P32 `aeic31` has three conclusion/future-work states; P33 `aeic32` is the static closing. Both closing positions remain provisional. Existing planning filenames retain their earlier numbers.

## P18 language boundary

`language_boundary` follows `contracts` and precedes `page20`. Five states/four clicks introduce memory context, operation signatures/FFI, the required Idris2 property, C/ACSL translation, and justification of the interface assumption. The new memRead signature uses P14 output–state ordinary-pair presentation notation; notes distinguish it from the exact thesis representation. Original readElim, ACSL and C signature text remain exact 26 px excerpts. The SAME C signature/Operation-label group moves 230 px down over 400 ms before the 225 ms ACSL reveal, with reverse/direct/reduced/cancel support. Final statuses and persistent leftward “Justify the interface assumption” arrow remain alongside the forward translation arrow and static equality highlights. No pulses or automatic proof import. P18 numbering is unchanged in the 33-page deck.

## P19 detector and P20 RV32-I summary

P19 `page20` retains six states and the 500 ms construction-to-compositions Morph. The 31 October refinement changes only final-state wrapper geometry: diagrams 20% larger, rows y500/630, label tops 520/650, with original code and construction states 1–5 unchanged. Removed limitation/SynQ callouts 463/466 and their groups are absent from active source data, with no empty clicks. Next from P19.6 enters P20.1; backward entry restores P19.6. Old #19.7/#19.8 links clamp to state 6.

P20 `rv32i_process` is the new five-state design in `../slides-detail/page16c.md`, replacing the inactive former layout. The full vector Fig. 3.10 stays fixed in an 805×660 region at x700/y140. Original Cairo SVG paths are copied for restrained blue halos; all native colours, labels, topology and legend remain. The 32 px left text reveals modelling, reasoning/validation and manual implementation cumulatively, then the final 225 ms replacement shows the manual-work limitation. Direct/back/restart/reduced-motion settle and leaving cancels pending work. No compaction, second figure, automatic entrance or new page-link Morph. SynQ follows at P21 with twelve states unchanged.

Source and highlight provenance: `assets/rv32i_process/fig3-10-highlight-map.json`. Fine figure labels are supporting detail; point to named paths orally. Notes scope selected proofs, test evidence, manual mappings and pipeline behaviour changes, without claiming automatic compilation, universal processor verification or equivalence of all arrows.

## P26 FM modelling

`fm_model` implements [25B](../slides-detail/page25b.md) as **seven held states/six clicks**, retaining 33 pages. Hierarchy/DDC/CIC views map to child states [0,1,2,2,3,3,3]. State 3 expands CIC while retaining only the composition bullet; state 4 adds resource tracking over an identical held overview; state 5 shows configurable truncation and four integrators. In state 6 the first two headings remain context, while configurable truncation becomes the parent of indented type-configuration/inference subpoints. State 7 adds the second subpoint and aligned factual conclusion.

`build.py` embeds the compact standalone artwork/controller but adds deck-only wrapper frames. The SAME complete lower CIC moves upward in 600 ms for state 6; upper receiver/wedge leave, then the five-line signature appears beneath it. No isolated-stage copy is embedded. State 7 adds the three-line body. Native CIC width/height remain; diagram shifts 45 px right, left text widens to 690 px. Focused states place the complete CIC at y147 (23 px higher); 26 px code aligns to enclosure x861.911, signature y490/body y676.5. The figure-to-code gap is about 40 px, retained-heading gaps are 6 px and the final 32 px explanation uses secondary gray #626973. Opening uses normal left-aligned natural wrapping of “The receiver is built as a hierarchy of SynQ components.” with no explicit line break. Original standalone four-state SVG/preview remain unchanged by this integration revision. Deck input/cancel/reduced-motion behavior is retained.

Earlier six-state/centred/left-right/compact evidence remains historical in `../tmp/defense/fm-model-six-state/`, `fm-model-left-right/` and `fm-model-thesis-compact/`. Current seven-state endpoints, focus midpoint, smaller states 5/6/7 and validation are in `../tmp/defense/fm-model-seven-state/`.

Initial seven-state checks passed without errors: reveal thresholds/no leaked text, identical state 3/state 4 diagram with no child go, same CIC DOM node/size, signature after movement, exact reverse focus and resolving cancelled/direct-switched tween Promises. Current layout polish is recorded in `../tmp/defense/fm-model-seven-polish/`: states 6/7 and focus midpoint approved; 26 px exact source tokens, code/enclosure alignment within 0.005 px, 39.41 px painted figure-to-code gap, 25.5 px signature-to-body gap, actual Next/Back exact restoration, reduced motion and smaller state-7 fit passed without browser errors. All seven states share the ordinary introduction paragraph with normal left-aligned natural wrapping. Earlier 28 px/six-line evidence remains historical.

## Inactive insertions

- Chapter 3: `rv32i_contracts` and the former `rv32i_process` layout; the withdrawn 16b plan/prompt is archived in `../slides-detail/archive-16b-rv32i-2026-10-30/`; the old 16c plan/prompt is in `../slides-detail/archive-before-16c-replan-2026-10-30/`. Current `page16c.md` implements active P20. The current `page16b.md` instead specifies active `language_boundary` (P18). The old `contracts` implementation is archived under `../tmp/defense/p16a-visual-redesign/before`; old 16a documents are in `../slides-detail/archive-16a-before-visual-redesign-2026-10-30`. The current 16a specifications authorise the newly active visual redesign at P17.
- Section 4.4: `fifo_evidence` remains backup and `fm_validation` remains planned. The historical `fm_model` layout was replaced by active P26; current `../slides-detail/page25b.md` and its prompt document the six-state implementation.

Do not register these sources from their old prompts without a new user request. The preserved source audits record code versions, evidence limits, figure provenance and earlier validation; their former page numbers are historical. Removed manifest entries are recorded in `../slides-detail/references/revoked-insertions-2026-10-30/manifest-entries.json`. Current active numbering and backup status are in `../currentplan.md` and `../defense-backup-slides.md`.


Code highlighting follows P10: functions and ACSL built-ins #0029ED, syntax/operators #8A2BE2, types #78001A, variables and the usage multiplicity black, comment delimiters muted grey. The equalities retain static pale-blue backgrounds with no underlines or pulses. Token text, whitespace metrics and code geometry remain fixed.
