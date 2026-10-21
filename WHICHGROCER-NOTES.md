# WhichGrocer snapshot integration

## Current reviewed version
33 selected offers across 19 of 25 food options. See reviewed-data.js and verified-products.json.
Egg white removed. Whole eggs use a clearly labelled 50 g edible cooked-weight assumption per egg.
Coles tuna 8675339 is a separate branded item, priced per can; 95 g net weight is not treated as drained weight.
Regular cheddar, dry red lentils and raw peeled prawns replace incompatible nutrition states.
Skim milk uses AFCD per-100-mL data. Vitasoy Calci-Plus uses its manufacturer values at https://soy.com.au/product/soy-milk-calci-plus/ (3.2 g protein and 64 kcal per 100 mL).
Pork 2359370 uses $18.50/kg and an estimated 400 g pack; salmon 126497 uses $48/kg only, with pack price explicitly null.
Chickpeas, kidney beans, pink canned salmon and water-packed tuna await drained weights. Barramundi awaits a suitable unseasoned fillet; approximately 1%-fat milk awaits a matching product. No fabricated prices or yields.
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
