# Kosmiliste kauguste redel

A web app for climbing the cosmic distance ladder. The user interface is in
Estonian.

Two rungs are implemented:

1. Measuring the distance to an open star cluster from *Gaia* DR3 parallaxes.
2. Calibrating the Cepheid period-luminosity relation with Cepheids that
   belong to open clusters, using the cluster distances from the first rung.

The app queries *Gaia* DR3 stars around a cluster. The user then picks the
cluster members by their common proper motion, and the app averages the
member parallaxes to get the cluster distance.

## Usage

Open `index.html` in a browser. Nothing needs to be built or installed. The
page needs an internet connection, because it loads Plotly from a CDN and
queries the data services directly from the browser.

1. Enter a cluster name (e.g. `M67`, `Pleiades`, `NGC 2516`) or coordinates
   in the left box, or decimal-degree coordinates (`132.85 11.81`) in the
   right box. Set the search radius and the G magnitude limit, then press
   **Päri Gaiast**. A name is resolved when the query runs, and its
   coordinates appear in the right box. The example buttons fill in suitable
   values for a few well-known clusters. A query runs only when you press
   the button (or Enter).
2. Check the queried stars in the table, which shows 10 rows per page.
3. On the proper-motion plot, use the lasso to mark the dense clump of stars
   that move together. Each lasso adds stars to the selection, and
   **Tühista valik** clears it. The selected stars are highlighted in the sky
   view, the colour–magnitude diagram and the table.
4. Optionally refine the selection in the colour–magnitude diagram: clicking
   a selected star removes it, clicking a removed star puts it back, and
   **Taasta valik** brings all removed stars back. Any change to the lasso selection discards these removals.
5. Read the number of selected stars and the distance in parsecs, light
   years, astronomical units and kilometres below the plots. The parallax
   histogram marks the mean parallax. You can download the selected stars
   as a CSV file.

### Cepheids

The second part of the page lists 15 classical Cepheids in 13 open clusters.
**Mõõda** fills in the query form for a cluster, but you still start the query
yourself. After selecting the cluster members, press **Salvesta parve … kaugus**
below the distance tiles to store the mean cluster parallax. Each stored
cluster adds its Cepheids to the period-luminosity plot. With two or more
Cepheids, the app fits a weighted straight line. Stored distances are kept in
the browser (`localStorage`) and can be removed with **Kustuta**.

## Method

- Only stars with RUWE < 1.4 and with a measured parallax and proper motion
  are queried.
- The distance is `d = 1000 / ⟨ϖ⟩` pc, where `⟨ϖ⟩` is the inverse-variance
  weighted mean parallax in mas. The parallaxes are averaged before inverting,
  because the mean of 1/ϖ is biased.
- The global DR3 parallax zero-point of −0.017 mas (Lindegren et al. 2021)
  is always corrected.
- A 0.010 mas systematic error is added in quadrature to the statistical
  error. Angularly correlated parallax errors do not average down
  (Lindegren et al. 2021; Maíz Apellániz et al. 2021).
- The app warns when the selection is small, when the relative parallax
  error exceeds 10 %, or when the parallax scatter is much larger than the
  quoted errors (reduced χ² > 3).
- The colour–magnitude diagram can show absolute magnitudes. Extinction is
  not corrected.

- Cepheid luminosities use the reddening-free Wesenheit magnitude
  `W = G − 1.90 (BP − RP)` (Ripepi et al. 2019). The absolute magnitude is
  `M_W = W + 5 log10(ϖ / mas) − 10`, with ϖ the stored cluster parallax. The
  fit is `M_W = a (log P − 1) + b`, weighted by the parallax errors.

## Data services

- *Gaia* DR3 data come from the
  [GAVO Data Center](https://dc.g-vo.org/tableinfo/gaia.dr3lite) TAP service,
  with VizieR [I/355/gaiadr3](https://vizier.cds.unistra.fr/viz-bin/VizieR?-source=I/355/gaiadr3)
  as a fallback. Fields larger than 1.5° are queried as asynchronous jobs,
  and results are capped at 60 000 rows.
- Cluster names are resolved with SIMBAD and Sesame (CDS, Strasbourg).
- The cluster–Cepheid pairs come from Cruz Reyes & Anderson (2023, A&A 672,
  A85; VizieR J/A+A/672/A85). Only Cepheids with a membership probability of
  at least 0.5 that pulsate in the fundamental mode are used. Their periods
  and intensity-averaged G, BP and RP magnitudes are from the *Gaia* DR3
  `vari_cepheid` table (VizieR I/358/vcep). These values are built into the
  page, because no CORS-enabled service offers that table.

## Code

Everything is in `index.html`: the HTML, the CSS and the JavaScript. The only
external dependency is [Plotly.js](https://plotly.com/javascript/), loaded
from cdnjs.
