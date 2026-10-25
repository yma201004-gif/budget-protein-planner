# Running the dashboard

## Fastest method

Keep `index.html`, `style.css`, `app.js`, `data.js`, `prices.js`,
`reviewed-data.js`, and `model.js` in the same folder. Open `index.html` in a
current browser.

## Standard Python or conda environment

No third-party package or internet connection is required:

```text
python run.py
```

Open <http://127.0.0.1:8000>. To use another port:

```text
python run.py 8080
```

`requirements.txt` intentionally contains no package requirements because the
runtime uses only the Python standard library and browser-native web APIs.

## Submission package

The self-contained runtime includes:

- `index.html`, `style.css` and `app.js`
- `data.js`, `prices.js`, `reviewed-data.js` and `model.js`
- `run.py`, `requirements.txt` and this guide

All price and nutrition records used by the interface are embedded in the
JavaScript data files. No external data request, API key or database is needed
to reproduce the displayed dashboard.
