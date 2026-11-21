# AnimeVerse Theme Engine

Zero-dependency Node.js generator for the `rudy0senpai/rudy0senpai` profile README.

## Quick start

- Requires Node.js 20+.
- `npm run build` generates `README.md` and themed local SVGs.
- `npm run themes` lists available palettes.
- `npm run check` verifies that generated output is current.
- `node scripts/build.mjs --theme=cyberpunk-tokyo` previews another theme by generating that palette.

## Global theme

Set `activeTheme` in `config/theme.json` to one of:
`animeverse`, `cyberpunk-tokyo`, `phantom-empress`, `sakura-dreams`, `demon-slayer`, `celestial-academy`.

Each palette defines background, surfaces, primary/secondary/tertiary accents, text, muted text, border, status colors, a gradient, and glow color.

## Per-component overrides

Set values in `componentThemes` to `global` or a theme ID. Supported components: `hero`, `quote`, `projectCards`, `skillPanels`, `stats`, `contribution`, and `footer`.

## Content

Edit `data/profile.json`. It is the structured source of truth for profile content. The generated root `README.md` should not be edited manually; it will be overwritten.

## GitHub Actions

`.github/workflows/build-profile.yml` regenerates the README and local SVGs on source changes, manual dispatch, and a daily schedule. It then generates an animated GIF contribution snake using `Platane/snk`, resolving its colors from the active contribution component theme, and commits generated files.

If workflow commits fail, check **Settings → Actions → General → Workflow permissions** and enable read/write access. The workflow requests `contents: write`.

## Rendering constraints

GitHub renders profile READMEs as GitHub Flavored Markdown with supported embedded HTML. It does not execute local JavaScript or load a custom stylesheet for README rendering. The engine therefore applies theme tokens during the build and writes them into local SVGs, generated Markdown, and badges. GitHub's page chrome/background cannot be changed by this project. Third-party stats widgets may offer only their own preset themes, so their palettes remain provider-controlled unless the provider supports custom colors.
