# Kauguste redel

A single-page web app for measuring the distance to an open star cluster from
*Gaia* DR3 parallaxes. The user interface is in Estonian.

The app queries *Gaia* DR3 stars around a cluster. The user then picks the
cluster members by their common proper motion, and the app averages the
member parallaxes to get the cluster distance.

## Usage

Open `index.html` in a browser. Nothing needs to be built or installed. The
page needs an internet connection, because it loads Plotly from a CDN and
queries the data services directly from the browser.

1. Enter a cluster name (e.g. `M67`, `Pleiades`, `NGC 2516`) or coordinates
   (`132.85 11.81` or `08:51:23 +11:48:50`). Set the search radius and the G
   magnitude limit, then press **Päri Gaiast**. The example buttons fill in
   suitable values for a few well-known clusters.
2. Check the queried stars in the table, which shows 10 rows per page.
3. On the proper-motion plot, use the lasso to mark the dense clump of stars
   that move together. Each lasso adds stars to the selection, and
   **Tühista valik** clears it. The selected stars are highlighted in the sky
   view, the colour–magnitude diagram and the table.
4. Read the mean parallax and the distance in parsecs, light years and
   kilometres below the plots. You can download the selected stars as a CSV
   file.

The query parameters are kept in the page URL (`?target=M67&r=0.3&g=18`), so
a link reopens the same field.

## Method

- Only stars with RUWE < 1.4 and with a measured parallax and proper motion
  are queried.
- The distance is `d = 1000 / ⟨ϖ⟩` pc, where `⟨ϖ⟩` is the inverse-variance
  weighted mean parallax in mas. The parallaxes are averaged before inverting,
  because the mean of 1/ϖ is biased.
- By default the global DR3 parallax zero-point of −0.017 mas
  (Lindegren et al. 2021) is corrected. This can be switched off.
- A 0.010 mas systematic error is added in quadrature to the statistical
  error. Angularly correlated parallax errors do not average down
  (Lindegren et al. 2021; Maíz Apellániz et al. 2021).
- The app warns when the selection is small, when the relative parallax
  error exceeds 10 %, or when the parallax scatter is much larger than the
  quoted errors (reduced χ² > 3).
- The colour–magnitude diagram can show absolute magnitudes. Extinction is
  not corrected.

## Data services

- *Gaia* DR3 data come from the
  [GAVO Data Center](https://dc.g-vo.org/tableinfo/gaia.dr3lite) TAP service,
  with VizieR [I/355/gaiadr3](https://vizier.cds.unistra.fr/viz-bin/VizieR?-source=I/355/gaiadr3)
  as a fallback. Fields larger than 1.5° are queried as asynchronous jobs,
  and results are capped at 60 000 rows.
- Cluster names are resolved with SIMBAD and Sesame (CDS, Strasbourg).

## Code

Everything is in `index.html`: the HTML, the CSS and the JavaScript. The only
external dependency is [Plotly.js](https://plotly.com/javascript/), loaded
from cdnjs.
