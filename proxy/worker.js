// Cloudflare Worker that forwards TAP queries to Gaia DR3 services whose CORS
// headers browsers reject (VizieR sends Access-Control-Allow-Origin twice; ARI,
// the ESA Gaia archive and AIP send none) and returns their answers with a
// single valid CORS header.
//
//   /vizier/sync, /vizier/async[/<job>[/phase|/error|/results/result]]
//   /ari/sync,    /ari/async[/<job>[/phase|/error|/results/result]]
//   /esa/sync,    /esa/async[/<job>[/phase|/error|/results/result]]
//   /aip/sync,    /aip/async[/<job>[/phase|/error|/results/result]]

const UPSTREAMS = {
  vizier: "https://tapvizier.cds.unistra.fr/TAPVizieR/tap",
  ari: "https://gaia.ari.uni-heidelberg.de/tap",
  esa: "https://gea.esac.esa.int/tap-server/tap",
  aip: "https://gaia.aip.de/tap",
};
// Only the TAP query endpoints and the async (UWS) job resources are forwarded.
const TAP_PATH = /^\/(sync|async(\/[\w-]+(\/(phase|error|results\/result))?)?)$/;
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function reply(status, text) {
  return new Response(text, { status, headers: { ...CORS, "Content-Type": "text/plain;charset=utf-8" } });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const m = url.pathname.match(/^\/([a-z]+)(\/.*)?$/);
    const base = m && Object.hasOwn(UPSTREAMS, m[1]) ? UPSTREAMS[m[1]] : null;
    if (!base || !TAP_PATH.test(m[2] || "")) return reply(404, "Unknown service or path");
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (request.method !== "GET" && request.method !== "POST") return reply(405, "Method not allowed");

    const init = { method: request.method, redirect: "manual", headers: {} };
    if (request.method === "POST") {
      init.body = await request.arrayBuffer();
      const type = request.headers.get("Content-Type");
      if (type) init.headers["Content-Type"] = type;
    }
    let upstream;
    try {
      upstream = await fetch(base + m[2] + url.search, init);
    } catch (e) {
      return reply(502, `Upstream request failed: ${e.message}`);
    }

    const headers = new Headers(upstream.headers);
    headers.delete("Access-Control-Allow-Origin");  // also drops VizieR's duplicates
    headers.delete("Set-Cookie");
    for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
    // Async jobs answer with a 303 to the job URL on the upstream host;
    // point it back through the proxy so the browser stays on this origin.
    const loc = headers.get("Location");
    if (loc && loc.startsWith(base)) headers.set("Location", `${url.origin}/${m[1]}${loc.slice(base.length)}`);
    return new Response(upstream.body, { status: upstream.status, statusText: upstream.statusText, headers });
  },
};
