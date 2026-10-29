# HTML defence presentation

Open **index.html** in Edge or Chrome for the current self-contained, offline 22-page deck. The cover counts as page 1. Canonical standalone previews are **page1.html through page22.html**, each using displayed page numbering; cover.html is an explicit cover alias. Historical page23–25 previews show retirement notices. Legacy source filenames and IDs are stable technical identifiers, not standalone aliases.

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
| 18 | page21 | 11 |
| 19 | page22 | 10 |
| 20 | page23 | 8 |
| 21 | page24 | 4 |
| 22 | page25 | 1 |

## Authoring and animation

Edit slides.json, source fragments/controllers in slides/, and shared styles/navigation. Rebuild only with `build.py`. merged12 wraps legacy source scenes page12+page13; merged13 wraps page14+page15+page16. Their controllers expose the existing object morph sampling engines as internal, reversible clicks. Canonical standalone output filenames use manifest displayNumber, independently of source IDs.

Page boundaries switch immediately except P5’s retained semantic pyramid-to-progress-bar entrance. Existing internal animations remain, including the P5/P8 object transitions and legacy page18–21 internal scene transforms. Direct hashes render settled states; reduced motion is immediate; cancellation prevents stale frames. Detailed active page contracts are in ../slides-detail/ and the complete previous designs are archived in ../slides-detail/archive-before-merge-2026-10-29/.
