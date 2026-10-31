# Figure 5.8 provenance

User-supplied `C:/Users/rui chen/Downloads/thesis-print2.pdf`, PDF page 175 / printed p.151. Crop (167,433)–(315,599) PDF points, bottom-left origin, yields 148×166 pt. `pypdf` set the media/crop boxes; `pdftocairo -svg` retained vector paths and glyph outlines. The complete upper model/IR illustration, arrows, intrinsic labels, lower generation-cost ellipses and High–Low legend are preserved, with no recolouring or redraw. External caption, prose and table are excluded. The cropped render was compared against the full source page.

Cairo emits its font hash-table assertion on teardown after writing the complete SVG, as with Figure5.1. The resulting SVG parses and is rendered in Edge; all internal references resolve. `build.py` embeds it for offline use. The selected numeric table on the slide is separately editable HTML, copied from Table5.1 and identified as IR-generation seconds.
