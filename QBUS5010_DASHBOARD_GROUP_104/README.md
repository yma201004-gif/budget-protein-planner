# Budget Protein Planner Dashboard

This Plotly Dash application supports meal planning from everyday foods. It
compares reviewed Woolworths and Coles catalogue prices, calculates protein and
portion cost for an adjustable meal, and visualises protein contribution and
cost per 25 g of protein.

## Run

From this folder:

```text
python -m pip install -r requirements.txt
python app.py
```

Open `http://127.0.0.1:8050`.

The application is self-contained. `data/foods.json` contains the required
nutrition and retailer-product records; no network connection or API key is
needed at runtime.

## Files

- `app.py`: layout, callbacks and calculation helpers
- `data/foods.json`: 24 foods and paired retailer offers
- `requirements.txt`: Dash and Plotly dependencies
- `ACCESSIBILITY.md`: accessibility implementation and verification record

## Accessibility

The dashboard includes a keyboard skip link, visible focus treatment,
programmatic labels, a single polite status region, focus restoration after
meal actions, text alternatives for charts, accessible progress values, a
labelled table region and a responsive card layout. It targets WCAG 2.2 AA;
automated Lighthouse testing scored 100/100 for accessibility on 27 October
2026. This is not a claim of formal certification.

## Notes

Catalogue prices are a reviewed snapshot dated 20 October 2026. They are not
live shelf prices. The dashboard chooses the lower portion price per item when
“Both” is selected; it does not guarantee the cheapest complete shopping
basket.
