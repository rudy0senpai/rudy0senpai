
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const cfg=read("config/theme.json"), p=read("data/profile.json"), args=process.argv.slice(2);
if(args.includes("--list-themes")){for(const [id,t] of Object.entries(cfg.themes))console.log(`${id}: ${t.label}`);process.exit(0);}
const chosen=args.find(x=>x.startsWith("--theme="))?.split("=")[1]||cfg.activeTheme;
if(!cfg.themes[chosen])throw Error(`Unknown theme ${chosen}. Use npm run themes.`);
const themeFor=id=>{const key=cfg.componentThemes?.[id];return key&&key!=="global"?cfg.themes[key]:cfg.themes[chosen];};
const esc=s=>String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const gradient=colors=>colors.map((v,i)=>`<stop offset="${i*50}%" stop-color="${v}"/>`).join("");
const mkdir=p=>fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});
const write=(p,s)=>{mkdir(p);fs.writeFileSync(path.join(root,p),s);};
function panel(title,subtitle,t,id="panel",height=240,extra=""){
 const c=t.colors;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${height}" viewBox="0 0 1000 ${height}" role="img" aria-labelledby="${id}-title"><title id="${id}-title">${esc(title)}</title><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">${gradient(t.gradient)}</linearGradient></defs><rect width="1000" height="${height}" rx="26" fill="${c.background}"/><rect x="2" y="2" width="996" height="${height-4}" rx="24" fill="none" stroke="${c.border}" stroke-width="2"/><circle cx="930" cy="28" r="110" fill="${t.glow}" opacity=".09"/><rect x="34" y="32" width="7" height="${height-64}" rx="4" fill="url(#g)"/><text x="66" y="88" fill="${c.text}" font-family="Arial,sans-serif" font-size="36" font-weight="700">${esc(title)}</text><text x="66" y="128" fill="${c.muted}" font-family="Arial,sans-serif" font-size="17">${esc(subtitle)}</text>${extra}<text x="965" y="${height-22}" text-anchor="end" fill="${c.muted}" opacity=".7" font-family="Arial" font-size="10" letter-spacing="2">RUDY0SENPAI • ANIMEVERSE</text></svg>`;
}
function card(x,t,project){
 const c=t.colors, tags=project.stack.map((s,i)=>`<rect x="${28+i*130}" y="165" width="116" height="29" rx="14" fill="${c.surfaceAlt}" stroke="${c.border}"/><text x="${86+i*130}" y="184" fill="${c.text}" font-size="12" text-anchor="middle" font-family="Arial">${esc(s)}</text>`).join("");
 return `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="218" viewBox="0 0 520 218"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">${gradient(t.gradient)}</linearGradient></defs><rect width="520" height="218" rx="20" fill="${c.surface}"/><rect x="1" y="1" width="518" height="216" rx="19" fill="none" stroke="${c.border}"/><rect width="7" height="218" rx="4" fill="url(#g)"/><text x="28" y="40" fill="${c.primary}" font-family="Arial" font-size="13" font-weight="bold">${esc(project.emoji)} PROJECT QUEST</text><text x="28" y="77" fill="${c.text}" font-family="Arial" font-size="18" font-weight="bold">${esc(project.name.length>43?project.name.slice(0,40)+"…":project.name)}</text><foreignObject x="28" y="91" width="465" height="58"><div xmlns="http://www.w3.org/1999/xhtml" style="font:13px Arial;line-height:1.4;color:${c.muted}">${esc(project.description)}</div></foreignObject>${tags}<text x="490" y="207" text-anchor="end" fill="${c.muted}" font-family="Arial" font-size="9">ANIMEVERSE / QUEST LOG</text></svg>`;
}
const hero=themeFor("hero"),quote=themeFor("quote"),footer=themeFor("footer"),projects=themeFor("projectCards");
write("assets/generated/hero.svg",panel("WELCOME TO THE ANIME MULTIVERSE","ルディ先輩  •  RUDY0SENPAI  •  AI & DATA SCIENCE ENGINEER",hero,"hero",290,`<text x="66" y="194" fill="${hero.colors.primary}" font-family="Arial" font-size="21" font-weight="bold">Curiosity is my cheat skill. Code is my magic.</text><text x="66" y="230" fill="${hero.colors.muted}" font-family="Arial" font-size="15">India 🇮🇳  •  Building intelligence, tools and digital worlds</text>`));
write("assets/generated/quote.svg",panel("A PROTAGONIST'S CREED",`“${p.quote}”`,quote,"quote",205,`<text x="66" y="166" fill="${quote.colors.primary}" font-family="Arial" font-size="15">— ${esc(p.alias)}</text>`));
write("assets/generated/footer.svg",panel("UNTIL THE NEXT EPISODE…",p.closing[0]+"  /  "+p.closing[1],footer,"footer",190,`<text x="66" y="151" fill="${footer.colors.primary}" font-family="Arial" font-size="14">⭐ Leave a star if you enjoyed exploring my universe.</text>`));

function listPanel(title, subtitle, items, t, id, columns=1) {
 const c=t.colors, rows=Math.ceil(items.length/columns), height=Math.max(220,150+rows*34);
 const body=items.map((item,i)=>{
   const col=i%columns,row=Math.floor(i/columns),x=66+col*(900/columns),y=164+row*32;
   return `<circle cx="${x}" cy="${y-5}" r="4" fill="${t.gradient[i%t.gradient.length]}"/><text x="${x+14}" y="${y}" fill="${c.text}" font-family="Arial" font-size="15">${esc(item)}</text>`;
 }).join("");
 return panel(title,subtitle,t,id,height,body);
}
write("assets/generated/tech-inventory.svg",listPanel("TECH INVENTORY","Tools and technologies in my current arsenal",p.tech,themeFor("skillPanels"),"tech",3));
write("assets/generated/skill-matrix.svg",listPanel("SKILLS IN TRAINING","The disciplines powering the current training arc",p.skills.map(([a,b])=>`${a} — ${b}`),themeFor("skillPanels"),"skills",2));
write("assets/generated/ai-arsenal.svg",listPanel("GREAT SAGE • AI ARSENAL","A collection of AI tools and their unique abilities",p.ai.map(([a,b])=>`${a} — ${b}`),themeFor("skillPanels"),"ai",1));
write("assets/generated/stats-banner.svg",panel("POWER LEVEL • GITHUB STATS","Repository activity, languages, milestones and achievements",themeFor("stats"),"stats",175));
for(const project of p.projects)write(`assets/generated/projects/${project.id}.svg`,card(null,projects,project));
const badge=(label,value,color)=>`<img src="https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(value)}-${color.replace("#","")}?style=for-the-badge" alt="${esc(label)} ${esc(value)}"/>`;
const center=s=>`<p align="center">\n${s}\n</p>`;
const techRows=[];for(let i=0;i<p.tech.length;i+=6)techRows.push(`<tr>${p.tech.slice(i,i+6).map(x=>`<td align="center"><code>${esc(x)}</code></td>`).join("")}</tr>`);
const skillRows=p.skills.map(([a,b])=>`| ${a} | ${b} |`).join("\n");
const projectSections=p.projects.map(x=>`${center(`<img src="./assets/generated/projects/${x.id}.svg" alt="${esc(x.name)}" width="100%"/>`)}\n${x.description}\n\n**Special abilities:** ${x.abilities}\n\n\`${x.stack.join("` · `")}\`${x.url?`\n\n[Open repository ↗](${x.url})`:""}`).join("\n\n---\n\n");
const anime=p.anime.map(([e,title,desc,q])=>`<details><summary>${e} <b>${esc(title)}</b></summary>\n\n${desc}${q?`\n\n*“${q}”*`:""}\n\n</details>`).join("\n\n");
const pokemonRows=[];for(let i=0;i<p.pokemon.length;i+=3)pokemonRows.push(`<tr>${p.pokemon.slice(i,i+3).map(([id,n,s])=>`<td align="center"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" width="76" alt="${esc(n)}"/><br/><b>${n}</b><br/>${s}</td>`).join("")}</tr>`);
const isekaiRows=[];for(let i=0;i<p.isekai.length;i+=3)isekaiRows.push(`<tr>${p.isekai.slice(i,i+3).map(([file,n,s])=>`<td align="center"><img src="./assets/isekai_quartet/${file}.png" width="82" alt="${esc(n)}"/><br/><b>${n}</b><br/>${s}</td>`).join("")}</tr>`);
const aiRows=p.ai.map(([n,s])=>`| ${n} | ${s} |`).join("\n");
const apothecary=p.apothecary.map(([file,n,s])=>`<td align="center"><img src="./assets/Apothecary_dairy/${file}.png" width="88" alt="${esc(n)}"/><br/><b>${n}</b><br/>${s}</td>`).join("");
const stat=(url,alt)=>`<img src="${url}" alt="${alt}" width="100%"/>`;
const s=p.stats;
const md=`<!-- GENERATED FILE: edit data/profile.json and config/theme.json, then run npm run build. -->
${center(`<img src="./assets/generated/hero.svg" alt="AnimeVerse profile banner" width="100%"/>`)}
${center(`<img src="${p.avatar}" alt="${esc(p.alias)} avatar" width="150"/>`)}
${center(`<b>${p.name}</b> · <a href="${p.github}">@${p.username}</a>`)}
${center(p.intro.map(x=>`<code>${esc(x)}</code>`).join(" &nbsp; "))}
${center(p.status.map(([a,b],i)=>badge(a,b,[hero.colors.primary,hero.colors.secondary,hero.colors.tertiary,hero.colors.warning][i])).join(" "))}
${center(`<a href="${p.github}">GitHub</a> · <a href="${p.linkedin}">LinkedIn</a>`)}
${center(`<img src="./assets/generated/quote.svg" alt="AnimeVerse quote" width="100%"/>`)}

## 🧬 Character dossier

<details open><summary><b>Protagonist profile</b></summary>

\`\`\`javascript
const protagonist = {
  name: "${p.name}",
  alias: "${p.alias}",
  class: "${p.characterClass}",
  origin: "${p.origin}",
  abilities: ${JSON.stringify(p.abilities, null, 2).replaceAll("\n","\n  ")},
  currentArc: "${p.currentArc}",
  dream: "${p.dream}"
};
\`\`\`
</details>

## 🏴‍☠️ The Grand Line — Tech inventory

${center(`<img src="./assets/generated/tech-inventory.svg" alt="Themed technology inventory" width="100%"/>`)}

<table>${techRows.join("")}</table>

## 🧪 Dr. Stone's laboratory — Skills in training

| Field | Technologies |
|:--|:--|
${skillRows}

## 🌍 Multiverse saga — Project quests

*Every world has a story. Every project has a purpose.*

${projectSections}

## ⚔️ Anime universes I call home

${anime}

## ⚡ Pokémon — Developer party

<p align="center"><i>Each Pokémon represents a different ability in my arsenal.</i></p>
<table align="center">${pokemonRows.join("")}</table>
<p align="center"><b>Gotta catch bugs… I mean, Pokémon!</b></p>

## 🎭 Isekai Quartet — The chaotic crossover

<p align="center"><i>When protagonists from different worlds get summoned into one classroom, chaos is inevitable.</i></p>
<table align="center">${isekaiRows.join("")}</table>

### Classroom survival guide

| Situation | Expected outcome |
|:--|:--|
${p.isekaiSituations.map(([a,b])=>`| ${a} | ${b} |`).join("\n")}

<details><summary>More classroom chaos</summary>

<p align="center"><img src="https://media.tenor.com/2xJz7X9K3VAAAAAC/megumin-explosion.gif" width="220" alt="Megumin explosion"/></p>

**「 This classroom is more dangerous than any final boss. 」**

</details>

## 🌪️ That Time I Got Reincarnated as a Slime — Great Sage

<p align="center"><img src="https://media.giphy.com/media/du1LfdlnhdTwn8OQHu/giphy.gif" width="150" alt="Rimuru Tempest"/></p>

> “Analysis complete. The optimal solution has been determined.”

| AI entity | Unique ability |
|:--|:--|
${aiRows}

<details><summary>✨ Evolution: Great Sage → Raphael</summary>

\`\`\`text
       GREAT SAGE
           │
           ▼
 Artificial Intelligence
           │
           ▼
       R A P H A E L
           │
           ▼
 Lord of Developer Skills
\`\`\`

*The goal: build an intelligent AI companion capable of understanding, creating, and evolving alongside me.*

</details>

## 🧋 The Apothecary Diaries — Investigation division

<p align="center"><i>Poison, medicine, mysteries, and one extremely curious apothecary.</i></p>
<table align="center"><tr>${apothecary}</tr></table>

### Maomao's investigation protocol

\`\`\`text
01  Examine the evidence
02  Identify unusual patterns
03  Test the hypothesis
04  Analyze the substance
05  Reveal the truth
\`\`\`

\`\`\`python
def investigate_bug(error):
    evidence = collect_logs(error)
    hypothesis = analyze(evidence)
    if hypothesis.is_confirmed():
        return resolve_issue(hypothesis)
    return "Interesting... further investigation required."
\`\`\`

*Every bug is a mystery. Every error log is evidence.*

## 📊 Power level — GitHub statistics

<table><tr><td>${stat(s.general,"GitHub general statistics")}</td><td>${stat(s.top,"Top repositories")}</td></tr><tr><td>${stat(s.rank,"Developer rank")}</td><td>${stat(s.languages,"Most used languages")}</td></tr><tr><td colspan="2">${stat(s.trophies,"GitHub trophies")}</td></tr></table>

## 🐍 The contribution dragon

${center(`<picture><source srcset="./assets/generated/contribution-snake.gif" type="image/gif"/><img src="./assets/generated/contribution-snake.svg" alt="GitHub contribution snake" width="100%"/></picture>`)}

## 😂 Anime developer memes

${center(`<img src="${p.memes.image}" width="300" alt="Anime developer reaction"/>`)}

**Me:** I'll just fix one tiny bug before sleeping.

**Also me, 4 hours later:**

\`\`\`text
The bug was not the problem. The bug was the friends we made along the way.
\`\`\`

<details><summary>💀 My developer life in five stages</summary>

${p.memes.stages.map((x,i)=>`${i+1}. ${["😎","🤓","🤔","🤡","🗿"][i]} “${x}”`).join("\n")}

</details>

## 🎵 Current arc soundtrack

${center(badge("OPENING",p.soundtrack[0],hero.colors.primary)+" "+badge("ENDING",p.soundtrack[1],hero.colors.secondary))}
**Current mood:** ${p.soundtrack[2]}

## 🌐 The guild — Connect with me

${center(`<a href="${p.github}">${badge("GITHUB","Join the guild","181717")}</a> &nbsp; <a href="${p.linkedin}">${badge("LINKEDIN","Professional alliance","0A66C2")}</a>`)}
${center("Collaborations · Open Source · AI · Game Development · Anime Discussions")}
${center(`<img src="./assets/macani.png" width="220" alt="MacAni Linux identity"/>`)}
${center(`<img src="./assets/generated/footer.svg" width="100%" alt="AnimeVerse closing banner"/>`)}
${center(`<b>${p.closing[1]}</b>`)}
${center(`<i>${p.closing[2]}</i>`)}

---

<sub>Theme: **${cfg.themes[chosen].label}** · Generated locally by [AnimeVerse Theme Engine](./docs/THEMING.md).</sub>
`;
const readme=path.join(root,"README.md");
if(args.includes("--check")){if(!fs.existsSync(readme)||fs.readFileSync(readme,"utf8")!==md){console.error("README.md is out of date. Run npm run build.");process.exit(1);}console.log("README.md is up to date.");process.exit(0);}
write("README.md",md);
console.log(`Built README.md and themed SVG assets with ${chosen}.`);
