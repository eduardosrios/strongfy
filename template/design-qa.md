# Strongfy Design QA — Reference-Locked Sections 38–87

## Scope

- Improved sections: 38, 42, 43, 44, 47, 48, 62, 72, 85, and 87.
- Deleted sections: 70, 79, and 96.
- Preserved review controls: `C`, `O`, section number, and `C+` on every retained target section.
- Local implementation: `http://localhost/templates/Gym/template/?audit=final-reference`.

## Source and Final Evidence

| Section | Reference | Final implementation | Reference canvas |
|---|---|---|---|
| 38 | `referencias/references-used/body-content/0 New Sections/section 38/cutted-section/section-02-cropped.webp` | `tmp/qa-sections-38-87/section-38-final.png` | 1440 × 638 |
| 42 | `referencias/references-used/body-content/0 New Sections/section 42/cutted-section/section-06-cropped.webp` | `tmp/qa-sections-38-87/section-42-final.png` | 1440 × 533 |
| 43 | `referencias/references-used/body-content/0 New Sections/section 43/cutted-section/section-07-cropped.webp` | `tmp/qa-sections-38-87/section-43-final.png` | 1440 × 853 |
| 44 | `referencias/references-used/body-content/0 New Sections/section 44/cutted-section/section-08-cropped.webp` | `tmp/qa-sections-38-87/section-44-final.png` | 1440 × 1067 |
| 47 | `referencias/references-used/body-content/0 New Sections/section 47/cutted-section/section-11-cropped.webp` | `tmp/qa-sections-38-87/section-47-final.png` | 1440 × 683 |
| 48 | `referencias/references-used/body-content/0 New Sections/section 48/cutted-section/section-12-cropped.webp` | `tmp/qa-sections-38-87/section-48-final.png` | 1440 × 617 |
| 62 | `referencias/references-used/body-content/0 New Sections/section 62/cutted-section/section-26-cropped.webp` | `tmp/qa-sections-38-87/section-62-final.png` | 1024 × 600 |
| 72 | `referencias/references-used/body-content/0 New Sections/section 72/cutted-section/fYp7zuaT7PTQ.jpg` | `tmp/qa-sections-38-87/section-72-final.png` | 1400 × 1959 |
| 85 | `referencias/references-used/body-content/0 New Sections/section 85/cutted-section/section-85-reference.jpg` | `tmp/qa-sections-38-87/section-85-final.png` | 1442 × 536 |
| 87 | `referencias/references-used/body-content/0 New Sections/section 87/cutted-section/section-87-reference.jpg` | `tmp/qa-sections-38-87/section-87-final.png` | 1012 × 650 |

Each source and implementation image was rendered together in the same browser comparison input at equal panel width. The implementation captures used the exact source content width: 1440, 1024, 1400, 1442, or 1012 CSS pixels as applicable.

## Fidelity Surfaces

- Typography: heading sizes, line breaks, title widths, labels, pricing hierarchy, metadata, and coach row type were recalibrated against the references.
- Spacing and layout: all ten sections now reproduce their reference canvas heights exactly. Card columns, stage widths, rail offsets, padding, image proportions, and vertical rhythm were rebuilt from the supplied crops.
- Color and tokens: Strongfy black, neutral paper, white, and lime remain the only primary visual system. Filters and overlays were adjusted to match the references’ contrast and editorial tone.
- Images: only real local Strongfy assets are used. No screenshots, placeholders, emoji, CSS drawings, or synthetic stand-ins were embedded as page content.
- Content: visible copy remains English and purpose-specific. Section 48 uses deliberate line breaks matching the supplied title rhythm; section 87 uses the reference-aligned coach directory state.
- Icons: existing Font Awesome and project assets remain in use; no handcrafted SVGs were added.
- Responsive behavior: page-level horizontal overflow is 0 px at 1455, 1024, and 390 browser widths. The final tablet correction removes the remaining internal 15 px crop in section 62 and 3 px crop in section 87.
- States and accessibility: section 47 carousel movement, section 87 tab selection, `aria-selected`, live image/title/specialty updates, keyboard-focusable cards, visible review controls, and reduced-motion behavior were preserved.

## Comparison History

### Pass 0 — baseline

- [P1] Sections 62 and 87 collapsed into 1440 px and 967 px stacks at their 1024/1012 reference widths.
- [P1] Section 72 used a hard split panel instead of the reference’s full-image overlay composition.
- [P1] Section 85 exposed an undersized header and four narrow cards instead of the reference’s 42.5% editorial header plus wide horizontal cards.
- [P1] Section 87 used an oversized title and permanent right-side portrait rather than the reference’s compact row-overlay portrait.
- [P2] Sections 38, 42, 43, 44, 47, and 48 had incorrect proportions, typography, radii, image treatment, or card distribution.

### Pass 1 — structural rebuild

- Rebuilt all ten reference canvases and matched their exact heights.
- Corrected section 42 column proportions, section 44 score/hero/detail widths, section 47 card dimensions, section 48 image rail, section 62 absolute testimonial composition, section 72 full-image overlays, section 85 card rail, and section 87 row-overlay profile.
- Deleted sections 70, 79, and 96 plus their obsolete JavaScript handlers.

### Pass 2 — precision correction

- [P2] Section 43 cards were still too short; increased them to the reference height and restored rounded pricing controls.
- [P2] Section 44 heading wrapped one line too early; widened the heading to the measured reference width.
- [P2] Section 48 needed the reference’s exact three-line title rhythm; added deliberate semantic line breaks.
- [P2] Section 87 role labels collided with the active portrait; constrained the role column and locked high-specificity typography.
- [P2] Section 47’s carousel custom offset was being masked by the legacy cascade; added a final transform lock and verified a 455 px completed movement.
- [P2] Sections 62 and 87 had small internal tablet crops; normalized their shells to `width: 100%` with source-sized maximums.

## Final Runtime Verification

- Exact final section heights: 38 = 638; 42 = 533; 43 = 853; 44 = 1067; 47 = 683; 48 = 617; 62 = 600; 72 = 1959; 85 = 536; 87 = 650 CSS px.
- Deleted section counts: 70 = 0; 79 = 0; 96 = 0.
- Review controls on every target: `C`, `O`, section number, and `C+`.
- Desktop, tablet, and mobile: 0 page-level horizontal overflow.
- Tablet/mobile internal overflow for sections 62 and 87: 0 px.
- Broken images: 0.
- Browser console errors: 0.
- Section 47 carousel: verified final transform `matrix(1, 0, 0, 1, -455, 0)` after Next.
- Section 87 directory: verified active tab, `aria-selected`, image, alt text, coach title, and specialty update together.

## Findings

- No actionable P0, P1, or P2 findings remain.
- P3 accepted difference: local Strongfy athlete photography replaces the exact people shown in the inspiration crops while preserving subject placement, crop, contrast, and composition.
- P3 accepted difference: the required `C`, `O`, section-number, and `C+` development review controls remain visible above the reference-aligned UI.

final result: passed