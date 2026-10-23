# HTML defence presentation

Open **index.html** in Edge or Chrome to present the complete deck. It currently contains the cover and the animated Embedded System Design slide. The generated presentation is self-contained and works offline or on GitHub Pages.

## Structure

```text
defense-html/
  index.html             Generated complete presentation
  cover.html             Generated cover preview
  page2.html             Generated animated-slide preview
  slides.json            Slide order, titles, source paths and reveal counts
  slides/
    cover.html           Cover source fragment
    page2.html           Embedded System Design source fragment
    page2.js             FM animation and pyramid reveal controller
  shared/
    styles.css           Common layout, typography and slide styling
    navigation.js        Deck navigation, full screen and notes
    shell.html           Shared document and controls
  assets/
    cover.svg            Cover imported from PowerPoint as vector artwork
    kth-logo.svg         Original KTH logo from the slide master
    Figtree.ttf          Embedded font source
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

The cover has one state. Slide 2 has nine states and 0.25-second transitions. Full screen hides the bottom controls. Deck links use `#1` for the cover and `#2.7` for slide 2, reveal 7. The existing standalone `page2.html#7` links remain supported.

## Reference fidelity

The cover was exported directly from slide 1 of `../defense-draft.pptx`, through PowerPoint PDF export to SVG. Its original background, decoration, KTH logo, title, line wrapping, author information and date are preserved as scalable vector artwork. Its lettering is outlined in that asset to avoid browser font substitution. To revise its content, edit the PowerPoint cover and replace the exported `assets/cover.svg`.

Slide 2 retains the PowerPoint master's original logo position and size, Figtree Bold title at 28 PowerPoint points, #000061 title colour, and footer. Its 960 by 540 point slide is represented by a 1600 by 900 canvas. Main PLL and quadrature labels use 28 px on that canvas. The receiver remains centered between the definition and lower content edge, with the most recent smaller diagram size and fixed external ports.

The abstraction pyramid and trace come from `../figures/svg/abst-pyramid-trace.svg`. The rendered phase labels follow `../slides-detail/page2.md`: Specification, Modelling and Implementation. The FM animation is embedded from `../figures/radio-to-fm/radio-to-fm.svg`; rebuild that illustration first when its source artwork changes. External waveforms and arrows fade from the PLL frame onward. Only the feasible-implementations caption remains below the figures, with a leader pointing to its circle.

The speaker notes distinguish the illustrative multiplier constraint from a demonstrated FPGA implementation result. FIR scheduling and valid-sample timing remain implicit.
