// Front-page map preview strip — REBUILT FROM SCRATCH.
//
// Two previous versions (a <canvas>, then an <svg>) both went
// permanently blank after certain page transitions, for a reason an
// extended, evidence-led debugging session was never able to pin down:
// every standard diagnostic tried — thrown errors, page-lifecycle
// events, even plain alert() — eventually stopped producing any signal
// at all, on a brand new repository, which ruled out caching and
// deployment as the explanation. Rather than layer a third fix on top
// of two already-mysterious failures, this starts genuinely clean.
//
// STAGE 1 (this version): deliberately minimal. Before rebuilding any
// actual map drawing, this just proves the basic pipeline — receiving
// app.js's "location ready" signal and changing something on screen
// because of it — genuinely works on the real device. Plain text
// content changes are about as simple as a web page can get; if even
// this doesn't reliably show up, the problem is somewhere more
// fundamental than anything to do with maps, canvas, or SVG at all.
// Once this is confirmed working, the real map (coastline, rain,
// places) gets built back on top of this same, confirmed-working
// foundation, one piece at a time.
//
// Deliberately NOT using alert() for any of this — Safari has a real,
// documented anti-spam feature that can silently suppress further
// dialogs from a page after enough of them appear in a short time,
// which fits some of tonight's stranger results uncomfortably well.
// Plain on-screen text can't be suppressed the same way.

const mapStripRoot = document.getElementById("mapStripRoot");

function mapStripShow(text) {
  if (!mapStripRoot) return;
  mapStripRoot.textContent = text;
}

// Runs immediately, the moment this script itself executes — before
// any event, before any data. If the strip still says "Loading map…"
// (its plain HTML default, see index.html) long after launch, this
// line never ran at all, which alone would be worth knowing.
mapStripShow("Map strip script loaded, waiting for location…");

document.addEventListener("cloude:location-ready", e => {
  const stamp = new Date().toLocaleTimeString();
  mapStripShow(`Location ready at ${stamp} — lat ${e.detail.lat.toFixed(3)}, lon ${e.detail.lon.toFixed(3)}`);
});

// The same handful of "you might have returned to this page" signals
// tried throughout tonight's debugging — kept here too, same reasoning
// as before (genuinely free, no harm in trying), but this time each
// one writes its own distinct, plain-text status rather than assuming
// any one of them is the "right" signal to build the real logic around.
window.addEventListener("pageshow", e => {
  mapStripShow(`pageshow fired (persisted=${e.persisted}) at ${new Date().toLocaleTimeString()}`);
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    mapStripShow(`visibilitychange→visible at ${new Date().toLocaleTimeString()}`);
  }
});
window.addEventListener("focus", () => {
  mapStripShow(`focus fired at ${new Date().toLocaleTimeString()}`);
});

// A global catch-all — if anything anywhere on the page throws in a
// way that matters, this writes it straight into the strip itself
// rather than it vanishing with no console to see it on.
window.addEventListener("error", e => {
  mapStripShow(`PAGE ERROR: ${e.message} (${e.filename}:${e.lineno})`);
});
window.addEventListener("unhandledrejection", e => {
  mapStripShow(`UNHANDLED REJECTION: ${e.reason && e.reason.message || e.reason}`);
});
