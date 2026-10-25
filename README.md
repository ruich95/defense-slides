# HTML defence presentation

Open **index.html** in Edge or Chrome to present the complete deck. It currently contains the cover, the Embedded Systems introduction, the animated Embedded System Design slide, and Requirements for a Design Framework. The generated presentation is self-contained and works offline or on GitHub Pages.

## Structure

```text
defense-html/
  index.html             Generated complete presentation
  cover.html             Generated cover preview
  page1.html             Generated Embedded Systems preview
  page2.html             Generated animated-slide preview
  page4.html             Generated Requirements for a Design Framework preview
  slides.json            Slide order, titles, source paths and reveal counts
  slides/
    cover.html           Cover source fragment
    page1.html           Embedded Systems source fragment
    page1.js             Example and characteristic reveals with speaker notes
    page2.html           Embedded System Design source fragment
    page2.js             FM animation and pyramid reveal controller
    page4.html           Requirements for a Design Framework source fragment
    page4.js             Five cumulative states with speaker notes
  shared/
    styles.css           Common layout, typography and slide styling
    navigation.js        Deck navigation, full screen and notes
    shell.html           Shared document and controls
  assets/
    cover.svg            Cover imported from PowerPoint as vector artwork
    kth-logo.svg         Original KTH logo from the slide master
    Figtree.ttf          Embedded font source
    embedded-systems/    Sourced SVG example icons and their licence
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

The cover has one state. Slide 2 (Embedded Systems) has nine states: its opening statement, three example reveals, the question, and four characteristic reveals. Its transitions take 0.2 seconds and respect reduced-motion preferences. Slide 3 (Embedded System Design) has nine states and 0.25-second transitions. Full screen hides the bottom controls. Deck links use `#1` for the cover, `#2.9` for the completed Embedded Systems slide, and `#3.7` for slide 3, reveal 7. Standalone links such as `page1.html#9` and the existing `page2.html#7` remain supported. Source names follow `slides-detail/page1.md` and `page2.md`; generated page numbers follow their position in the complete deck.

## Reference fidelity

The cover was exported directly from slide 1 of `../defense-draft.pptx`, through PowerPoint PDF export to SVG. Its original background, decoration, KTH logo, title, line wrapping, author information and date are preserved as scalable vector artwork. Its lettering is outlined in that asset to avoid browser font substitution. To revise its content, edit the PowerPoint cover and replace the exported `assets/cover.svg`.

The introduction slides retain the PowerPoint master's original logo position and size, Figtree Bold title at 28 PowerPoint points, #000061 title colour, and footer. Its 960 by 540 point slide is represented by a 1600 by 900 canvas. Embedded Systems follows page 5 of the current `defense-draft.pptx`: a full-width upper text region, a middle image region containing the three icons in a row, and a full-width lower text region containing the question and four bullets. The template's blue region outlines are layout guides, not part of the finished content. The approved braking, robot-controller and aircraft-attitude-control illustrations come from `../figures/embedded-systems-drafts/v6/`. Their transparent PNGs are embedded for offline use and displayed at matching visible heights. Speaker notes record their generation provenance and the Sander sources.

On Embedded System Design, main PLL and quadrature labels use 28 px on the canvas. The receiver remains centered between the definition and lower content edge, with the most recent smaller diagram size and fixed external ports.

The abstraction pyramid and trace come from `../figures/svg/abst-pyramid-w-trace.svg` when present, otherwise from the current `../figures/svg/abst-pyramid-trace.svg`. The inner cone is omitted from the slide; the PLL branch follows its updated source position. The rendered phase labels follow `../slides-detail/page2.md`: Specification, Modelling and Implementation. The FM animation is embedded from `../figures/radio-to-fm/radio-to-fm.svg`; rebuild that illustration first when its source artwork changes. External waveforms and arrows fade from the PLL frame onward. Only the feasible-implementations caption remains below the figures, with a leader pointing to its circle.

The speaker notes distinguish the illustrative multiplier constraint from a demonstrated FPGA implementation result. FIR scheduling and valid-sample timing remain implicit.

Displayed page 4 follows `../slides-detail/page4.md` and uses `slides/page4.html` and `slides/page4.js`. Its five cumulative states reveal Automation, Correctness with the specification cone, Practical support, then Formal support. The opening and completed trace remain visible. The completed left text block is vertically centred on the page. That final composition determines its fixed top position for every state, keeping the opening sentence and Automation stationary. Correctness appears with normal bullet spacing in state 3. In state 4, the space beneath Automation expands over 0.25 seconds, moving Correctness down as Practical support fades in. Reverse navigation collapses that space again. The pyramid reuses page 3's geometry at the same position and scale, with separately namespaced artwork IDs. The inner cone preserves the geometry, transforms, unfilled black outline and dashed rear rim from `../figures/svg/abst-pyramid-w-range.svg`. Its rim and sides retain their separate positions in the reference SVG’s paint order, so the lower rim paints in front of the modelling floor. The caption leader begins 8 canvas pixels below the caption’s bottom centre and points to the left end of the inner cone’s lower rim, stopping 6 canvas pixels outside the outline to avoid overlap. It uses page 3’s open arrowhead style and tracks the slide scale. Following the explicit layout instruction, page 4 omits the multiplier-budget ellipse, caption and leader; the Step 3 presenter guidance refers back to the preceding page's example. The cone denotes specification satisfaction schematically, not a proof or a quantitative region. Oral passages, presenter guidance and attribution appear in the speaker notes. Use `index.html#4.1` through `#4.5`, or `page4.html#1` through `#5`. Reveals fade over 0.25 seconds and respect reduced-motion preferences. Adding a later slide to `slides.json` automatically enables advancing to it after page 4's final state.
