# Figure 5.1 provenance

Source: user-supplied `C:/Users/rui chen/Downloads/thesis-print2.pdf`, PDF page 159 / printed p. 135. Crop rectangle in PDF points: x168–313, y203–354, bottom-left origin. Source page size 479.06×677.48 pt. `figure5-1-crop.pdf` contains that crop. `figure5-1.svg` is its vector Cairo conversion, retaining original paths, colours, glyph outlines, intrinsic labels and original spelling. No redrawing, simplification or caption. The complete crop was compared visually with the full thesis page.

Extraction used runtime Python `pypdf` and `pdftocairo -svg`. Cairo wrote a valid complete SVG but emitted a font hash-table assertion on process teardown. The SVG parses, all glyph definitions resolve, and Edge renders it as the complete figure. Asset is embedded by canonical `build.py` for offline use.
