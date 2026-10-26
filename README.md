# Budget Protein Planner
Student meal-planning prototype for comparing nutrition and portion costs.

## Open the dashboard
Visit https://yma201004-gif.github.io/budget-protein-planner/ after GitHub Pages deployment.
Alternatively download the repository ZIP, extract it, and open index.html. Keep all JavaScript and CSS files together.

For a reproducible local run with a standard Python/conda installation:

```text
python run.py
```

Then open `http://127.0.0.1:8000`. The dashboard uses only Python's standard library and browser-native HTML, CSS and JavaScript; no external packages or network requests are required at runtime. All runtime data is included in the submission.

## Data and limitations
- 24 food options. Barramundi and turkey breast were replaced by lean beef stir-fry strips and lamb leg steak because no stable paired own-brand products were available. Egg white and water-packed tuna remain excluded; rice, frozen broccoli and wholemeal bread provide additional meal variety.
- AFCD Food Details and Nutrient Profiles joined by Public Food Key. Milk uses per-100-mL data. Other generic nutrients use per-100-g data; eggs are scaled to an assumed 50 g cooked edible portion per egg.
- 48 selected WhichGrocer offers cover every food at both Coles and Woolworths. The main paired items use each retailer's own brand. Red lentils use the identical Katoomba 1 kg product because Woolworths and Coles do not both offer a suitable private-label equivalent.
- Rice, broccoli and bread use linked product nutrition. Lite milk, salmon and tuna use the selected retailer's product-label values. Rice is weighed dry; broccoli before cooking; bread in grams (label: 83 g for two slices). Rice fat is less than 1 g, not an exact zero.
- Catalogue rows are labelled 20 October 2026 and were audited on 21 October 2026; provider timestamps remain in the data.
- Catalogue AUD prices are not particular store shelf prices. No automatic refresh.
- Generic nutrient proxies are not branded-product labels. Vitasoy Calci-Plus uses manufacturer nutrition; Coles oil-blend tuna uses user-supplied packaging values per can's solid portion (15.7 g protein, 127 kcal). Photos themselves are not published.
- Older prices remain in the underlying historical data for audit, but prices.js excludes them from the application.
- Other foods show unavailable prices, not zero.
- Both-retailer mode chooses the lower unit price among selected products, not the cheapest product across the whole market.
- Pack totals assume an empty pantry. Pork is sold by variable weight, so its portion cost is available but its full-pack total is unavailable. Salmon is a paired 4-pack 460 g product, and lite milk is a paired 1 L bottle.
- Solids use grams, liquids mL, whole eggs egg count, branded tuna can count. Fractional cans/eggs are supported; purchases round up to whole packs.
- Lentils use dry red-lentil nutrition and dry weight before cooking. Prawns use raw flesh nutrition. Cheddar uses regular-fat nutrition. Beef stir-fry and lamb use AFCD lean-cut nutrition proxies. No guessed drained-weight conversions.
- Price chart compares AUD per 25 g protein so different input units are not mixed on one scale.
- Meal state is not saved after reload. Planning support, not medical advice.

## Interaction and visual hierarchy

- Search and category filters update the ingredient table, the visible insight summary, and the price chart together.
- The lower retailer price is emphasised in each row; ingredients already added to the meal receive a persistent `IN MEAL` marker and row highlight.
- The meal panel compares Woolworths-only, Coles-only and split-basket portion costs, then states whether the split-store saving justifies visiting both shops.
- The price chart opens with the 10 cheapest visible foods and can be switched to all visible foods, keeping the comparison readable without hiding the full data.
- Retailer colour is consistent across the legend, bars, price cues and active cost card; bar length encodes cost per 25 g protein rather than relying on colour alone.

## Accessibility

The local accessible version targets WCAG 2.2 AA. It includes a skip link,
visible form labels, table captions and scoped headers, keyboard-accessible data
tables, one debounced live status region, accessible chart summaries with
expandable data lists, explicit action labels, progress value text, focus
recovery after key actions, stronger text contrast and responsive reflow. At
mobile widths, ingredient rows become labelled cards; repeated source links are
kept in one provenance disclosure to reduce keyboard tab stops. Retailer bars
also use solid versus striped patterns so identity is not communicated by
colour alone.
See `ACCESSIBILITY.md` for the implemented checks and remaining manual tests.

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
