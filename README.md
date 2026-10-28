# HTML defence presentation

Open **index.html** in Edge or Chrome to present the complete eight-page introduction, ending with The Proposed (Partial) Solution: SynQ. The generated presentation is self-contained and works offline or on GitHub Pages.

## Structure

```text
defense-html/
  index.html             Generated complete presentation
  cover.html             Generated cover preview
  page1.html             Generated Embedded Systems preview
  page2.html             Generated animated-slide preview
  page4.html             Generated Requirements for a Design Framework preview
  page5.html             Generated Connecting Abstraction Levels preview
  page6.html             Generated Type Theory as a Programming Language preview
  page7.html             Generated Research Question and Objectives preview
  slides.json            Slide order, titles, source paths and reveal counts
  slides/
    cover.html           Cover source fragment
    page1.html           Embedded Systems source fragment
    page1.js             Example and characteristic reveals with speaker notes
    page2.html           Embedded System Design source fragment
    page2.js             FM animation and pyramid reveal controller
    page4.html           Requirements for a Design Framework source fragment
    page4.js             Five cumulative states with speaker notes
    page5.html           Connecting Abstraction Levels source fragment
    page5.js             Automatic entrance and eight cumulative reveal states
    page6.html           Type Theory as a Programming Language source fragment
    page6.js             Eight cumulative paper/capability reveal states
    page7.html           Full-width research question and objectives
    page7.js             Five states with synchronised colour associations
    page8.html           Proposed framework with Figure 1.5
    page8.js             Two-click section/removal/focus and four capability reveals
  shared/
    styles.css           Common layout, typography and slide styling
    navigation.js        Deck navigation, full screen and notes
    shell.html           Shared document and controls
  assets/
    cover.svg            Cover imported from PowerPoint as vector artwork
    kth-logo.svg         Original KTH logo from the slide master
    Figtree.ttf          Embedded font source
    embedded-systems/    Approved application PNG illustrations
    type-theory-papers/  Unchanged PNG paper images extracted from AEiC
  build.py               Builds the deck and standalone previews
  .nojekyll              Static GitHub Pages publishing
```

Edit the source files under `slides/` and `shared/`, then run `build.py` with Python. Generated HTML files are outputs and will be replaced by the next build. The existing `tmp/defense/build-defense-page2.py` entry point forwards to this build for compatibility.

To add a slide, create a section fragment in `slides/` with a unique ID and the `slide` class, then add an entry to `slides.json`. A static slide needs only its HTML, title, one step and optional speaker notes. A slide with reveals can register a factory in `window.slideFactories` under its ID; `slides/page2.js` shows the interface. Shared navigation automatically advances to the next slide after its final reveal.

All required assets, styles and controllers are embedded into `index.html` at build time. No server or runtime network requests are required. The source folders do not need to accompany the generated HTML when presenting or sharing it.

## Controls

- Click, Space, Right Arrow or Page Down: next reveal, then next slide.
- Left Arrow or Page Up: previous reveal, then previous slide.
- F: toggle full screen. Full screen remains active when changing slides.
- S: toggle speaker notes.
- Home: beginning of the deck. End: final reveal of the deck.
- R: restart the current slide. The Restart button restarts the deck.

The cover has one state. Slide 2 (Embedded Systems) has nine states: its opening statement, three example reveals, the question, and four characteristic reveals. Its transitions take 0.2 seconds and respect reduced-motion preferences. Slide 3 (Embedded System Design) has nine states and 0.25-second transitions. Full screen hides the bottom controls. Deck links use `#1` for the cover, `#2.9` for the completed Embedded Systems slide, and `#3.7` for slide 3, reveal 7. Standalone links such as `page1.html#9` and the existing `page2.html#7` remain supported. Detailed specifications now use `slides-detail/page2.md` and `page3.md`; HTML source IDs remain `page1` and `page2`. Generated page numbers follow their position in the complete deck.

## Reference fidelity

The cover was exported directly from slide 1 of `../defense-draft.pptx`, through PowerPoint PDF export to SVG. Its original background, decoration, KTH logo, title, line wrapping, author information and date are preserved as scalable vector artwork. Its lettering is outlined in that asset to avoid browser font substitution. To revise its content, edit the PowerPoint cover and replace the exported `assets/cover.svg`.

The introduction slides retain the PowerPoint master's original logo position and size, Figtree Bold title at 28 PowerPoint points, #000061 title colour, and footer. Its 960 by 540 point slide is represented by a 1600 by 900 canvas. Embedded Systems follows page 5 of the current `defense-draft.pptx`: a full-width upper text region, a middle image region containing the three icons in a row, and a full-width lower text region containing the question and four bullets. The template's blue region outlines are layout guides, not part of the finished content. The approved braking, robot-controller and aircraft-attitude-control illustrations come from `../figures/embedded-systems-drafts/v6/`. Their transparent PNGs are embedded for offline use and displayed at matching visible heights. Speaker notes record their generation provenance and the Sander sources.

On Embedded System Design, main PLL and quadrature labels use 28 px on the canvas. The receiver remains centered between the definition and lower content edge, with the most recent smaller diagram size and fixed external ports.

The abstraction pyramid and trace come from `../figures/svg/abst-pyramid-w-trace.svg` when present, otherwise from the current `../figures/svg/abst-pyramid-trace.svg`. The inner cone is omitted from the slide; the PLL branch follows its updated source position. The rendered phase labels follow `../slides-detail/page3.md`: Specification, Modelling and Implementation. The FM animation is embedded from `../figures/radio-to-fm/radio-to-fm.svg`; rebuild that illustration first when its source artwork changes. External waveforms and arrows fade from the PLL frame onward. Only the feasible-implementations caption remains below the figures, with a leader pointing to its circle.

The speaker notes distinguish the illustrative multiplier constraint from a demonstrated FPGA implementation result. FIR scheduling and valid-sample timing remain implicit.

Displayed page 4 follows `../slides-detail/page4.md` and uses `slides/page4.html` and `slides/page4.js`. Its five cumulative states reveal Automation, Correctness with the specification cone, Practical support, then Formal support. The opening and completed trace remain visible. The completed left text block is vertically centred on the page. That final composition determines its fixed top position for every state, keeping the opening sentence and Automation stationary. Correctness appears with normal bullet spacing in state 3. In state 4, the space beneath Automation expands over 0.25 seconds, moving Correctness down as Practical support fades in. Reverse navigation collapses that space again. The pyramid reuses page 3's geometry at the same position and scale, with separately namespaced artwork IDs. The inner cone preserves the geometry, transforms, unfilled black outline and dashed rear rim from `../figures/svg/abst-pyramid-w-range.svg`. Its rim and sides retain their separate positions in the reference SVG’s paint order, so the lower rim paints in front of the modelling floor. The caption leader begins 8 canvas pixels below the caption’s bottom centre and points to the left end of the inner cone’s lower rim, stopping 6 canvas pixels outside the outline to avoid overlap. It uses page 3’s open arrowhead style and tracks the slide scale. Following the explicit layout instruction, page 4 omits the multiplier-budget ellipse, caption and leader; the Step 3 presenter guidance refers back to the preceding page's example. The cone denotes specification satisfaction schematically, not a proof or a quantitative region. Oral passages, presenter guidance and attribution appear in the speaker notes. Use `index.html#4.1` through `#4.5`, or `page4.html#1` through `#5`. Reveals fade over 0.25 seconds and respect reduced-motion preferences. Adding a later slide to `slides.json` automatically enables advancing to it after page 4's final state.


## Displayed page 5

Page 5 follows `../slides-detail/page5.md`. It has eight cumulative states. The initial state includes an automatic 250 ms entrance: the preceding slide's empty base pyramid holds briefly, compresses and moves to the right, crossfades into the draft's narrow phase bar, then reveals the opening statement. The entrance does not consume a click. Seven clicks reveal the equation, FIR model, specification bullet, C panel, Verilog panel, implementation bullet, and final question in that order, with 225 ms fades.

The approved artwork comes from `../figures/svg/page5-draft.svg`, with its 1920 by 1080 viewBox displayed at 1600 by 900 exactly once. Its edited panels, headings, overlap, colours and rotated phase labels remain intact. Imported IDs are prefixed and imported styles are scoped to the artwork. The temporary starting pyramid is cloned from the same current source as the preceding slides, with trace, cone and budget annotations removed.

Shared navigation supports an optional awaited `enter({playEntrance})` operation. It plays on normal forward entry, initial-state links, and R restart. Later-state links, reverse navigation, and programmatic `defenseDeck.go(4, state, false)` show settled states. Reduced-motion preference skips the entrance and fades. Pending page 5 motion is cancelled when leaving or superseded by programmatic navigation; extra ordinary advances during entry are ignored. Resizing and full screen preserve the current state. `#5` opens the automatic entrance, while `#5.8` opens the completed slide directly. The standalone preview uses `page5.html` and `#1` through `#8`.

Page 5 uses the preceding pages’ 1.28 line height and 18 px bullet spacing, with regular-weight bullets. Its concluding question remains bold.


## Displayed page 6

Page 6 follows `../slides-detail/page6.md`. It has eight cumulative states, with no automatic entrance: opening statement, Agda, Idris, Lean 4, Idris2, Programming bullet, Formal reasoning bullet, and the candidate-foundation statement. Each picture and its red highlight appear together. The two capability labels are bold and their explanations remain regular weight. Reveals use 225 ms fades and respect reduced motion.

`build.py` extracts the actual picture groups from slide 3 of `../final/AEiC-26.pptx`. It retains the group's placement, scale and child coordinate system, the original PNG bytes and source crops, the highlight rectangles and their theme-derived line widths, and source stacking order. The entire composition uses the source slide's proportional mapping onto 1600 by 900. No individual paper is rearranged, recropped, or replaced. In particular, all of the Idris2 abstract visible in AEiC remains visible here. The extracted images are stored under `assets/type-theory-papers/` and embedded into the generated HTML.

The left text reserves space for every reveal, preserving fixed positions. Speaker notes contain the supplied oral passages, presenter guidance and source attribution. The page has no pyramid, phase bar, FIR artwork, or boxed research question. Use `index.html#6` to start or `#6.8` for the final state. The standalone preview uses `page6.html#1` through `#8`. Returning to page 5 restores its final state without replaying its entrance.

## Planning status

Synchronized 27 October 2026. The deck contains eight pages and 51 reveal states in total. The revised approximately eight-minute introduction remains a rehearsal target within the 45-minute defense.


## Displayed page 7

Page 7 follows `../slides-detail/page7.md` and the page 7 section of `../defense-introduction-plan.md`. It has five states in one full-width Text Region: challenge summary; complete structured question replacing the summary; O1; O2; O3. The regular black leading sentence “The design process presents two challenges:” appears with the summary bullets and disappears with them. The bold black sentence “This leads to the research question:” appears with the question and stays through objective reveals, outside the verbatim thesis question. These replacing groups share a grid area that reserves the full question-group height, so subsequent reveals cannot move the objectives. The question retains every word and punctuation of the thesis question, grouped into a lead-in and three hanging-indented clauses.

All four question emphasis spans are bold from the start and black when the question first appears. O1 colours its label and framework phrase KTH Dark brick (#78001A, RGB 120, 0, 26), matching the controller's transition target. O2 colours its label and both logical/computational and accountability phrases digital blue (#0029ED). O3 colours its label and general-purpose-language phrase dark yellow (#A65900). Every objective colon and description remains regular-weight black. Objective labels have no preceding bullet markers. Prior objectives and colours remain visible.

Transitions last 225 ms. The summary fades out before the question fades in; reverse navigation restores the summary. Objective opacity and corresponding question colours change together. Reduced motion makes changes immediately, and direct links show their requested settled state. There is no automatic entrance or placeholder page 8. Speaker notes include the requested summary, complete question, objective explanations, qualifications and references.

Use `index.html#7.1` through `#7.5`, or the standalone `page7.html#1` through `#5`. Edit sources and rebuild with `build.py`; do not edit generated HTML directly.

## Displayed page 8

Page 8 is titled **The Proposed (Partial) Solution: SynQ** and follows `../slides-detail/page8.md`.

The opening reads: “To address the research question and objectives, we propose the framework SynQ¹ for **synchronous system design**, grounded in **Quantitative Type Theory (QTT)** and embedded in Idris2.” Its footnote reads “¹ SynQ — **Syn**chronous System Design with **Q**uantitative Types”. The sentence's domain and QTT phrases, plus Syn/Q in the footnote, are bold; the remainder is regular weight. Both text elements are visible and stationary throughout. The expanded-name footnote matches page 3's bottom placement (left 91 px, top 808 px) and 18 px muted-grey styling, above the footer. It is outside the main text flow; the three capability bullets follow the opening sentence with a 36 px gap. Speaker notes explicitly explain: “Idris2 provides the programming language through which we use Quantitative Type Theory.”

Page 8 follows `../slides-detail/page8.md` and has **seven states**: unlabelled full pyramid; retained portion held at its original size after upper removal; focused empty Figure 1.5 shell; Modelling (O1/O3); Design steps with transformations emphasized (O2); that same sentence with interpretations emphasized (O2); Properties (O2). Initial entry and R wait for input. Opening/name text stays fixed throughout; capability reveals retain their cumulative 225 ms fades and paired artwork, at thresholds 3–6.

The three bullets read “Modelling: construct SynQ models using Idris2 terms and functions. O1 O3”, “Design steps: express transformations and interpretations as Idris2 functions. O2”, and “Properties: specify and verify properties of models and design steps through types. O2”. Four capability clicks remain. Modelling reveals the black construction arrows and their source/target points together with the Idris2/SynQ region and labels. The next click reveals the entire Design steps sentence, emphasizes transformations in red with a subtle background, and reveals the red transformation arrow. The following click shifts subtle color/background emphasis to interpretations in blue in that same sentence and reveals blue interpretation connections and target representations. Every word stays visible and stationary, with no layout change. Properties clears the term emphasis and reveals its artwork. Reversing restores the corresponding emphasis. Mixed interpretation/projection groups retain child-level reveal timing.

Speaker notes recall page 3: transformations operate within abstraction levels, while interpretations across levels provide refinement or implementation. Both are Idris2 functions. Black arrows construct SynQ terms from Idris2 inputs that may lie outside SynQ.

The first click takes 700 ms. A contained elliptical section 35% into the green modelling band fades in over 0–150 ms, gives one gentle smooth pulse over 150–450 ms, and becomes the retained green top as the upper portion fades over 450–700 ms. Its side intersections come from the source pyramid; its front rim is solid and rear rim is initially dashed. As the upper portion fades, the rear cut rim becomes solid and stays solid in the held and focusing compositions. There is no projecting polygon, lift, deformation or lower-region movement. The held-cut state waits indefinitely for a second click.

The second click fits the retained region into the exact empty framework over 500 ms, with a subtle final crossfade only after its control geometry aligns. It does not reveal a capability. All three framework levels, including Other DSLs/IRs, preserve their source geometry, fills, transforms and paint order. The original framework SVG is unchanged. Idris2 and Implementation keep their repaired curved caption guides and styling. Tiny source fill cut-outs are not stretched during the focus animation.

Only P8's imported initial pyramid loses its text labels. Other slides and shared navigation are unchanged. Reverse from the focused shell restores the held cut, and reverse again restores the unlabelled full pyramid. Backward entry from P9 restores state 7. Direct links settle immediately; reduced motion skips pulse/movement while retaining both opening clicks. Leaving or superseding navigation cancels pending frames; repeated advances are ignored while busy. No automatic entrance hook is added.

Use `index.html#8.1`–`#8.7`, or `page8.html#1`–`#7`. Deterministic previews are `previewTransition('cut', ms)` for 0–700 ms and `previewTransition('focus', ms)` for 0–500 ms. Inspect section/rim alignment, pulse/removal timing, a stationary held cut, exact framework handoff, all seven settled states, no premature capabilities, reverse/direct links, restart, reduced motion and cancellation.

## Displayed page 10

Page 10, **Quantitative Type Theory**, follows `../slides-detail/page10.md` and has six states. The fixed opening reads “QTT combines dependent types and linear types through usage multiplicities.” The initially 34 px one-line schematic signature is `foo : (0 x : Nat) -> (1 y : Nat) -> (z : Nat) -> R x y`. The result remains independent of the ordinary unrestricted z binder.

States 2–5 reveal “Types can depend on terms.”, the complete 0 group, the complete 1 group, then the complete ω group including its Idris2 note. Each annotation has a subtle 1.5 px blue guide and underline on the associated code fragment; these remain after reveal. The z-to-omega guide uses a short elbow underneath the code, matching the 0/1 guides, and tracks the final spacing compression. The separate x/y binder-to-result dependency curves appear only in displayed state 2 and restore on reverse/direct state 2 links. Later states hide those two curves. Active pale-blue focus moves from result to 0 x, 1 y and z without changing code geometry.

The final click moves the entire annotated example upward as one composition over 400 ms and scales it to 93%, retaining 31.62 px code. Within the same motion, the multiplicity groups lift an additional 50 local pixels and their guide endpoints track them, shortening the final code-to-explanation gap by 46.5 stage pixels without smaller text. The final text groups align near their binders at stage x437.3/739.55/1060.4 with common baselines and clear gaps. The dependency sentence settles at y270.14, about 29 px below the fixed opening, and the takeaway block starts at y665. These positions move smoothly with compaction. States 1–5 keep their original positions and spacing, restored on reverse. Then both takeaway bullets fade in together over 150 ms, with bold labels: “Dependent types: formal specification and reasoning.” and “Usage multiplicities: constrain system-model construction and use.” The title, opening and footer stay fixed. Reverse hides the bullets before expanding the example. Ordinary earlier reveals use 225 ms fades. Direct links settle immediately, reduced motion skips motion, and leaving/superseding navigation cancels pending frames. The controller retains the current visual composition when interrupted.

Speaker notes distinguish term dependence from merely evaluated values and explain three arguments followed by the result. The erased Nat x illustrates erasure, not the later parametricity argument. Notes connect 1 to disciplined state/resource use, 0 to reasoning without consuming linear terms, and 0 on abstract type parameters plus a supplied constructor context to parametricity restricting model construction. References include thesis §1.2.3 and §4.2.1 and the Idris2 multiplicities tutorial. The transition leads to “Linear Terms as Resources”.

Use `index.html#10.1`–`#10.6` or `page10.html#1`–`#6`. The optional deterministic review method `page10Controller.previewTransition(ms, reverse)` previews the final 550 ms sequence. Edit sources and rebuild with `build.py`; preserve P8/P9 and shared navigation. Inspect every state and final-motion frames at 1600 × 900 and a smaller viewport, including reverse/direct links, restart, reduced motion, rapid input, cancellation and guide alignment after resize.
