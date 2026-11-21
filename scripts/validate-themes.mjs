import fs from 'node:fs';
const cfg=JSON.parse(fs.readFileSync(new URL('../config/theme.json',import.meta.url),'utf8'));
const required=['background','surface','surfaceAlt','primary','secondary','tertiary','text','muted','border','success','warning','danger'];
const hex=/^#[0-9A-Fa-f]{6}$/;
for(const [id,t] of Object.entries(cfg.themes)){
 if(!t.label||!Array.isArray(t.gradient)||t.gradient.length!==3)throw Error(`Bad theme metadata: ${id}`);
 for(const key of required)if(!hex.test(t.colors?.[key]||''))throw Error(`${id}: invalid ${key}`);
 for(const c of t.gradient)if(!hex.test(c))throw Error(`${id}: invalid gradient ${c}`);
 if(!hex.test(t.glow||''))throw Error(`${id}: invalid glow`);
}
for(const [component,id] of Object.entries(cfg.componentThemes))if(id!=='global'&&!cfg.themes[id])throw Error(`${component} references unknown theme ${id}`);
console.log(`Validated ${Object.keys(cfg.themes).length} themes and ${Object.keys(cfg.componentThemes).length} component settings.`);
