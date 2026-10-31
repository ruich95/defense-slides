# HTML defence presentation

Open **index.html** in Edge or Chrome for the self-contained offline **36-page deck**. Cover counts as P1. Canonical standalone previews are **page1.html through page36.html**; `cover.html` is a cover alias. Planning 25B is active as **Building the FM Receiver in SynQ**, P26 (`fm_model`, seven states). Planning 25C is active as **FM Receiver: Simulation and Implementation**, P27 (`fm_validation`, three states). FIFO remains backup. Planning 16a remains the eight-state visual page **Specifying Component Behaviour**, P17 (`contracts`); its earlier code/memory version is archived. Normalisation is active as P29 (`normalisation`, six states), after the three-state P28 overview and before balancing at P30. Product elimination is P34 (`product_elimination`, three states), after mapping results P33 and before conclusion P35. FIR application P31 leads directly to mapping experiment P32.

## Jump navigation

Choose **Jump to…** in the bottom toolbar, or press **G** (also in full screen). Enter a slide number such as `26` to open its first state, or `26.7` to open a particular state; a leading `#` is optional. **Enter/Go** submits; **Escape/Cancel** dismisses and restores focus. Invalid slide or state numbers show an inline error without changing the current view. Jumps settle directly, interrupting any active transition without replaying page entrances. Existing Next/Previous, notes and full-screen controls remain available.

Standalone previews use the same displayed slide numbers. A destination on the current slide stays in that preview and preserves its existing step-only hash; another valid slide opens `index.html` at the requested destination. The dialog explains this behavior. The shared builder supplies a small slide/state catalog without embedding other slides in each preview. The toolbar hint hides on narrower windows so all controls and status fit at 1000 px.

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
| 27 | fm_validation | 3 |
| 28 | aeic25 | 3 |
| 29 | normalisation | 6 |
| 30 | aeic26_27 | 14 |
| 31 | aeic28 | 2 |
| 32 | aeic29 | 8 |
| 33 | aeic30 | 1 |
| 34 | product_elimination | 3 |
| 35 | aeic31 | 3 |
| 36 | aeic32 | 1 |

## Authoring and animation

Edit `slides.json`, source fragments/controllers in `slides/`, and shared styles/navigation; rebuild through `build.py`. Never hand-edit generated preview contents. Source IDs are stable technical identifiers, independent of displayed numbering. The builder resolves displayed footers from manifest order and retires leftover preview numbers when the manifest shrinks.

`merged12` wraps legacy page12+page13; `merged13` wraps page14+page15+page16. Their existing scene controllers provide the reversible internal object Morphs. Preserve their object geometry and correspondence.

Page boundaries switch immediately except P5's semantic pyramid-to-progress-bar entrance and normal-Next P12 final→P13 first (500 ms) and P13 final→P14 first (750 ms). The latter reuse the original page14/page17 engines and require predecessor final state/destination first state. Direct hashes, backward navigation and restart settle without replaying those two entrances. Reduced motion is immediate and cancellation stops stale wrapper/child frames. Other historical page-linking Morphs remain disabled.

P17 `contracts` uses the user's three-row draft structure with concise 32 px introductions on an equal 205 px pitch: native setter comparison, one animated left construction with fixed native temporal reference, then original equivalence and exact contract. Native figures are uniformly scaled to balance those rows; the reference/28 px contract share one column and the last law/code share a vertical centre. The eight-state opening starts with two empty native bodies/ports; the first click reveals original set label/good arrow and the second reveals the bad inner arrow, without added text. States 4–8 retain feedback, unfolding, grouping, required wire and final contract. Three 600 ms Morphs now occur 4→5/5→6/6→7; opening reveals are immediate. Earlier rows remain visible. Added below-diagram captions/time labels stay oral. Original geometry, paint order, opacity and ports remain; only two short state-arrow refs use the corrected 1.5-unit peer marker. Original draft/other arrows stay unchanged. Reverse/direct/restart/reduced motion settle exactly; busy input is guarded and leaving/direct/R cancels frames. Prior versions are archived.

P21 `page21` uses 12 states: states 1–10 retain the original sequence and 500 ms internal Morph, then Verilog and LLVM IR appear on separate clicks. Its straight code-to-code arrows and overlapping target panels follow AEiC P20; the final LLVM panel covers the lower part of Verilog. Each target click keeps a 250 ms route wipe followed by its target/code appearance. Source SVG artwork and the Page 5 code-panel reference remain unchanged.

P28 `aeic25` now has three states/two clicks, cumulatively introducing abstract interpretations and type-driven construction at full opacity. Its former dimming/focus and lower enabler group are removed; enabler narration moves to P30 notes. The completed overview text block is vertically centred at y450, preserving its full flow height and position throughout all three states. P29 `normalisation` has six states/five clicks, preserving full vector Figure 5.1 in a fixed right slot (x930/y235/w540/h562.34, centre x1200). Left text uses 32 px Figtree and triangle bullets. The original introduction/Reduction/Result remain from state 3 through state 6. The guarantees heading and Result form reveal below at state 4, followed by Totality and Behaviour preservation at states 5/6. Each cumulative reveal takes 225 ms; there is no text replacement. Intro/list gaps are 20 px and bullet gaps 16 px. Guarantees start at y480, about 23 px below the completed first group, and final prose ends near y738. The actual-text beta rule reveals above the figure. Result form, totality and per-model behaviour preservation stay distinct, with the auto/contract explanation retained in notes and backup. The visible proof-code snippet is removed. No figure caption is added. Source and scope are in notes; implementation details are in [page28a.md](../slides-detail/page28a.md), with B14/B15 in backup notes.

P30 `aeic26_27` retains 14 states and its reversible 500 ms code-object move, with visible content and animation unchanged. Its final notes distinguish general behaviour preservation under associativity from normalisation's per-model obligations. P31 `aeic28` reveals the transformed FIR expression in one click. P32 `aeic29` retains eight mapping-experiment states. P33 `aeic30` retains all three complete result plots. P34 `product_elimination` has three states/two clicks: unused projected-product computation; model simplification before IR generation with complete Fig.5.8; selected editable Table5.1 timing rows. Figure includes the entire upper diagram, lower cost panel and High–Low legend in a fixed x941.446/y200/w517.108/h580 slot, centred at x1200. No figure caption is added. Body is 32 px, editable code28px, table30px and measurement conditions26px. Reveals/left-group replacement take225ms, with direct/back/restart/reduced/cancel support. The table measures IR-generation seconds at20 balancing iterations, with explicit Before/After elimination headers and timeout/machine conditions. [page31a.md](../slides-detail/page31a.md) specifies the page; backupB16 retains the full source table. P35 `aeic31` has three conclusion/future-work states; P36 `aeic32` is static closing. Closing positions remain provisional. The order is FIR application P31 → mapping experiment P32 → mapping results P33 → product elimination P34 → conclusion P35. Adjacent notes now introduce the mapping results first, then distinguish IR-generation time as another design-process cost, and finish with the conclusion transition. No visible content or animation changes accompany the reorder.

## P18 language boundary

`language_boundary` follows `contracts` and precedes `page20`. Five states/four clicks introduce memory context, operation signatures/FFI, the required Idris2 property, C/ACSL translation, and justification of the interface assumption. The new memRead signature uses P14 output–state ordinary-pair presentation notation; notes distinguish it from the exact thesis representation. Original readElim, ACSL and C signature text remain exact 26 px excerpts. The SAME C signature/Operation-label group moves 230 px down over 400 ms before the 225 ms ACSL reveal, with reverse/direct/reduced/cancel support. Final statuses and persistent leftward “Justify the interface assumption” arrow remain alongside the forward translation arrow and static equality highlights. No pulses or automatic proof import. P18 numbering is unchanged in the 36-page deck.

## P19 detector and P20 RV32-I summary

P19 `page20` retains six states and the 500 ms construction-to-compositions Morph. The 31 October refinement changes only final-state wrapper geometry: diagrams 20% larger, rows y500/630, label tops 520/650, with original code and construction states 1–5 unchanged. Removed limitation/SynQ callouts 463/466 and their groups are absent from active source data, with no empty clicks. Next from P19.6 enters P20.1; backward entry restores P19.6. Old #19.7/#19.8 links clamp to state 6.

P20 `rv32i_process` is the new five-state design in `../slides-detail/page16c.md`, replacing the inactive former layout. The full vector Fig. 3.10 stays fixed in an 805×660 region at x700/y140. Original Cairo SVG paths are copied for restrained blue halos; all native colours, labels, topology and legend remain. The 32 px left text reveals modelling, reasoning/validation and manual implementation cumulatively, then the final 225 ms replacement shows the manual-work limitation. Direct/back/restart/reduced-motion settle and leaving cancels pending work. No compaction, second figure, automatic entrance or new page-link Morph. SynQ follows at P21 with twelve states unchanged.

Source and highlight provenance: `assets/rv32i_process/fig3-10-highlight-map.json`. Fine figure labels are supporting detail; point to named paths orally. Notes scope selected proofs, test evidence, manual mappings and pipeline behaviour changes, without claiming automatic compilation, universal processor verification or equivalence of all arrows.

## P26 FM modelling

`fm_model` implements [25B](../slides-detail/page25b.md) as **seven held states/six clicks**, in the current 36-page deck. Hierarchy/DDC/CIC views map to child states [0,1,2,2,3,3,3]. State 3 expands CIC while retaining only the composition bullet; state 4 adds resource tracking over an identical held overview; state 5 shows configurable truncation and four integrators. In state 6 the first two headings remain context, while configurable truncation becomes the parent of indented type-configuration/inference subpoints. State 7 adds the second subpoint and aligned factual conclusion.

`build.py` embeds the compact standalone artwork/controller but adds deck-only wrapper frames. The SAME complete lower CIC moves upward in 600 ms for state 6; upper receiver/wedge leave, then the five-line signature appears beneath it. No isolated-stage copy is embedded. State 7 adds the three-line body. Native CIC width/height remain; diagram shifts 45 px right, left text widens to 690 px. Focused states place the complete CIC at y147 (23 px higher); 26 px code aligns to enclosure x861.911, signature y490/body y676.5. The figure-to-code gap is about 40 px, retained-heading gaps are 6 px and the final 32 px explanation uses secondary gray #626973. Opening uses normal left-aligned natural wrapping of “The receiver is built as a hierarchy of SynQ components.” with no explicit line break. Original standalone four-state SVG/preview remain unchanged by this integration revision. Deck input/cancel/reduced-motion behavior is retained.

Earlier six-state/centred/left-right/compact evidence remains historical in `../tmp/defense/fm-model-six-state/`, `fm-model-left-right/` and `fm-model-thesis-compact/`. Current seven-state endpoints, focus midpoint, smaller states 5/6/7 and validation are in `../tmp/defense/fm-model-seven-state/`.

Initial seven-state checks passed without errors: reveal thresholds/no leaked text, identical state 3/state 4 diagram with no child go, same CIC DOM node/size, signature after movement, exact reverse focus and resolving cancelled/direct-switched tween Promises. Current layout polish is recorded in `../tmp/defense/fm-model-seven-polish/`: states 6/7 and focus midpoint approved; 26 px exact source tokens, code/enclosure alignment within 0.005 px, 39.41 px painted figure-to-code gap, 25.5 px signature-to-body gap, actual Next/Back exact restoration, reduced motion and smaller state-7 fit passed without browser errors. All seven states share the ordinary introduction paragraph with normal left-aligned natural wrapping. Earlier 28 px/six-line evidence remains historical.

## P27 FM simulation and implementation

`fm_validation` implements [25C](../slides-detail/page25c.md) as **three held states/two clicks**, after P26 and before P28 design transformations. The two-row layout opens with the introduction alone. Click 1 reveals the LLVM IR implementation bullet and full Fig. 4.3 response in the fixed lower-left slot. Click 2 retains both and adds the Verilog HDL implementation bullet and complete original Fig. 4.4 spectrum in the fixed lower-right slot. Both complete plots remain visible in the final state. The top row contains only the introduction and two bullets. The former route diagram and on-slide rate/sampling paragraphs are removed. Final speaker notes retain the 122.88 MHz input / 960 kHz demodulated baseband result, one output per 128 inputs with deterministic latency. Source provenance remains in notes. No new experiment or full receiver-correctness proof is implied.

The introduction is one line at x91/y175/w1419. Both bullets use 32 px Figtree/1.28 at x128/w1382, y240 and y300, with triangular markers at x91 and only short prefixes bold. Plot slots are x91 and x850, y350/w690/h470 (centres x436/x1195), ending y820 above the footer. Full source plots are contained proportionally; intrinsic titles, axes, inset and legend remain. No captions are added. The first plot never rescales or moves when the second appears. Each click reveals its bullet/plot pair together over 225 ms. No extra state, automatic advance or cross-page Morph. Direct/back/restart/reduced-motion/cancellation settle deterministically. Current full/small endpoints and Edge navigation/asset checks are in `../tmp/defense/fm-validation-two-row/`; older `fm-validation-review` screenshots are historical.

## Inactive insertions

- Chapter 3: `rv32i_contracts` and the former `rv32i_process` layout; the withdrawn 16b plan/prompt is archived in `../slides-detail/archive-16b-rv32i-2026-10-30/`; the old 16c plan/prompt is in `../slides-detail/archive-before-16c-replan-2026-10-30/`. Current `page16c.md` implements active P20. The current `page16b.md` instead specifies active `language_boundary` (P18). The old `contracts` implementation is archived under `../tmp/defense/p16a-visual-redesign/before`; old 16a documents are in `../slides-detail/archive-16a-before-visual-redesign-2026-10-30`. The current 16a specifications authorise the newly active visual redesign at P17.
- Section 4.4: `fifo_evidence` remains backup. Historical `fm_model` and `fm_validation` layouts were replaced by active P26 (seven states) and P27 (three states); current `../slides-detail/page25b.md`, `page25c.md` and their prompts describe the implementations.

Do not register these sources from their old prompts without a new user request. The preserved source audits record code versions, evidence limits, figure provenance and earlier validation; their former page numbers are historical. Removed manifest entries are recorded in `../slides-detail/references/revoked-insertions-2026-10-30/manifest-entries.json`. Current active numbering and backup status are in `../currentplan.md` and `../defense-backup-slides.md`.


Code highlighting follows P10: functions and ACSL built-ins #0029ED, syntax/operators #8A2BE2, types #78001A, variables and the usage multiplicity black, comment delimiters muted grey. The equalities retain static pale-blue backgrounds with no underlines or pulses. Token text, whitespace metrics and code geometry remain fixed.
