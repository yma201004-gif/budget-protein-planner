# Accessibility review

This Plotly Dash application targets WCAG 2.2 AA for a data-comparison
dashboard. It is self-contained and has no external font, icon or API
dependency at runtime.

## Implemented

- The first keyboard focus target is a skip link. It reveals itself on focus,
  moves focus to the main landmark and scrolls the main content into view.
- All buttons, native inputs, dropdowns and disclosures have visible focus
  treatment. Dropdowns receive explicit screen-reader names, including their
  selected values.
- The ingredient table has a caption, column headers, row headers and a
  focusable, labelled scroll region. At 650 CSS pixels and below, rows become
  labelled cards while preserving table semantics.
- One polite status region announces concise summaries after filtering,
  retailer changes, meal additions, serving edits, removals and target changes.
  Search is submitted with `debounce` rather than announced for every keystroke.
- Add and remove buttons include the food name in their accessible names.
  Focus returns to the add button after adding, to the serving field after
  changing a quantity, and to the meal heading after removal or clearing.
- Both charts have a dynamic accessible name, a visible explanation and a
  screen-reader-only data list. Retailer identity uses both colour and a striped
  pattern, so colour is not the only cue.
- Protein and budget progress bars expose their current values as text in
  addition to numeric progress.
- The layout supports reduced-motion preferences and reflows at a 320 CSS-pixel
  viewport without page-level horizontal scrolling.
- An on-page disclosure explains the available accessibility features.

## Verification completed

- Python syntax validation passed with Dash 3.4.0 and Plotly 6.9.0.
- Browser tests passed for the skip link, add, serving edit, remove, clear,
  search filtering, live announcements and chart label updates.
- Keyboard focus was verified after each meal action. No browser console errors
  or warnings occurred during the final interaction pass.
- At 320 CSS pixels, the document width matched the viewport and ingredient
  rows rendered as cards.
- Lighthouse 12.8.2 scored the final local build 100/100 for accessibility with
  zero failed accessibility audits on 27 October 2026.

## Remaining manual check

Automated tests cannot replace a human screen-reader review. A manual pass with
NVDA or Windows Narrator is still recommended before submission; this version
should not be described as formally certified.
