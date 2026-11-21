#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomInt } from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cfgPath=path.join(root,'config/theme.json');
const cfg=JSON.parse(fs.readFileSync(cfgPath,'utf8'));
const usage=`AnimeVerse Theme CLI\n\nCommands:\n  npm run theme -- list\n  npm run theme -- set <theme-id>\n  npm run theme -- random\n  npm run theme -- preview [theme-id]\n  npm run theme -- component <component> <theme-id|global>\n  npm run theme -- custom <id> <label> <primary> <secondary> <tertiary> <background>\n\nExamples:\n  npm run theme -- set neon-tokyo\n  npm run theme -- random\n  npm run theme -- preview limitless-infinity\n  npm run theme -- component hero sakura-dreams\n  npm run theme -- custom my-theme \"My Theme\" #ff77aa #8b7cff #65d9ee #111126\n`;
const [cmd,...args]=process.argv.slice(2);
const write=()=>fs.writeFileSync(cfgPath,JSON.stringify(cfg,null,2)+'\n');
const ids=Object.keys(cfg.themes);
const hex=/^#[0-9a-fA-F]{6}$/;
const print=t=>console.log(`${t.label}\n${t.gradient.map(c=>`  ${c}`).join('\n')}\n  background ${t.colors.background}\n  surface    ${t.colors.surface}\n  border     ${t.colors.border}`);
if(!cmd||cmd==='help'||cmd==='--help'){console.log(usage);process.exit(0);}
if(cmd==='list'){for(const [id,t] of Object.entries(cfg.themes))console.log(`${id.padEnd(24)} ${t.label}`);process.exit(0);}
if(cmd==='set'){
 const id=args[0];if(!cfg.themes[id])throw Error(`Unknown theme: ${id}. Run npm run theme -- list.`);
 cfg.activeTheme=id;write();console.log(`Active theme set to ${id}. Run npm run build to regenerate the profile.`);process.exit(0);
}
if(cmd==='random'){
 const id=ids[randomInt(ids.length)];cfg.activeTheme=id;write();console.log(`Random theme selected: ${id} (${cfg.themes[id].label}). Run npm run build.`);process.exit(0);
}
if(cmd==='preview'){
 const id=args[0]||cfg.activeTheme;if(!cfg.themes[id])throw Error(`Unknown theme: ${id}`);print(cfg.themes[id]);
 console.log(`\nPreview files: npm run build -- --theme=${id} (writes the preview palette into generated assets).`);process.exit(0);
}
if(cmd==='component'){
 const [component,id]=args;if(!component||!id)throw Error('Usage: theme component <component> <theme-id|global>');
 const valid=['hero','quote','projectCards','skillPanels','stats','contribution','footer','preview','techInventory','animeUniverse'];
 if(!valid.includes(component))throw Error(`Unsupported component. Choose: ${valid.join(', ')}`);
 if(id!=='global'&&!cfg.themes[id])throw Error(`Unknown theme: ${id}`);
 cfg.componentThemes[component]=id;write();console.log(`${component} now uses ${id}. Run npm run build.`);process.exit(0);
}
if(cmd==='custom'){
 const [id,label,primary,secondary,tertiary,background]=args;
 if(!id||!label||![primary,secondary,tertiary,background].every(x=>hex.test(x||'')))throw Error('Usage: theme custom <id> <label> <primary> <secondary> <tertiary> <background>; colors must be #RRGGBB.');
 if(!/^[a-z0-9][a-z0-9-]*$/.test(id))throw Error('Theme id must use lowercase letters, digits and hyphens.');
 const lower=background;
 cfg.themes[id]={label,gradient:[primary,secondary,tertiary],glow:primary,colors:{background:lower,surface:mix(lower,'#ffffff',0.09),surfaceAlt:mix(lower,'#ffffff',0.15),primary,secondary,tertiary,text:'#F5F5F7',muted:'#B8BBC5',border:mix(lower,'#ffffff',0.32),success:'#8CE6B0',warning:'#FFD580',danger:'#FF7B91'}};
 cfg.activeTheme=id;write();console.log(`Custom theme ${id} created and activated. Run npm run build.`);process.exit(0);
}
throw Error(`Unknown command: ${cmd}\n${usage}`);
function mix(a,b,ratio){const aa=a.match(/[0-9a-f]{2}/gi).map(x=>parseInt(x,16)),bb=b.match(/[0-9a-f]{2}/gi).map(x=>parseInt(x,16));return '#'+aa.map((v,i)=>Math.round(v*(1-ratio)+bb[i]*ratio).toString(16).padStart(2,'0')).join('').toUpperCase();}
