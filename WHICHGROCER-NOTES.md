# WhichGrocer snapshot integration

## Current reviewed version
48 selected offers across all 24 food options, with an available in-stock offer at both Coles and Woolworths for every food. See reviewed-data.js, verified-products.json and staples-price-snapshot.json.
Price completion: red lentils use the identical Katoomba 1 kg product at both stores; lite milk uses paired 1 L own-brand bottles; pork uses paired own-brand fillet at $18.50/kg and variable weight; salmon uses paired 4-pack 460 g skin-off portions; tuna uses paired 95 g own-brand cans. Each retailer-specific milk, salmon and tuna offer carries its own product-label nutrition. Barramundi and turkey breast were replaced by paired raw 500 g own-brand beef stir-fry strips and paired raw 270 g own-brand lamb leg steaks, respectively, after no stable same-format own-brand pairs were found. Replacement rows use AFCD F000931 and F005013 rather than retaining the old food descriptions.
Water-packed tuna remains removed. Chickpeas, kidney beans and pink canned salmon remain replaced by SunRice dry long-grain rice, frozen broccoli and Helga's wholemeal bread. Enter dry rice, pre-cooking frozen broccoli, and bread as-sold weights in grams. These additions provide meal variety rather than equivalent protein substitutions.
Egg white removed. Whole eggs use a clearly labelled 50 g edible cooked-weight assumption per egg.
Oil-blend tuna is priced per 95 g can; the package's net contents are not treated as drained weight.
Regular cheddar, dry red lentils and raw peeled prawns replace incompatible nutrition states.
Skim milk uses AFCD per-100-mL data. Vitasoy Calci-Plus uses its manufacturer values at https://soy.com.au/product/soy-milk-calci-plus/ (3.2 g protein and 64 kcal per 100 mL).
Pork is sold by variable weight and therefore has a portion unit price but no final pack total.
Removed canned items remain only in historical import files.
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
