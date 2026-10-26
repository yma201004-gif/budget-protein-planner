# Accessibility review

This local version targets WCAG 2.2 AA for a data-comparison dashboard. It
preserves the submitted calculations and does not add runtime dependencies.

## Implemented

- A keyboard-accessible skip link moves focus directly to the main dashboard.
- All form controls have programmatic and visible labels.
- The ingredient table has a caption, column headers, row headers and a
  focusable, labelled scroll region.
- The table itself exposes 24 add-to-meal buttons but no repeated source links.
  Full source links are available in the separate provenance disclosure,
  reducing keyboard tab stops.
- The meal and chart regions have headings and accessible names.
- A single polite status region announces concise summaries after filtering,
  retailer changes, meal additions, serving edits and removals. Search
  announcements are debounced to avoid reading every keystroke.
- Add and remove buttons have explicit action-and-food names.
- Focus returns to the add button after adding a food and to the meal heading
  after removing one.
- Progress bars have accessible names, descriptions and value text.
- Both charts expose a summary through `role="img"` and provide expandable,
  screen-reader-accessible data lists.
- Colour is not the only cue: the interface also uses the text `lower`,
  `IN MEAL`, `same price`, retailer names and striped Coles bars.
- Secondary text uses a darker grey with at least 4.5:1 contrast on the page
  background.
- Interactive controls have visible focus treatment; disclosure summaries and
  icon buttons have at least a 24 px target height.
- The page supports reduced-motion preferences and reflows at a 320 CSS-pixel
  viewport without page-level horizontal scrolling. Wide tables scroll only
  inside their labelled region.
- At widths of 650 px and below, each ingredient row becomes a labelled card
  while retaining explicit table, row and cell roles for assistive technology.
- An on-page accessibility disclosure explains keyboard operation, status
  announcements, chart alternatives, non-colour cues and responsive behaviour.

## Checks completed

- Dashboard data and calculation regression tests pass.
- No JavaScript console errors occurred during the local browser test.
- On 26 October 2026, Lighthouse 12.8.2 scored the local build 100/100 for
  accessibility with zero failed accessibility audits.
- Keyboard focus order starts with `Skip to dashboard`, then follows the visible
  control order.
- The skip link moves focus to the main content.
- A food can be added, its serving changed, and the food removed without a
  JavaScript error; focus returns to a meaningful control after add and remove.
- Browser accessibility roles were found for the search field, filters, table
  region, both charts, both progress bars and the live status message.
- At 320 CSS pixels wide, the page's horizontal scroll position remains zero;
  the mobile table rows render as cards with no internal horizontal overflow.
- Status messages are limited to one or two short sentences: a filter update
  reports the visible-food count and cheapest option; a meal change reports
  only the updated meal totals.

## Before final submission

- Complete a manual pass with NVDA or Windows Narrator and Chrome.
- Check the final PDF for readable screenshots and logical reading order.

Automated checks cannot replace a human screen-reader review, so this version
should not yet be described as formally certified.
