# WhichGrocer snapshot integration

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
