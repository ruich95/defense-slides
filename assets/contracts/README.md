# Page16A: complete original SVG groups

Displayed P17, `contracts`, eight states/30 pages. The user's revised direction is
the original three rows, progressively revealed with earlier rows retained. One
middle-row construction moves through four native keyframes. Visual authority:
`figures/svg/draft-p16a.svg`.

`artwork.svg` contains complete original groups, also inlined in the slide source.
IDs/references and wrapper transforms change. The authorised marker correction
below is the sole native style exception. The `native-*.svg` files export
each full figure. Native geometry/paint order/ports/arrows/questions/colours/opacity
remain intact. Compare on white: the reference PNG includes transparency.

The two short middle coral links (grouped and final law) originally used a
5-unit Triangle marker. Their exported/inline references now use the original
1.5-unit Triangle-1 peer marker. Only those refs change; original paths, all other
arrows/marker definitions and `figures/svg/draft-p16a.svg` remain unchanged. The
motion layer reads the corrected references and interpolates physical marker
dimensions consistently. These exceptions are recorded in `native-source-map.json`.

Introductions use the surrounding deck's 32 px normal Figtree on an exact 205 px
grid: y175/380/585. The native setter pair uses scale 0.95 and centre (800,290);
middle keyframes/reference use scale 0.90, data baseline 490, left x95/reference
x865. Final native law uses scale 0.95 and centre (400,700). Contract x865/y639,
28 px with 1.45 line height, shares the last figure's vertical centre near 700.
Added below-diagram captions/temporal labels stay removed; notes explain temporal
ordering orally. The author helper
`tmp/defense/p16a-visual-redesign/author-native-rows.py` regenerates this layout
and the two local marker-reference fixes.

`native-source-map.json` records all IDs/bounds/transforms:

- Row 1: full `g7` and `g41-2-2-4-9`.
- Loop: full `g8` plus its two original external question texts.
- Unfold: full `g10` plus its two original external question texts.
- Group/wire: full `g16`/`g19` with their original neighbouring paths/clouds.
- Reference: full `g18`, including faded endpoint groups.
- Law: full `g16-9`, `path19`, `g19-9`.

The opening initially hides only three original row1 children. State 2 reveals
`text81-7-7-7-7` (set label) and `path28-2-4-3` (good inner arrow); state 3 reveals
`path28-2-4-3-5` (bad inner arrow). Box bodies/ports stay visible. No badSet label
or new opening animation is added. The completed original comparison stays from
state 3 onward. Metadata records these targets in `native-source-map.json`.
Former states 2–6 now occur as states 4–8. Structural 600 ms Morphs are 4→5/5→6/6→7;
all layout, scales and native marker corrections remain unchanged.

The controller reads native primitives from complete groups, interpolates matched
objects/paths for 600 ms in a temporary SVG layer, then restores exact native
endpoints. No component symbols are reassembled. Reference/earlier rows stay fixed.
The source-derived wire and exact Reg contract retain the user's semantics.

Rejected replacement-scene work is archived in
`tmp/defense/p16a-visual-redesign/before-three-row-rebuild`.
Authority/review: `slides-detail/page16a.md` and companion prompt.
