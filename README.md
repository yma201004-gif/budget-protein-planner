# Budget Protein Planner
Student meal-planning prototype for comparing nutrition and portion costs.

## Open the dashboard
Visit https://yma201004-gif.github.io/budget-protein-planner/ after GitHub Pages deployment.
Alternatively download the repository ZIP, extract it, and open index.html. Keep all JavaScript and CSS files together.

## Data and limitations
- 24 food options. Egg white and water-packed tuna removed; canned chickpeas, kidney beans and pink salmon replaced with dry rice, frozen broccoli and wholemeal bread.
- AFCD Food Details and Nutrient Profiles joined by Public Food Key. Milk uses per-100-mL data. Other generic nutrients use per-100-g data; eggs are scaled to an assumed 50 g cooked edible portion per egg.
- 38 selected WhichGrocer offers cover all 24 food options in Both mode. Not every food has an offer at both retailers. Barramundi pricing assumes the entire pack is edible; bone removal is NOT verified.
- Rice, broccoli, bread and Devondale light milk use their specific Coles product nutrition. Rice is weighed dry; broccoli before cooking; bread in grams (label: 83 g for two slices). Rice fat is less than 1 g, not an exact zero.
- Snapshot labelled 20 October 2026; provider timestamps retained in prices.js.
- Catalogue AUD prices are not particular store shelf prices. No automatic refresh.
- Generic nutrient proxies are not branded-product labels. Vitasoy Calci-Plus uses manufacturer nutrition; Coles oil-blend tuna uses user-supplied packaging values per can's solid portion (15.7 g protein, 127 kcal). Photos themselves are not published.
- Older prices remain in the underlying historical data for audit, but prices.js excludes them from the application.
- Other foods show unavailable prices, not zero.
- Both-retailer mode chooses the lower unit price among selected products, not the cheapest product across the whole market.
- Pack totals assume an empty pantry. Pork uses an estimated 400 g pack and is labelled estimated. Salmon uses $4.80/100 g but has no verified pack total; including it makes the purchase total unavailable, not the portion cost.
- Solids use grams, liquids mL, whole eggs egg count, branded tuna can count. Fractional cans/eggs are supported; purchases round up to whole packs.
- Lentils use dry red lentil nutrition and dry weight before cooking. Prawns use raw flesh nutrition. Cheddar uses regular-fat nutrition. No guessed drained-weight conversions.
- Price chart compares AUD per 25 g protein so different input units are not mixed on one scale.
- Meal state is not saved after reload. Planning support, not medical advice.

## Files
index.html, style.css, app.js: interface.
data.js: AFCD nutrient records and historical source information.
prices.js: current selected-price overlay.
reviewed-data.js: approved food-state changes, units, labelled estimates and additional price records; loaded after prices.js.
model.js: calculation functions.
test.cjs: regression tests (run node test.cjs).
review-test.cjs: reviewed-data and multi-unit regression tests (run node review-test.cjs).
verified-products.json: additional queried product records and AFCD extraction evidence.
whichgrocer-snapshot.json and whichgrocer-expansion.json: retained query responses.
data-audit.json: historical AFCD import audit, before the new price overlay.
WHICHGROCER-NOTES.md: snapshot mapping notes.

## Sources
Nutrition: https://www.foodstandards.gov.au/science-data/food-nutrient-databases/afcd/data-files
Product data by WhichGrocer: https://whichgrocer.com/
Individual product URLs and update timestamps appear in the dashboard's provenance section.
Third-party data remain subject to their source terms. No API keys or OAuth credentials are included.
