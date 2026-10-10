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

The page opens on the introduction and a table of contents. Clicking a part
or one of its tabs there shows that part on its own, filling the window, so
the page does not scroll. Above each part's title are links to the table of
contents and to the other parts, and below the title are its tabs. The
address keeps the part or tab (`#osa-2`, `#plots`), so the browser's back
button and reloading work.

1. Enter a cluster name (e.g. `M67`, `Pleiades`, `NGC 2516`) or coordinates
   in the left box, or decimal-degree coordinates (`132.85 11.81`) in the
   right box. Set the search radius and the G magnitude limit, then press
   **Päri Gaiast**. A name is resolved when the query runs, and its
   coordinates appear in the right box. The example buttons fill in suitable
   values for a few well-known clusters. A query runs only when you press
   the button (or Enter).
   Part 1 is split into five tabs under its title: **Sissejuhatus** (the
   steps below), **Päring** (the query), **Tabel** (the queried stars),
   **Joonised** (the four plots on a 2 × 2 grid) and **Kaugus** (the mean
   parallax and the distance). Each tab is about one window high, so the
   four plots fit on the screen together.
2. Check the queried stars on the **Tabel** tab. It shows as many rows per
   page as fit the window, at least 10.
3. On the **Joonised** tab, use the lasso on the proper-motion plot to mark
   the dense clump of stars that move together. Each lasso adds stars to the
   selection, and **Tühista valik** clears it. The selected stars are
   highlighted in the sky view, the colour–magnitude diagram and the table.
   **selgitus** after a plot title opens its explanation. **Suurenda**
   enlarges a plot to the full window, with the explanation shown; **Sulge**
   or Esc closes it.
4. Optionally refine the selection in the colour–magnitude diagram: clicking
   a selected star removes it, clicking a removed star puts it back, and
   **Taasta valik** brings all removed stars back. Any change to the lasso selection discards these removals.
5. On the **Kaugus** tab, read the mean parallax, press **Arvuta kaugus** and
   read the number of selected stars and the distance in parsecs, light
   years, astronomical units and kilometres. The parallax histogram marks the
   mean parallax. You can download the selected stars as a CSV file.

### Cepheids

The second part of the page has four tabs: **Sissejuhatus** (the steps),
**Parvede tsefeiidid** (the cluster Cepheids), **Väljatsefeiidid** (the field
Cepheids) and **Periood-heledus** (the period-luminosity plot and the fit).

The **Parvede tsefeiidid** tab lists 11 classical Cepheids in 11 open clusters, all with *HST* Wesenheit magnitudes W_H.
**Mõõda** switches to the **Päring** tab and fills in the query form for a
cluster, but you still start the query yourself. After selecting the cluster
members, press **Salvesta parve … kaugus** below the distance tiles on the
**Kaugus** tab to store the mean cluster parallax. Each stored
cluster adds its Cepheids to the period-luminosity plot. With two or more
Cepheids, the app fits a weighted straight line. Stored distances are kept in
the browser (`localStorage`) and can be removed with **Kustuta**. The
**Kustuta kõik salvestatud andmed** button at the bottom of the page clears
everything the app has stored, after a confirmation.

Few Cepheids with periods above 10 days sit in nearby clusters. The
**Väljatsefeiidid** tab therefore lists 12 field Cepheids that are not in clusters: 8 with long
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

The third part has three tabs: **Sissejuhatus** (the steps), **Galaktikad**
(the choice of relation and the galaxy table, with as many rows per page as
fit the window) and **Hubble'i seadus** (the velocity–distance plot and H₀).

It uses 29 type Ia supernova host galaxies with Cepheids
observed by *HST*. It stays hidden until you have fitted your own W_H
period-luminosity relation in the second part, which takes at least two
stored cluster Cepheids. Choose a relation in the menu next to **Kasuta
seost** and press the button:
- the relation fitted in the second part;
- or the published relation, for comparison.

Only then are the galaxy distances, the Hubble diagram and H₀ derived, from
each galaxy's Cepheids with the applied relation. Changing the menu takes
effect when the button is pressed again.

Clicking a galaxy shows its Cepheids with the shifted relation. The
velocity–distance plot shows a straight line through the origin fitted by
least squares, and its slope gives the Hubble constant H₀ and the Hubble
time 1/H₀. Galaxies can be left out of the fit with the checkboxes.

### Type Ia supernovae

The fourth part has three tabs like the third: **Sissejuhatus** (the
steps), **Supernoovad** (the choice of luminosity and the paged supernova
table) and **Hubble'i seadus** (the velocity–distance plot of the distant
supernovae, with H₀ to the right of it). In both parts the H₀ and Hubble time
tiles and the explanation sit in a column to the right of the plot.

Its content appears once a relation has been applied in the third part. At
first it lists only the supernova peak magnitudes. Choose the supernova
luminosity in the menu next to **Kasuta heledust** and press the button:
- your own M_B, the mean over the galaxies of the third part;
- or the SH0ES value, M_B = −19.253 ± 0.027 (Riess et al. 2022).

The button takes over the galaxy distances from the third part, derives
M_B for each galaxy and shows the Hubble diagram of the distant supernovae
with the applied luminosity. From then on it follows changes in the third
part. Changing the menu takes effect when the button is pressed again. Each
Cepheid galaxy hosted a type Ia supernova. Its absolute peak magnitude is `M_B = m_B − μ`, with μ
from the third part. The mean over the galaxies selected there gives the
supernova luminosity. This is then applied to 166 distant supernovae
(0.023 < z < 0.06, up to about 250 Mpc). Their velocity–distance plot gives
H₀, which is compared with the third part and with Planck (67.4 km/s/Mpc).

Velocities are `v = cz (1 + 0.775 z)`. The small factor corrects for the
expansion of the Universe while the light travelled, with deceleration
parameter q₀ = −0.55 as in SH0ES. Without it, H₀ comes out about 3 % low.

### Parallax demonstration

`parallaks.html`, linked from the introduction, shows the parallax method with
an interactive schematic. The left view shows the Sun, the Earth's orbit, the
star and a plane of distant quasars in 3D; the line from the Earth through the
star meets the quasar plane at a point that traces an ellipse during the year.
Drag the view to turn it, or pick a preset view: oblique (the default),
from behind the Sun along the line of sight, from the side, or from above the
ecliptic north pole. The right view shows the same path on the sky. A
time slider (0–3 years) and a play button move the Earth. Sliders set the star's
distance and ecliptic latitude, and an optional proper motion with adjustable
speed and direction turns the ellipse into loops. With **Näita parallaksinurka**
on, the parallax angle is marked as a wedge at the star in the 3D view and as
the semi-major axis of the ellipse in the sky view; a readout gives the angle
in the drawing, arcsin(1/d), and for a real star as many parsecs away. The drawing is not to scale.

## Method

- Only stars with RUWE < 1.4 and with a measured parallax and proper motion
  are queried.
- The distance is `d = 1000 / ⟨p⟩` pc, where `⟨p⟩` is the inverse-variance
  weighted mean parallax in mas. The parallaxes are averaged before inverting,
  because the mean of 1/p is biased.
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
  Cepheids. The absolute magnitude is `M_H^W = W_H + 5 log10(p / mas) − 10`.
  Here p is the stored cluster parallax, or for a field Cepheid its own
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
service. **Automaatne**, the default, starts with GAVO for fields up to 1.5°
(fast synchronous queries) and with VizieR for larger fields (asynchronous
jobs). It then falls back to the others: GAVO or VizieR, ARI Heidelberg, the
ESA Gaia archive and AIP Potsdam. Choosing one
service uses only that one. The choice is remembered in the browser.

- *Gaia* DR3 data come from the
  [GAVO Data Center](https://dc.g-vo.org/tableinfo/gaia.dr3lite) for small
  fields and from VizieR
  [I/355/gaiadr3](https://vizier.cds.unistra.fr/viz-bin/VizieR?-source=I/355/gaiadr3)
  for large ones. The other fallbacks, in this order, are the
  [ARI Heidelberg](https://gaia.ari.uni-heidelberg.de/) Gaia archive, the
  [ESA Gaia archive](https://gea.esac.esa.int/archive/) and
  [AIP Potsdam](https://gaia.aip.de/). GAVO is queried directly; the others
  are reached through the [TAP proxy](#tap-proxy). Fields larger than 1.5°
  are queried as asynchronous jobs, with two exceptions:
  - ESA is always queried synchronously, because its queue for anonymous
    async jobs is too slow.
  - AIP is always queried through async jobs. Its sync endpoint answers
    only in VOTable, while its async jobs return CSV with
    `RESPONSEFORMAT=csv`.

  Results are capped at 150 000 rows.
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
- The galaxy Cepheids (period, F160W, V − I and the total error) are the
  2,043 Cepheids in the 29 supernova hosts of SH0ES (Riess et al. 2022, ApJL
  934, L7) that have at least 20 Cepheids each. The eight hosts with fewer
  are left out: NGC 4424, NGC 3021, NGC 5917, NGC 1015, NGC 4680, Mrk 1337,
  NGC 7678 and NGC 105. They come from table 2 of the
  [Pantheon+/SH0ES data release](https://github.com/PantheonPlusSH0ES/DataRelease/tree/main/SH0ES_Data).
  The anchors (LMC, SMC, M31 and NGC 4258) are left out. As the release
  notes, the table errors leave out the correlations used in the full SH0ES
  fit.
- The supernova redshifts come from Pantheon+ (Scolnic et al. 2022; Brout
  et al. 2022), as do the standardised peak magnitudes `m_b_corr`, averaged
  over surveys. For the four hosts with two or three supernovae (NGC 5643,
  NGC 1448, NGC 3147, NGC 5468), the redshifts and peak magnitudes are
  averaged per host. These, and the redshifts and magnitudes of the distant
  SH0ES Hubble-flow supernovae, are built into the page.

## Code

Everything is in `index.html`: the HTML, the CSS and the JavaScript. The
parallax demonstration is a separate self-contained page, `parallaks.html`,
with no external dependencies. The only
external dependency is [Plotly.js](https://plotly.com/javascript/), loaded
from cdnjs. The TAP proxy in `proxy/` runs separately on Cloudflare.

### TAP proxy

Browsers reject the answers of the VizieR, ARI Heidelberg, ESA Gaia archive
and AIP TAP services, because VizieR sends its `Access-Control-Allow-Origin`
header twice and the others send none. `proxy/worker.js` is a Cloudflare Worker that forwards the
queries to them and returns the answers with one valid CORS header. It only
forwards the TAP `sync` and `async` endpoints and the async job resources,
and rewrites the async job redirects so that they point back to the proxy:

- `https://<worker>/vizier/sync` → `https://tapvizier.cds.unistra.fr/TAPVizieR/tap/sync`
- `https://<worker>/ari/sync` → `https://gaia.ari.uni-heidelberg.de/tap/sync`
- `https://<worker>/esa/sync` → `https://gea.esac.esa.int/tap-server/tap/sync`
- `https://<worker>/aip/async` → `https://gaia.aip.de/tap/async`

The app uses the deployed Worker at
`https://kauguste-redel-tap.taavi-tuvikene.workers.dev` (`TAP_PROXY` in
`index.html`).

To deploy it without installing anything, create a Worker in the Cloudflare
dashboard (*Workers & Pages → Create → Start with Hello World*), open
*Edit code*, replace the code with `proxy/worker.js` and press *Deploy*.
With Node.js installed, `npx wrangler deploy` in the `proxy` folder does
the same.
