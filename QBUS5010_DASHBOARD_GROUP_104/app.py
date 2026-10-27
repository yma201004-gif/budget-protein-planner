from __future__ import annotations

import json
import math
from pathlib import Path

import plotly.graph_objects as go
from dash import Dash, Input, Output, State, dcc, html, no_update


APP_DIR = Path(__file__).resolve().parent
DATA_PATH = APP_DIR / "data" / "foods.json"

with DATA_PATH.open(encoding="utf-8") as source:
    FOODS = json.load(source)

FOOD_BY_ID = {food["id"]: food for food in FOODS}
CATEGORIES = sorted({food["category"] for food in FOODS})
RETAILERS = ("Woolworths", "Coles")
DEFAULT_MEAL = {
    food["id"]: 200 if food["category"] == "Poultry" else 80
    for food in FOODS
    if food["id"] in {"F002594", "F006143"}
}


def offer(food, retailer):
    choices = RETAILERS if retailer == "Both" else (retailer,)
    selected = [food["offers"][name] for name in choices if food["offers"].get(name)]
    selected.sort(key=lambda item: item["unitPrice"])
    return selected[0] if selected else None


def nutrition(food, selected=None):
    return (selected or {}).get("nutrition") or food


def cost_25(food, retailer):
    selected = offer(food, retailer)
    if not selected:
        return None
    value = nutrition(food, selected)["protein"]
    return 25 * selected["unitPrice"] / value if value > 0 else None


def money(value):
    return "Unavailable" if value is None else f"${value:.2f}"


def filter_foods(search, category, retailer, sort_order):
    needle = (search or "").strip().lower()
    rows = [
        food
        for food in FOODS
        if needle in food["name"].lower()
        and (not category or category == "All categories" or food["category"] == category)
    ]
    if sort_order == "value":
        rows.sort(
            key=lambda food: (
                -(nutrition(food, offer(food, retailer))["protein"]
                  / offer(food, retailer)["unitPrice"])
                if offer(food, retailer)
                else 1,
                food["name"],
            )
        )
    else:
        rows.sort(key=lambda food: food["name"])
    return rows


def calculate(meal, retailer):
    lines = []
    total_protein = total_kcal = total_cost = total_purchase = 0.0
    purchase_missing = False

    for food_id, amount in (meal or {}).items():
        food = FOOD_BY_ID.get(food_id)
        selected = offer(food, retailer) if food else None
        if not food or not selected or not isinstance(amount, (int, float)) or amount <= 0:
            continue
        facts = nutrition(food, selected)
        basis = food.get("basis", 100)
        protein = facts["protein"] * amount / basis
        kcal = facts["kcal"] * amount / basis
        cost = selected["unitPrice"] * amount / basis
        pack = selected.get("pack")
        price = selected.get("price")
        packs = (
            math.ceil(amount / pack)
            if pack and isinstance(price, (int, float)) and price > 0
            else None
        )
        if packs is None:
            purchase_missing = True
        else:
            total_purchase += packs * price
        total_protein += protein
        total_kcal += kcal
        total_cost += cost
        lines.append(
            {
                "food": food,
                "amount": amount,
                "selected": selected,
                "protein": protein,
                "kcal": kcal,
                "cost": cost,
                "packs": packs,
            }
        )

    return {
        "lines": lines,
        "protein": total_protein,
        "kcal": total_kcal,
        "cost": total_cost,
        "purchase": None if purchase_missing else total_purchase,
    }


def price_cell(food, retailer):
    selected = offer(food, retailer)
    other = offer(food, "Coles" if retailer == "Woolworths" else "Woolworths")
    lower = (
        selected
        and other
        and selected["unitPrice"] < other["unitPrice"] - 1e-9
    )
    return html.Td(
        [
            html.Span(money(selected["unitPrice"] if selected else None)),
            html.Small(
                f"/{food.get('basis', 100)} {food['unit']}"
                + (" · lower" if lower else "")
            ),
        ],
        className="price-cell lower-price" if lower else "price-cell",
        **{"data-label": f"{retailer} price"},
    )


def insight_for(rows, retailer):
    priced = [(food, cost_25(food, retailer)) for food in rows if cost_25(food, retailer)]
    if not priced:
        return html.Div(
            [
                html.Div("CURRENT VIEW", className="eyebrow"),
                html.H3("No priced food matches this view."),
                html.P("Clear the search or choose another category."),
            ]
        )
    cheapest, lowest = min(priced, key=lambda item: item[1])
    gaps = []
    for food in rows:
        woolworths = cost_25(food, "Woolworths")
        coles = cost_25(food, "Coles")
        if woolworths and coles:
            gaps.append(
                (
                    abs(woolworths - coles) / max(woolworths, coles),
                    food,
                    "Woolworths" if woolworths < coles else "Coles",
                )
            )
    detail = ""
    if gaps:
        gap, food, cheaper = max(gaps, key=lambda item: item[0])
        detail = (
            f"The largest retailer gap is {food['name'].split(',')[0]}: "
            f"{cheaper} is {gap * 100:.0f}% lower."
        )
    return html.Div(
        [
            html.Div("CURRENT VIEW", className="eyebrow"),
            html.H3(
                f"{cheapest['name'].split(',')[0]} gives the cheapest visible "
                f"protein at {money(lowest)} per 25 g."
            ),
            html.P(detail or "Retailer-gap comparison needs prices from both stores."),
        ]
    )


def make_price_figure(rows, retailer, limit):
    ranked = sorted(
        (food for food in rows if cost_25(food, retailer)),
        key=lambda food: cost_25(food, retailer),
    )[:limit]
    figure = go.Figure()
    retailers = RETAILERS if retailer == "Both" else (retailer,)
    for name in retailers:
        values = [cost_25(food, name) for food in ranked]
        figure.add_trace(
            go.Bar(
                x=values,
                y=[food["name"] for food in ranked],
                name=name,
                orientation="h",
                marker={
                    "color": "#216854" if name == "Woolworths" else "#aa6453",
                    "pattern": {
                        "shape": "/" if name == "Coles" else "",
                        "fgcolor": "#ffffff",
                        "fillmode": "overlay",
                        "solidity": 0.32,
                    },
                },
                text=[money(value) for value in values],
                textposition="outside",
                cliponaxis=False,
                hovertemplate=(
                    f"<b>%{{y}}</b><br>{name}: $%{{x:.2f}} per 25 g"
                    "<extra></extra>"
                ),
            )
        )
    max_value = max(
        [value for food in ranked for value in
         [cost_25(food, name) for name in retailers] if value] or [1]
    )
    figure.update_layout(
        barmode="group",
        height=max(430, 75 + len(ranked) * 52),
        margin={"l": 8, "r": 72, "t": 8, "b": 48},
        paper_bgcolor="white",
        plot_bgcolor="white",
        font={"family": "Segoe UI, Arial, sans-serif", "color": "#183c39"},
        legend={"orientation": "h", "x": 0, "y": 1.04},
        xaxis={
            "range": [0, max_value * 1.18],
            "title": "AUD per 25 g protein",
            "gridcolor": "#e4e9e3",
        },
        yaxis={
            "categoryorder": "array",
            "categoryarray": list(reversed([food["name"] for food in ranked])),
            "gridcolor": "#f0f3ed",
        },
    )
    return figure


def make_protein_figure(result):
    lines = sorted(result["lines"], key=lambda line: line["protein"], reverse=True)
    highest = lines[0]["protein"] if lines else 1
    return go.Figure(
        [
            go.Bar(
                x=[line["protein"] for line in lines],
                y=[line["food"]["name"] for line in lines],
                orientation="h",
                marker={
                    "color": [
                        "#8cae3e" if line["protein"] == highest else "#216854"
                        for line in lines
                    ]
                },
                text=[f"{line['protein']:.1f} g" for line in lines],
                textposition="outside",
                cliponaxis=False,
                hovertemplate="<b>%{y}</b><br>%{x:.1f} g protein<extra></extra>",
            )
        ],
        layout={
            "height": max(260, 90 + len(lines) * 48),
            "margin": {"l": 8, "r": 48, "t": 8, "b": 38},
            "paper_bgcolor": "white",
            "plot_bgcolor": "white",
            "font": {"family": "Segoe UI, Arial, sans-serif", "color": "#183c39"},
            "xaxis": {
                "rangemode": "tozero",
                "title": "Protein (g)",
                "gridcolor": "#e4e9e3",
            },
            "yaxis": {
                "categoryorder": "array",
                "categoryarray": list(reversed([line["food"]["name"] for line in lines])),
                "gridcolor": "#f0f3ed",
            },
        },
    )


def source_mappings():
    blocks = []
    for food in FOODS:
        product_links = []
        for retailer in RETAILERS:
            product = food["offers"][retailer]
            product_links.extend(
                [
                    html.Br(),
                    html.Strong(f"{retailer}: "),
                    html.A(
                        product["name"],
                        href=product["url"],
                        target="_blank",
                        rel="noopener",
                    ),
                    html.Span(
                        f" · {money(product.get('price'))} · "
                        f"updated {product.get('updated_at', '')[:10]}"
                    ),
                ]
            )
        blocks.append(
            html.Div(
                [
                    html.Strong(food["name"]),
                    html.Br(),
                    html.Span(food["quality"]),
                    *product_links,
                ],
                className="source-entry",
            )
        )
    return blocks


app = Dash(__name__, title="Budget Protein Planner")
server = app.server

app.index_string = """
<!DOCTYPE html>
<html lang="en-AU">
<head>
    {%metas%}
    <title>{%title%}</title>
    {%favicon%}
    {%css%}
    <style>
        :root {
            --ink: #183c39;
            --muted: #556761;
            --paper: #f5f7f2;
            --green: #216854;
            --line: #dce5df;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            background: var(--paper);
            color: var(--ink);
            font: 15px "Segoe UI", Arial, sans-serif;
        }
        header {
            background: #173d37;
            color: white;
            padding: 20px 4%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 700;
            font-size: 22px;
        }
        header .brand-lockup { display: flex; align-items: baseline; }
        header .brand-title { margin-left: 14px; font-size: 13px; font-weight: 500; }
        main { max-width: 1550px; margin: auto; padding: 30px 4%; }
        h1 { font-size: 38px; letter-spacing: -1.3px; margin: 8px 0; }
        h2 { font-size: 20px; margin: 8px 0 14px; }
        h3 { font-size: 16px; margin: 8px 0; }
        p { color: var(--muted); line-height: 1.55; }
        .eyebrow {
            color: var(--muted);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
        }
        .notice {
            margin: 18px 0 22px;
            padding: 14px 16px;
            border: 1px solid #e3d6b6;
            border-radius: 10px;
            background: #f4eddc;
            color: #6a542a;
            font-size: 13px;
        }
        .targets {
            display: grid;
            grid-template-columns: 1fr 1fr 1.3fr;
            gap: 16px;
            margin: 20px 0;
        }
        .field { min-width: 0; }
        .field label {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            gap: 10px;
            margin-bottom: 8px;
            font-weight: 700;
        }
        .field label span { color: var(--muted); font-size: 11px; font-weight: 400; }
        input, .Select-control, .Select-menu-outer { font: inherit; }
        .workspace {
            display: grid;
            grid-template-columns: 1.55fr 1fr;
            gap: 18px;
        }
        .panel {
            background: white;
            border: 1px solid var(--line);
            border-radius: 12px;
            padding: 20px;
            min-width: 0;
        }
        .section-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
        }
        .pill {
            white-space: nowrap;
            border-radius: 20px;
            background: #edf3e8;
            padding: 6px 9px;
            font-size: 11px;
        }
        .filters {
            display: grid;
            grid-template-columns: 1.4fr 1fr 1fr;
            gap: 8px;
            margin: 10px 0 14px;
        }
        .filter-field label {
            display: block;
            margin-bottom: 4px;
            font-size: 11px;
            font-weight: 600;
        }
        .insight {
            margin: 0 0 14px;
            padding: 12px 14px;
            border-left: 4px solid var(--green);
            border-radius: 7px;
            background: linear-gradient(110deg, #eaf2e8, #f8faf5);
        }
        .insight .eyebrow { color: var(--green); }
        .insight h3 { margin: 6px 0; }
        .insight p { margin: 0; font-size: 13px; }
        .table-wrap {
            max-height: 460px;
            overflow: auto;
            border-radius: 4px;
        }
        .table-wrap:focus-visible, button:focus-visible, a:focus-visible {
            outline: 3px solid #6ba993;
            outline-offset: 2px;
        }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th {
            text-align: left;
            color: var(--muted);
            font-size: 11px;
            background: #f3f6f1;
            position: sticky;
            top: 0;
            padding: 11px 8px;
        }
        td, tbody th { border-bottom: 1px solid #edf0eb; padding: 12px 8px; }
        tbody th { text-align: left; font-weight: 400; background: transparent; position: static; }
        td small, tbody th small {
            display: block;
            margin-top: 5px;
            color: var(--muted);
            font-size: 11px;
        }
        tr.selected-row { background: #eff7ed; }
        tr.selected-row tbody th, tr.selected-row th { box-shadow: inset 4px 0 var(--green); }
        .meal-badge {
            display: inline-block;
            margin-left: 6px;
            padding: 3px 6px;
            border-radius: 10px;
            background: var(--green);
            color: white;
            font-size: 10px;
            letter-spacing: .7px;
            vertical-align: middle;
        }
        .lower-price .price-main { color: var(--green); font-weight: 800; }
        button {
            border: 1px solid var(--line);
            border-radius: 6px;
            padding: 7px 10px;
            background: white;
            color: var(--ink);
            cursor: pointer;
        }
        button:hover { background: #e8f1e7; }
        button.add { min-width: 32px; min-height: 32px; border: 0; background: var(--green); color: white; }
        .meal-row {
            display: grid;
            grid-template-columns: 1fr 90px 34px;
            gap: 8px;
            align-items: center;
            padding: 13px 0;
            border-bottom: 1px solid var(--line);
        }
        .meal-row input { width: 100%; min-height: 36px; padding: 7px; }
        .meal-row small { display: block; margin-top: 4px; color: var(--muted); font-size: 11px; }
        .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 18px 0; }
        .summary span, .purchase span { display: block; color: var(--muted); font-size: 11px; }
        .summary strong { display: block; margin-top: 6px; font-size: 23px; }
        .purchase { padding: 16px; border-radius: 9px; background: #f0f4ea; }
        .purchase-head { display: flex; justify-content: space-between; align-items: center; }
        .purchase strong { font-size: 23px; }
        .purchase p, .pack-line { font-size: 12px; }
        .store-compare { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; margin-top: 12px; }
        .store-card { padding: 10px; border: 1px solid var(--line); border-radius: 8px; }
        .store-card.active { border: 2px solid var(--green); background: #eff7ed; padding: 9px; }
        .store-card span, .store-card small { display: block; color: var(--muted); font-size: 10px; }
        .store-card strong { display: block; margin: 4px 0; font-size: 18px; }
        .retailer-insight { font-size: 12px; }
        .progress-grid, .charts {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            margin-top: 18px;
        }
        .charts { align-items: start; }
        progress { width: 100%; height: 10px; margin-top: 18px; border: 0; }
        progress::-webkit-progress-bar { background: #edf1e8; border-radius: 10px; }
        progress::-webkit-progress-value { background: var(--green); border-radius: 10px; }
        details { margin-top: 12px; }
        summary { min-height: 26px; line-height: 26px; cursor: pointer; color: var(--green); font-weight: 600; }
        .chart-note, .footnote, .sub { font-size: 12px; }
        .source-entry { padding: 8px 0; border-bottom: 1px solid #edf0eb; font-size: 12px; color: var(--muted); }
        .sr-only {
            position: absolute !important;
            width: 1px !important;
            height: 1px !important;
            padding: 0 !important;
            margin: -1px !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            white-space: nowrap !important;
            border: 0 !important;
        }
        footer { display: flex; justify-content: space-between; gap: 30px; margin-top: 24px; color: var(--muted); font-size: 11px; }
        @media (max-width: 1050px) {
            .workspace, .charts { grid-template-columns: 1fr; }
        }
        @media (max-width: 650px) {
            main { padding: 22px 4%; }
            h1 { font-size: 30px; }
            .targets, .progress-grid, .store-compare, .filters { grid-template-columns: 1fr; }
            .table-wrap { max-height: none; overflow: visible; }
            .table-wrap table, .table-wrap tbody { display: block; width: 100%; }
            .table-wrap thead {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
            }
            #foods-body tr {
                display: block;
                margin-bottom: 12px;
                padding: 12px;
                border: 1px solid var(--line);
                border-radius: 9px;
            }
            #foods-body th, #foods-body td {
                display: block;
                width: 100%;
                padding: 5px 0;
                border: 0;
            }
            #foods-body td {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 12px;
                border-top: 1px solid #edf0eb;
            }
            #foods-body td::before { content: attr(data-label); color: var(--muted); }
        }
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                scroll-behavior: auto !important;
                transition-duration: .01ms !important;
                animation-duration: .01ms !important;
            }
        }
    </style>
</head>
<body>
    {%app_entry%}
    <footer>{%config%}{%scripts%}{%renderer%}</footer>
</body>
</html>
"""

app.layout = html.Div(
    [
        dcc.Store(id="meal-store", data=DEFAULT_MEAL),
        html.Header(
            [
                html.Div(
                    [
                        html.Strong("BP"),
                        html.Span("Budget Protein Planner", className="brand-title"),
                    ],
                    className="brand-lockup",
                ),
                html.Span("STUDENT MEAL STUDIO / DASH"),
            ]
        ),
        html.Main(
            [
                html.Div("LESS SPEND. MORE POSSIBILITY.", className="eyebrow"),
                html.H1("A better meal starts here."),
                html.P(
                    "Compare everyday ingredients. Find your protein target, within your budget."
                ),
                html.Div(
                    [
                        html.Strong("Reviewed price snapshot · 20 October 2026. "),
                        "24 foods have Woolworths and Coles catalogue offers. "
                        "Prices are not live shelf prices and no automatic refresh is enabled.",
                    ],
                    className="notice",
                ),
                html.Div(
                    [
                        html.Div(
                            [
                                html.Label(
                                    ["Meal protein target ", html.Span("g / meal")],
                                    htmlFor="protein-target",
                                ),
                                dcc.Input(
                                    id="protein-target",
                                    type="number",
                                    min=1,
                                    max=500,
                                    value=40,
                                    debounce=True,
                                ),
                            ],
                            className="field",
                        ),
                        html.Div(
                            [
                                html.Label(
                                    ["Meal portion budget ", html.Span("AUD / meal")],
                                    htmlFor="budget-target",
                                ),
                                dcc.Input(
                                    id="budget-target",
                                    type="number",
                                    min=0.5,
                                    max=1000,
                                    step=0.5,
                                    value=5,
                                    debounce=True,
                                ),
                            ],
                            className="field",
                        ),
                        html.Div(
                            [
                                html.Label(
                                    ["Retailer preference ", html.Span("Price reference")],
                                    htmlFor="retailer",
                                ),
                                dcc.Dropdown(
                                    id="retailer",
                                    options=[
                                        {
                                            "label": "Both — lowest price per item",
                                            "value": "Both",
                                        },
                                        {"label": "Woolworths", "value": "Woolworths"},
                                        {"label": "Coles", "value": "Coles"},
                                    ],
                                    value="Both",
                                    clearable=False,
                                ),
                            ],
                            className="field",
                        ),
                    ],
                    className="targets",
                ),
                html.Div(
                    [
                        html.Section(
                            [
                                html.Div(
                                    [
                                        html.Div(
                                            [
                                                html.Div(
                                                    "01 / EXPLORE",
                                                    className="eyebrow",
                                                ),
                                                html.H2("Everyday ingredients"),
                                            ]
                                        ),
                                        html.Span(id="coverage", className="pill"),
                                    ],
                                    className="section-head",
                                ),
                                html.Div(
                                    [
                                        html.Div(
                                            [
                                                html.Label(
                                                    "Search foods",
                                                    htmlFor="search",
                                                ),
                                                dcc.Input(
                                                    id="search",
                                                    type="search",
                                                    placeholder="Search chicken, tofu, oats…",
                                                    value="",
                                                    debounce=True,
                                                ),
                                            ],
                                            className="filter-field",
                                        ),
                                        html.Div(
                                            [
                                                html.Label(
                                                    "Food category",
                                                    htmlFor="category",
                                                ),
                                                dcc.Dropdown(
                                                    id="category",
                                                    options=[
                                                        {
                                                            "label": "All categories",
                                                            "value": "All categories",
                                                        },
                                                        *[
                                                            {
                                                                "label": item,
                                                                "value": item,
                                                            }
                                                            for item in CATEGORIES
                                                        ],
                                                    ],
                                                    value="All categories",
                                                    clearable=False,
                                                ),
                                            ],
                                            className="filter-field",
                                        ),
                                        html.Div(
                                            [
                                                html.Label(
                                                    "Sort foods",
                                                    htmlFor="sort",
                                                ),
                                                dcc.Dropdown(
                                                    id="sort",
                                                    options=[
                                                        {
                                                            "label": "Name A–Z",
                                                            "value": "name",
                                                        },
                                                        {
                                                            "label": "Protein / $: highest",
                                                            "value": "value",
                                                        },
                                                    ],
                                                    value="name",
                                                    clearable=False,
                                                ),
                                            ],
                                            className="filter-field",
                                        ),
                                    ],
                                    className="filters",
                                ),
                                html.Div(id="insight", className="insight"),
                                html.Div(
                                    html.Table(
                                        [
                                            html.Caption(
                                                "Foods with Woolworths and Coles prices, "
                                                "protein value and add-to-meal controls.",
                                                className="sr-only",
                                            ),
                                            html.Thead(
                                                html.Tr(
                                                    [
                                                        html.Th(
                                                            "Food / reference state",
                                                            scope="col",
                                                        ),
                                                        html.Th(
                                                            "Woolworths AUD / unit",
                                                            scope="col",
                                                        ),
                                                        html.Th(
                                                            "Coles AUD / unit",
                                                            scope="col",
                                                        ),
                                                        html.Th(
                                                            "Protein/$ g/AUD",
                                                            scope="col",
                                                        ),
                                                        html.Th(
                                                            "Cost/25 g protein",
                                                            scope="col",
                                                        ),
                                                        html.Th(
                                                            "Add to meal",
                                                            scope="col",
                                                        ),
                                                    ]
                                                )
                                            ),
                                            html.Tbody(id="foods-body"),
                                        ],
                                        role="table",
                                    ),
                                    className="table-wrap",
                                    tabIndex=0,
                                    role="region",
                                    **{
                                        "aria-label": "Ingredient price comparison. "
                                        "Scroll to view all foods and columns."
                                    },
                                ),
                                html.P(
                                    "Solids use grams; liquids use mL; eggs use "
                                    "individual eggs; tuna uses cans. Rice and "
                                    "lentils use dry weight.",
                                    className="footnote",
                                ),
                            ],
                            className="panel",
                        ),
                        html.Section(
                            [
                                html.Div(
                                    [
                                        html.Div(
                                            [
                                                html.Div(
                                                    "02 / COMBINE",
                                                    className="eyebrow",
                                                ),
                                                html.H2("Your meal"),
                                            ]
                                        ),
                                        html.Button(
                                            "Clear meal",
                                            id="clear-meal",
                                            n_clicks=0,
                                        ),
                                    ],
                                    className="section-head",
                                ),
                                html.Div(id="meal-list"),
                                html.Div(
                                    [
                                        html.Div(
                                            [
                                                html.Span("Protein"),
                                                html.Strong(id="total-protein"),
                                            ]
                                        ),
                                        html.Div(
                                            [
                                                html.Span("Energy"),
                                                html.Strong(id="total-energy"),
                                            ]
                                        ),
                                        html.Div(
                                            [
                                                html.Span("Portion cost"),
                                                html.Strong(id="total-cost"),
                                            ]
                                        ),
                                    ],
                                    className="summary",
                                ),
                                html.Div(
                                    [
                                        html.Div(
                                            [
                                                html.Span("Full-pack purchase"),
                                                html.Strong(id="pack-cost"),
                                            ],
                                            className="purchase-head",
                                        ),
                                        html.P(
                                            "Assumes an empty pantry. The budget "
                                            "applies to portion cost."
                                        ),
                                        html.Div(id="pack-list"),
                                    ],
                                    className="purchase",
                                ),
                                html.Div(
                                    id="store-compare",
                                    className="store-compare",
                                ),
                                html.P(
                                    id="retailer-insight",
                                    className="retailer-insight",
                                ),
                            ],
                            className="panel",
                        ),
                    ],
                    className="workspace",
                ),
                html.Div(
                    [
                        html.Section(
                            [
                                html.Div(
                                    [
                                        html.H3("Protein target"),
                                        html.Strong(id="protein-progress-label"),
                                    ],
                                    className="section-head",
                                ),
                                html.Progress(
                                    id="protein-progress",
                                    max=100,
                                    value=0,
                                    **{
                                        "aria-label": "Protein target progress"
                                    },
                                ),
                                html.P(id="protein-status"),
                            ],
                            className="panel",
                        ),
                        html.Section(
                            [
                                html.Div(
                                    [
                                        html.H3("Portion budget"),
                                        html.Strong(id="budget-progress-label"),
                                    ],
                                    className="section-head",
                                ),
                                html.Progress(
                                    id="budget-progress",
                                    max=100,
                                    value=0,
                                    **{
                                        "aria-label": "Portion budget progress"
                                    },
                                ),
                                html.P(id="budget-status"),
                            ],
                            className="panel",
                        ),
                    ],
                    className="progress-grid",
                ),
                html.Div(
                    [
                        html.Section(
                            [
                                html.Div("03 / UNDERSTAND", className="eyebrow"),
                                html.H2("Selected meal: protein contribution"),
                                html.P(
                                    "Bar length shows each food's contribution "
                                    "in grams."
                                ),
                                dcc.Graph(
                                    id="protein-chart",
                                    config={"displayModeBar": False},
                                ),
                                html.Div(id="protein-data", className="sr-only"),
                            ],
                            className="panel",
                        ),
                        html.Section(
                            [
                                html.Div(
                                    [
                                        html.Div(
                                            [
                                                html.Div(
                                                    "DECISION VIEW",
                                                    className="eyebrow",
                                                ),
                                                html.H2(
                                                    "Which protein is cheapest?"
                                                ),
                                            ]
                                        ),
                                        dcc.Dropdown(
                                            id="chart-limit",
                                            options=[
                                                {
                                                    "label": "Cheapest 10",
                                                    "value": 10,
                                                },
                                                {
                                                    "label": "All visible",
                                                    "value": 24,
                                                },
                                            ],
                                            value=10,
                                            clearable=False,
                                            style={"width": "130px"},
                                        ),
                                    ],
                                    className="section-head",
                                ),
                                html.P(id="price-caption", className="chart-note"),
                                dcc.Graph(
                                    id="price-chart",
                                    config={"displayModeBar": False},
                                ),
                                html.Div(id="price-data", className="sr-only"),
                                html.P(
                                    "Lower bars mean less money per 25 g protein. "
                                    "Woolworths is solid; Coles is striped.",
                                    className="chart-note",
                                ),
                            ],
                            className="panel",
                        ),
                    ],
                    className="charts",
                ),
                html.Section(
                    [
                        html.H2("Data provenance and limitations"),
                        html.P(
                            "AFCD nutrients and product labels are joined to "
                            "reviewed Woolworths and Coles catalogue offers. "
                            "Catalogue prices are snapshots and must be checked "
                            "before purchase."
                        ),
                        html.Details(
                            [
                                html.Summary("Inspect all source mappings"),
                                *source_mappings(),
                            ]
                        ),
                    ],
                    className="panel",
                ),
                html.Footer(
                    [
                        html.Span(
                            "Nutrition: AFCD Release 3 and identified product labels."
                        ),
                        html.Span(
                            "Planning support, not medical advice."
                        ),
                    ]
                ),
            ]
        ),
    ]
)


@app.callback(
    Output("foods-body", "children"),
    Output("coverage", "children"),
    Output("insight", "children"),
    Input("search", "value"),
    Input("category", "value"),
    Input("sort", "value"),
    Input("retailer", "value"),
    Input("meal-store", "data"),
)
def update_catalogue(search, category, sort_order, retailer, meal):
    rows = filter_foods(search, category, retailer, sort_order)
    body = []
    for food in rows:
        selected = offer(food, retailer)
        in_meal = food["id"] in (meal or {})
        body.append(
            html.Tr(
                [
                    html.Th(
                        [
                            html.Strong(food["name"]),
                            html.Span(
                                "IN MEAL",
                                className="meal-badge",
                            )
                            if in_meal
                            else None,
                            html.Small(food.get("comparison", "")),
                            html.Small(
                                f"{nutrition(food, selected)['protein']:.1f} g "
                                f"protein / {food.get('basis', 100)} {food['unit']}"
                            ),
                        ],
                        scope="row",
                    ),
                    price_cell(food, "Woolworths"),
                    price_cell(food, "Coles"),
                    html.Td(
                        f"{nutrition(food, selected)['protein'] / selected['unitPrice']:.1f}"
                        if selected
                        else "—",
                        **{"data-label": "Protein per dollar"},
                    ),
                    html.Td(
                        money(cost_25(food, retailer)),
                        **{"data-label": "Cost per 25 g protein"},
                    ),
                    html.Td(
                        html.Button(
                            "+",
                            id={"type": "add-food", "food": food["id"]},
                            n_clicks=0,
                            className="add",
                            **{"aria-label": f"Add {food['name']} to meal"},
                        ),
                        **{"data-label": "Meal action"},
                    ),
                ],
                className="selected-row" if in_meal else "",
            )
        )
    if not body:
        body = [html.Tr(html.Td("No matching foods.", colSpan=6))]
    coverage = (
        f"{len(FOODS)} foods · 2 retailers · "
        f"{sum(len(food['offers']) for food in FOODS)} offers"
    )
    return body, coverage, insight_for(rows, retailer)


@app.callback(
    Output("price-chart", "figure"),
    Output("price-caption", "children"),
    Output("price-data", "children"),
    Input("search", "value"),
    Input("category", "value"),
    Input("retailer", "value"),
    Input("chart-limit", "value"),
)
def update_price_chart(search, category, retailer, limit):
    rows = filter_foods(search, category, retailer, "name")
    priced = [food for food in rows if cost_25(food, retailer)]
    shown = sorted(priced, key=lambda food: cost_25(food, retailer))[:limit]
    figure = make_price_figure(shown, retailer, limit)
    caption = (
        f"Showing the {len(shown)} cheapest of {len(priced)} visible foods. "
        "Filters and retailer choice update this chart."
    )
    data = html.Ul(
        [
            html.Li(
                f"{food['name']}: "
                + ", ".join(
                    f"{name} {money(cost_25(food, name))}"
                    for name in (RETAILERS if retailer == "Both" else (retailer,))
                )
                + " per 25 g protein."
            )
            for food in shown
        ]
    )
    return figure, caption, data


@app.callback(
    Output("meal-list", "children"),
    Output("total-protein", "children"),
    Output("total-energy", "children"),
    Output("total-cost", "children"),
    Output("pack-cost", "children"),
    Output("pack-list", "children"),
    Output("store-compare", "children"),
    Output("retailer-insight", "children"),
    Output("protein-progress", "value"),
    Output("protein-progress-label", "children"),
    Output("protein-status", "children"),
    Output("budget-progress", "value"),
    Output("budget-progress-label", "children"),
    Output("budget-status", "children"),
    Output("protein-chart", "figure"),
    Output("protein-data", "children"),
    Input("meal-store", "data"),
    Input("retailer", "value"),
    Input("protein-target", "value"),
    Input("budget-target", "value"),
)
def update_meal(meal, retailer, protein_target, budget_target):
    protein_target = protein_target or 40
    budget_target = budget_target or 5
    result = calculate(meal, retailer)
    rows = []
    packs = []
    for line in result["lines"]:
        food = line["food"]
        selected = line["selected"]
        rows.append(
            html.Div(
                [
                    html.Div(
                        [
                            html.Strong(food["name"]),
                            html.Small(
                                f"{selected['name']} · "
                                f"{selected.get('updated_at', '')[:10]}"
                            ),
                        ]
                    ),
                    html.Label(
                        [
                            html.Span(
                                f"{food['name']} amount in {food['unit']}",
                                className="sr-only",
                            ),
                            dcc.Input(
                                id={"type": "grams", "food": food["id"]},
                                type="number",
                                min=0.5 if food.get("basis") == 1 else 1,
                                step=0.5 if food.get("basis") == 1 else 1,
                                value=line["amount"],
                                debounce=True,
                            ),
                        ]
                    ),
                    html.Button(
                        "×",
                        id={"type": "remove-food", "food": food["id"]},
                        n_clicks=0,
                        **{"aria-label": f"Remove {food['name']}"},
                    ),
                ],
                className="meal-row",
            )
        )
        packs.append(
            html.P(
                f"{food['name']}: "
                + (
                    f"{line['packs']} × {selected['pack']} {food['unit']} "
                    f"({selected['retailer']}) · "
                    f"{money(line['packs'] * selected['price'])}"
                    if line["packs"]
                    else "unit price only"
                ),
                className="pack-line",
            )
        )
    if not rows:
        rows = [html.P("Add an ingredient to start your meal.")]

    woolworths_total = calculate(meal, "Woolworths")["cost"]
    coles_total = calculate(meal, "Coles")["cost"]
    split_total = calculate(meal, "Both")["cost"]
    store_cards = [
        html.Div(
            [
                html.Span("Woolworths only"),
                html.Strong(money(woolworths_total)),
                html.Small("portion cost"),
            ],
            className="store-card active" if retailer == "Woolworths" else "store-card",
        ),
        html.Div(
            [
                html.Span("Coles only"),
                html.Strong(money(coles_total)),
                html.Small("portion cost"),
            ],
            className="store-card active" if retailer == "Coles" else "store-card",
        ),
        html.Div(
            [
                html.Span("Split basket"),
                html.Strong(money(split_total)),
                html.Small("portion cost"),
            ],
            className="store-card active" if retailer == "Both" else "store-card",
        ),
    ]
    cheapest_single = min(
        value for value in (woolworths_total, coles_total) if value is not None
    ) if (woolworths_total is not None or coles_total is not None) else None
    saving = (
        cheapest_single - split_total
        if cheapest_single is not None and split_total is not None
        else None
    )
    if saving is None:
        retailer_note = "A single-store comparison is unavailable."
    elif saving >= 0.05:
        retailer_note = (
            f"Splitting this list costs {money(split_total)}, "
            f"{money(saving)} less than the cheaper one-store total, "
            "but requires visiting both supermarkets."
        )
    else:
        retailer_note = (
            f"Splitting saves only {money(saving)} versus the cheaper "
            "one-store total; shopping at one store is simpler."
        )

    protein_percent = min(100, result["protein"] / protein_target * 100)
    budget_percent = min(100, result["cost"] / budget_target * 100)
    protein_status = (
        f"{max(0, protein_target - result['protein']):.1f} g remaining."
        if result["protein"] < protein_target
        else "Protein target reached. More is not automatically better."
    )
    budget_status = (
        f"{money(result['cost'] - budget_target)} over the meal budget."
        if result["cost"] > budget_target
        else f"{money(budget_target - result['cost'])} remaining."
    )
    protein_chart = make_protein_figure(result)
    protein_data = html.Ul(
        [
            html.Li(f"{line['food']['name']}: {line['protein']:.1f} g protein")
            for line in result["lines"]
        ]
    )
    return (
        rows,
        f"{result['protein']:.1f} g",
        f"{round(result['kcal'])} kcal",
        money(result["cost"]),
        money(result["purchase"]),
        packs,
        store_cards,
        retailer_note,
        protein_percent,
        f"{result['protein']:.1f} / {protein_target} g",
        protein_status,
        budget_percent,
        f"{money(result['cost'])} / {money(budget_target)}",
        budget_status,
        protein_chart,
        protein_data,
    )


def register_food_callbacks(food):
    food_id = food["id"]

    @app.callback(
        Output("meal-store", "data", allow_duplicate=True),
        Input({"type": "add-food", "food": food_id}, "n_clicks"),
        State("meal-store", "data"),
        prevent_initial_call=True,
    )
    def add_food(n_clicks, current):
        if not n_clicks:
            return no_update
        meal = dict(current or {})
        meal[food_id] = meal.get(food_id, 0) + food.get("basis", 100)
        return meal

    @app.callback(
        Output("meal-store", "data", allow_duplicate=True),
        Input({"type": "remove-food", "food": food_id}, "n_clicks"),
        State("meal-store", "data"),
        prevent_initial_call=True,
    )
    def remove_food(n_clicks, current):
        if not n_clicks:
            return no_update
        meal = dict(current or {})
        meal.pop(food_id, None)
        return meal

    @app.callback(
        Output("meal-store", "data", allow_duplicate=True),
        Input({"type": "grams", "food": food_id}, "value"),
        State("meal-store", "data"),
        prevent_initial_call=True,
    )
    def set_amount(value, current):
        if not isinstance(value, (int, float)) or value <= 0:
            return no_update
        meal = dict(current or {})
        if food_id not in meal or meal[food_id] == value:
            return no_update
        meal[food_id] = value
        return meal


for food in FOODS:
    register_food_callbacks(food)


@app.callback(
    Output("meal-store", "data", allow_duplicate=True),
    Input("clear-meal", "n_clicks"),
    prevent_initial_call=True,
)
def clear_meal(n_clicks):
    return {} if n_clicks else no_update


if __name__ == "__main__":
    app.run(debug=False)
