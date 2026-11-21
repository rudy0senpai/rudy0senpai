
const fs = require("node:fs");
const path = require("node:path");

const config = JSON.parse(
  fs.readFileSync("config/theme.json", "utf8")
);

function resolveComponent(componentName) {
  const component = config.components?.[componentName] || {};

  const requestedTheme = component.theme || "default";

  const themeName =
    requestedTheme === "default"
      ? config.default_theme
      : requestedTheme;

  const palette = config.themes[themeName];

  if (!palette) {
    throw new Error(
      `Unknown theme "${themeName}" for ${componentName}`
    );
  }

  return {
    themeName,
    ...palette,
    ...component.overrides
  };
}

function cleanHex(value) {
  return value.replace(/^#/, "");
}

function buildGradient(colors) {
  const positions = [0, 50, 100];

  return colors
    .map((color, index) =>
      `${positions[index]}:${cleanHex(color)}`
    )
    .join(",");
}

// Resolve each component independently.
const quote = resolveComponent("quote");
const typing = resolveComponent("typing");
const badges = resolveComponent("badges");
const stats = resolveComponent("github_stats");
const languages = resolveComponent("top_languages");
const trophies = resolveComponent("trophies");
const footer = resolveComponent("footer");

// Tokens used inside README.template.md.
const tokens = {
  "{{QUOTE_THEME}}": quote.themeName,
  "{{TYPING_COLOR}}": cleanHex(typing.accent),
  "{{BADGE_ACCENT}}": cleanHex(badges.accent),
  "{{STATS_THEME}}": stats.github_theme,
  "{{LANGUAGES_THEME}}": languages.github_theme,
  "{{TROPHIES_THEME}}": trophies.github_theme,
  "{{FOOTER_GRADIENT}}": buildGradient(footer.gradient)
};

const templatePath = path.join(
  process.cwd(),
  "README.template.md"
);

const outputPath = path.join(
  process.cwd(),
  "README.md"
);

let readme = fs.readFileSync(templatePath, "utf8");

for (const [token, value] of Object.entries(tokens)) {
  readme = readme.replaceAll(token, value);
}

// Prevent accidentally publishing unresolved tokens.
const unresolved = readme.match(/\{\{[A-Z0-9_]+\}\}/g);

if (unresolved) {
  throw new Error(
    `Unresolved README tokens: ${unresolved.join(", ")}`
  );
}

fs.writeFileSync(outputPath, readme, "utf8");

console.log(
  `README generated successfully using ${config.default_theme}`
);