# AnimeVerse Theme Engine v2.0

Zero-dependency Node.js theme engine for the `rudy0senpai/rudy0senpai` GitHub profile. It retains the existing README generator, profile data, SVG assets, stats blocks, and contribution-snake workflow.

## Theme collection

There are **26 themes**: the original six plus 20 additions.

`animeverse`, `cyberpunk-tokyo`, `phantom-empress`, `sakura-dreams`, `demon-slayer`, `celestial-academy`, `limitless-infinity`, `king-of-curses`, `eternal-journey`, `sun-god-nika`, `bankai-eclipse`, `nine-tails-chakra`, `violet-elegance`, `control-devil`, `stellar-marionette`, `wings-of-freedom`, `water-breathing`, `future-gadget-lab`, `nebula-noir`, `mecha-frontier`, `pixel-arcade`, `aurora-borealis`, `desert-dusk`, `frostbyte`, `samurai-steel`, `neon-tokyo`.

## Quick start

Requires Node.js 20+. From the repository root:

```bash
npm install
npm run theme -- list
npm run theme -- preview limitless-infinity
npm run theme -- set neon-tokyo
npm run build
npm run check
```

## Interactive preview

Open `preview/index.html` directly in a browser, or serve the repository folder with a static server. The gallery includes search, visual-style filters, palette swatches and random preview. It does not mutate your config; use the activation command shown in the preview status.

## Random theme

```bash
npm run theme -- random
npm run build
```

This chooses a random registered theme, writes it as `activeTheme`, and keeps component overrides intact.

## Create a custom theme

```bash
npm run theme -- custom my-theme "My Theme" #ff77aa #8b7cff #65d9ee #111126
npm run build
```

This creates a palette using your three accents and background, derives surface and border colors, and activates it. For full control, edit all tokens under `themes.my-theme.colors` in `config/theme.json`.

## Per-component themes

Set any supported component to `global` (inherits `activeTheme`) or a concrete theme ID. Components: `hero`, `quote`, `projectCards`, `skillPanels`, `stats`, `contribution`, and `footer`. Example:

```bash
npm run theme -- component hero limitless-infinity
npm run theme -- component projectCards neon-tokyo
npm run theme -- component footer global
npm run build
```

## CLI reference

- `npm run theme -- list`
- `npm run theme -- set <theme-id>`
- `npm run theme -- random`
- `npm run theme -- preview [theme-id]`
- `npm run theme -- component <component> <theme-id|global>`
- `npm run theme -- custom <id> <label> <primary> <secondary> <tertiary> <background>`

## GitHub README rendering

GitHub profile READMEs do not execute JavaScript or load a custom CSS stylesheet. The engine therefore generates theme tokens into SVG assets and Markdown at build time. GitHub's page chrome/background is outside the scope of a README. Stats-card providers control their own rendering parameters.

## Source of truth and preservation

`data/profile.json` remains the profile content source. `config/theme.json` holds the active theme, 26 palettes and component overrides. `scripts/build.mjs` remains the README/SVG renderer. The README content and project sections are not re-authored by this theme expansion.
