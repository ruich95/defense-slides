# Figure 5.8 provenance

User-supplied `C:/Users/rui chen/Downloads/thesis-print2.pdf`, PDF page 175 / printed p.151. Crop (167,433)–(315,599) PDF points, bottom-left origin, yields 148×166 pt. `pypdf` set the media/crop boxes; `pdftocairo -svg` retained vector paths and glyph outlines. The complete upper model/IR illustration, arrows, intrinsic labels, lower generation-cost ellipses and High–Low legend are preserved, with no recolouring or redraw. External caption, prose and table are excluded. The cropped render was compared against the full source page.

Cairo emits its font hash-table assertion on teardown after writing the complete SVG, as with Figure5.1. The resulting SVG parses and is rendered in Edge; all internal references resolve. `build.py` embeds it for offline use. The selected numeric table on the slide is separately editable HTML, copied from Table5.1 and identified as IR-generation seconds.

## Concrete eight-state example, 1 November2026

`build.py:product_elimination_art` extracts `g23` (original network) and `g22` (simplified network), including their actual native block geometry, ports, outlined labels and wires, from `figures/svg/prod-elim-draft.svg`. It positions these groups independently at5× and reuses the draft’s four blue/burgundy solid/dashed route-arrow styles with shortened paths. IDs are prefixed to avoid collisions. No approximation is redrawn and the user’s source SVG is unchanged. Slide code/headers remain editable28px HTML. The full Fig.5.8 asset and its crop are unchanged and appear at state7, remaining fixed for timing state8.

The corrected comparison aligns both native networks at y340 and column centres x350/x850, with common code-line ink and longer aligned vertical arrows. The complete figure is proportionally reduced to400×448.648649 atx1065/y235. At states7–8 it shares a fixed right-hand group with the32px method sentence and the page’s sole O2 tag; the timing heading has no tag. Coral unused-code emphasis starts at state5.
