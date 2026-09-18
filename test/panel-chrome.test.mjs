import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The host-owned panel chrome contract: the same rules the marketplace
// repository enforces for every panel plugin, kept here so this repository is
// self-contained after the extraction.
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const renderer = join(root, "renderer");
const manifest = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));

test("the panel documents the host-owned 46px chrome contract", () => {
  assert.equal(manifest.ui?.panel, "renderer/index.html");

  const panelHtml = readFileSync(join(root, manifest.ui.panel), "utf8");
  assert.match(panelHtml, /<meta\s+name="pi-plugin-chrome"\s+content="v3"\s*\/>/);
  assert.match(
    panelHtml,
    /PI-Desktop owns exactly (?:a transparent 46px drag band|a 46px drag band)/,
  );
  assert.match(panelHtml, /three-button[\s\S]*window-control capsule/);
  assert.match(panelHtml, /var\(--pi-plugin-titlebar-height, 46px\)/);
});

test("the panel reserves the window-control capsule and retints with the host", () => {
  const panel = readFileSync(join(renderer, "index.html"), "utf8");
  const polish = readFileSync(join(renderer, "panel-polish.css"), "utf8");
  const retint = readFileSync(join(renderer, "capsule-retint.js"), "utf8");

  assert.match(panel, /capsule-retint\.js/);
  assert.match(polish, /\.titlebar\s*\{\s*padding-right:\s*116px\s*!important/);
  assert.match(retint, /--pi-plugin-panel-page-background/);
  assert.match(retint, /MutationObserver/);
});
