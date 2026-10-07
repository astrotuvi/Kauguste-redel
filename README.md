# Kosmiliste kauguste redel

A web app for climbing the cosmic distance ladder. The user interface is in
Estonian.

Four rungs are implemented:

1. Measuring the distance to an open star cluster from *Gaia* DR3 parallaxes.
2. Calibrating the Cepheid period-luminosity relation with Cepheids that
   belong to open clusters, using the cluster distances from the first rung.
3. Measuring distances to galaxies from their Cepheids with that relation,
   and the Hubble constant from the galaxy velocities and distances.
4. Calibrating the peak brightness of type Ia supernovae in those galaxies,
   and measuring the Hubble constant with distant supernovae.

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

The second part of the page lists 11 classical Cepheids in 11 open clusters, all with *HST* Wesenheit magnitudes W_H.
**Mõõda** fills in the query form for a cluster, but you still start the query
yourself. After selecting the cluster members, press **Salvesta parve … kaugus**
below the distance tiles to store the mean cluster parallax. Each stored
cluster adds its Cepheids to the period-luminosity plot. With two or more
Cepheids, the app fits a weighted straight line. Stored distances are kept in
the browser (`localStorage`) and can be removed with **Kustuta**. The
**Kustuta kõik salvestatud andmed** button at the bottom of the page clears
everything the app has stored, after a confirmation.

Few Cepheids with periods above 10 days sit in nearby clusters. The table
therefore also lists 12 field Cepheids that are not in clusters: 8 with long
periods (P = 14–39 d) and 4 with shorter periods (P = 3.4–11 d), spread
evenly in log P. Their distances come from their own *Gaia*
parallaxes. Each has its own **Lisa seosesse** button, which adds it to the
fit, shown as a diamond in the plot. They only supplement the relation: the
third part still needs at least two cluster Cepheids.

When a queried field contains a listed Cepheid, the Cepheid is marked with a
star in the sky view, the proper-motion plot and the colour–magnitude
diagram. The period-luminosity plot uses only the *HST* Wesenheit magnitude
W_H, the same system as the galaxy Cepheids. A published relation is shown
for comparison.

### Hubble law

The third part uses 19 type Ia supernova host galaxies with Cepheids
observed by *HST*. It stays hidden until you have fitted your own W_H
period-luminosity relation in the second part, which takes at least two
stored cluster Cepheids. Each galaxy distance is then found from its
Cepheids with the relation chosen in the menu:
- the relation fitted in the second part;
- or the published relation, for comparison.

Clicking a galaxy shows its Cepheids with the shifted relation. The
velocity–distance plot shows a straight line through the origin fitted by
least squares, and its slope gives the Hubble constant H₀ and the Hubble
time 1/H₀. Galaxies can be left out of the fit with the checkboxes.

### Type Ia supernovae

The fourth part appears together with the third. At first it lists only the
supernova peak magnitudes. **Kasuta 3. osa tulemusi** takes over the galaxy
distances from the third part, derives the supernova luminosity and shows
the Hubble diagram. From then on it follows changes in the third part. Each
Cepheid galaxy hosted a type Ia supernova. Its absolute peak magnitude is `M_B = m_B − μ`, with μ
from the third part. The mean over the galaxies selected there gives the
supernova luminosity. This is then applied to 166 distant supernovae
(0.023 < z < 0.06, up to about 250 Mpc). Their velocity–distance plot gives
H₀, which is compared with the third part and with Planck (67.4 km/s/Mpc).

Velocities are `v = cz (1 + 0.775 z)`. The small factor corrects for the
expansion of the Universe while the light travelled, with deceleration
parameter q₀ = −0.55 as in SH0ES. Without it, H₀ comes out about 3 % low.

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

- Cepheid luminosities use the reddening-free *HST* Wesenheit magnitude
  `W_H = F160W − 0.386 (F555W − F814W)`, the same system as the galaxy
  Cepheids. The absolute magnitude is `M_H^W = W_H + 5 log10(ϖ / mas) − 10`.
  Here ϖ is the stored cluster parallax, or for a field Cepheid its own
  *Gaia* parallax with the same zero-point correction. The fit is
  `M_H^W = a (log P − 1) + b`, weighted by the parallax errors.
- The published relation is `M_H^W = −5.914 − 3.29 (log P − 1)` (Cruz Reyes &
  Anderson 2023).
- A galaxy distance modulus is the weighted mean of `W_H − M_H^W(P)` over its
  Cepheids. The galaxy velocity is `v = c z_HD`, from the Pantheon+ redshift
  of its supernova, which is corrected for peculiar velocities. H₀ is fitted
  through the origin. Its error combines the scatter about the line and the
  zero-point error of the period-luminosity relation.

## Data services

The **Andmeallikas** menu above the query form picks the *Gaia*
service. **Automaatne**, the default, tries GAVO first and falls back to
VizieR and ARI Heidelberg. Choosing one service uses only that one. The
choice is remembered in the browser.

- *Gaia* DR3 data come from the
  [GAVO Data Center](https://dc.g-vo.org/tableinfo/gaia.dr3lite) TAP service,
  with VizieR [I/355/gaiadr3](https://vizier.cds.unistra.fr/viz-bin/VizieR?-source=I/355/gaiadr3)
  and the [ARI Heidelberg](https://gaia.ari.uni-heidelberg.de/) Gaia archive
  as fallbacks, in that order. GAVO is queried directly; the fallbacks are
  reached through the [TAP proxy](#tap-proxy). Fields larger than 1.5° are
  queried as asynchronous jobs, and results are capped at 150 000 rows.
- Cluster names are resolved with SIMBAD and Sesame (CDS, Strasbourg).
- The cluster–Cepheid pairs come from Cruz Reyes & Anderson (2023, A&A 672,
  A85; VizieR J/A+A/672/A85). Only Cepheids with a membership probability of
  at least 0.5 that pulsate in the fundamental mode and have W_H are used.
  Their periods are from the *Gaia* DR3 `vari_cepheid` table (VizieR
  I/358/vcep). These values are built into the page, because no CORS-enabled
  service offers that table. The *HST* W_H
  magnitudes of the cluster Cepheids are also from Cruz Reyes & Anderson
  (2023).
- TW Nor (Lynga 6) and CD Cyg (Berkeley 84) were added
  from a match of *Gaia* DR3 Cepheids with the Hunt & Reffert (2023, A&A 673,
  A114) clusters by position, proper motion and parallax.
- The field Cepheids pulsate in the fundamental mode and have BP − RP < 2.5,
  RUWE < 1.4 and a W_H magnitude from Riess et al. (2021, ApJL 908, L6). The
  long-period ones (P > 14 d) have *Gaia* DR3 parallax errors below 5 %. The
  four shorter ones were chosen evenly in log P, each with the smallest
  parallax error (below 3 %) near its period. Y Oph and XZ Car are left out
  as clear outliers. The CD Cyg W_H also comes from Riess et al. (2021).
  All W_H values from Riess et al. (2021) are shifted by −0.046 mag onto the
  Cruz Reyes & Anderson (2023) scale used for the cluster Cepheids. For the
  six Cepheids in both catalogues, the difference is 0.046 ± 0.003 mag.
- The galaxy Cepheids (period, F160W, V − I and the total error) come from
  Riess et al. (2016, ApJ 826, 56; VizieR J/ApJ/826/56). The supernova
  redshifts come from Pantheon+ (Scolnic et al. 2022; Brout et al. 2022).
  Both are built into the page, as are the standardised peak magnitudes
  `m_b_corr` of the calibrator supernovae (averaged over surveys) and the
  redshifts and magnitudes of the distant SH0ES Hubble-flow supernovae.

## Code

Everything is in `index.html`: the HTML, the CSS and the JavaScript. The only
external dependency is [Plotly.js](https://plotly.com/javascript/), loaded
from cdnjs. The TAP proxy in `proxy/` runs separately on Cloudflare.

### TAP proxy

Browsers reject the answers of the VizieR and ARI Heidelberg TAP services,
because VizieR sends its `Access-Control-Allow-Origin` header twice and ARI
sends none. `proxy/worker.js` is a Cloudflare Worker that forwards the
queries to them and returns the answers with one valid CORS header. It only
forwards the TAP `sync` and `async` endpoints and the async job resources,
and rewrites the async job redirects so that they point back to the proxy:

- `https://<worker>/vizier/sync` → `https://tapvizier.cds.unistra.fr/TAPVizieR/tap/sync`
- `https://<worker>/ari/sync` → `https://gaia.ari.uni-heidelberg.de/tap/sync`

The app uses the deployed Worker at
`https://kauguste-redel-tap.taavi-tuvikene.workers.dev` (`TAP_PROXY` in
`index.html`).

To deploy it without installing anything, create a Worker in the Cloudflare
dashboard (*Workers & Pages → Create → Start with Hello World*), open
*Edit code*, replace the code with `proxy/worker.js` and press *Deploy*.
With Node.js installed, `npx wrangler deploy` in the `proxy` folder does
the same.
