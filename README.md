# Budget Protein Planner
Student meal-planning prototype for comparing nutrition and portion costs.

## Open the dashboard
Visit https://yma201004-gif.github.io/budget-protein-planner/ after GitHub Pages deployment.
Alternatively download the repository ZIP, extract it, and open index.html. Keep all JavaScript and CSS files together.

## Data and limitations
- 25 generic foods from FSANZ Australian Food Composition Database Release 3.
- Food Details and Nutrient Profiles joined by Public Food Key; nutrients are per 100 g.
- 19 selected WhichGrocer catalogue offers cover ten ingredients. Nine have both retailers; turkey breast has Woolworths only.
- Snapshot labelled 20 October 2026; provider timestamps retained in prices.js.
- Catalogue AUD prices are not particular store shelf prices. No automatic refresh.
- Generic nutrient proxies are not branded-product labels. Different brands and packs are not exact equivalents.
- Older prices remain in the underlying historical data for audit, but prices.js excludes them from the application.
- Other foods show unavailable prices, not zero.
- Both-retailer mode chooses the lower unit price among selected products, not the cheapest product across the whole market.
- Pack purchase totals use each retailer's actual pack weight and assume an empty pantry; this is not basket-cost optimization.
- Portions are entered in grams, including liquids. Do not substitute mL without a density conversion.
- Meal state is not saved after reload. Planning support, not medical advice.

## Files
index.html, style.css, app.js: interface.
data.js: AFCD nutrient records and historical source information.
prices.js: current selected-price overlay.
model.js: calculation functions.
test.cjs: regression tests (run node test.cjs).
whichgrocer-snapshot.json and whichgrocer-expansion.json: retained query responses.
data-audit.json: historical AFCD import audit, before the new price overlay.
WHICHGROCER-NOTES.md: snapshot mapping notes.

## Sources
Nutrition: https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/data-files
Product data by WhichGrocer: https://whichgrocer.com/
Individual product URLs and update timestamps appear in the dashboard's provenance section.
Third-party data remain subject to their source terms. No API keys or OAuth credentials are included.
