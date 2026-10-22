# WhichGrocer snapshot integration

## Current reviewed version
38 selected offers across all 24 food options in Both mode. Some retailer-specific offers remain unavailable. See reviewed-data.js, verified-products.json and staples-price-snapshot.json.
Water-packed tuna removed; the supplied Coles oil-blend tuna remains. Chickpeas, kidney beans and pink canned salmon replaced with SunRice dry long-grain rice (Coles 296960, 2 kg, $4.50), Coles frozen broccoli (5341010, 500 g, $4.00), and Helga's Traditional Wholemeal Bread (5969435, 750 g, $5.20). Each new item uses its exact Coles product nutrition page, linked in the dashboard; these are not AFCD records. All three price timestamps are 2026-10-20. Enter dry rice, pre-cooking frozen broccoli, and bread as-sold weights in grams. These replacements add meal variety, not equivalent protein substitutions.
Additional reviewed records: Coles 1909952 Devondale Light Milk 3 L, $6.40; Woolworths 6050189 Humpty Doo skin-off barramundi 300 g, $17. Both WhichGrocer timestamps are 2026-10-20. Milk uses the exact Coles 3 L product nutrition (188 kJ, 3.6 g protein, 1.3 g fat per 100 mL). Barramundi retains generic AFCD raw nutrition and explicitly assumes the whole pack is edible; bone removal is NOT verified. This is not an exact branded nutrition match.
Egg white removed. Whole eggs use a clearly labelled 50 g edible cooked-weight assumption per egg.
Coles tuna 8675339 is a separate branded item, priced per can; 95 g net weight is not treated as drained weight.
Regular cheddar, dry red lentils and raw peeled prawns replace incompatible nutrition states.
Skim milk uses AFCD per-100-mL data. Vitasoy Calci-Plus uses its manufacturer values at https://soy.com.au/product/soy-milk-calci-plus/ (3.2 g protein and 64 kcal per 100 mL).
Pork 2359370 uses $18.50/kg and an estimated 400 g pack; salmon 126497 uses $48/kg only, with pack price explicitly null.
Removed canned items remain only in historical import files. Milk and barramundi are now mapped as described above; barramundi edible yield remains an explicit assumption, not verified bone removal.
Tests: node review-test.cjs. No unattended refresh.

## Earlier snapshot history (superseded coverage counts)

Snapshot label: 20 October 2026. Provider timestamps are retained verbatim.
Source: authenticated WhichGrocer MCP search_basket responses, retained in whichgrocer-snapshot.json.
Three ingredients, six selected products. Searches consumed 6 credits; 193 remained.

prices.js overlays the AFCD data without modifying nutrition or historical source records.
Only mapped offers are enabled; all legacy prices are withheld from the displayed calculations.
Each retailer has its own pack weight, price, URL and provider update timestamp.
Generic AFCD nutrient proxies are not branded-label nutrition or an exact cross-retailer match.
Variable-weight chicken and medium-firm tofu were not selected. Selected products are not an exhaustive cheapest-product search.

No scheduled refresh, store-specific pricing or browser credential storage is implemented.
Full-pack totals use the products selected for lowest portion unit price, not basket-cost optimization.
Regression checks: node test.cjs

Expansion: 24 additional search credits; 169 credits remained. Nineteen offers across ten ingredients are now enabled. Variable-weight, per-kg/pack conflicts, cooked/drained yields and volume-to-mass conversions remain withheld. This is not a complete catalogue search. Product matching is generic, not an exact nutrient-label match.
