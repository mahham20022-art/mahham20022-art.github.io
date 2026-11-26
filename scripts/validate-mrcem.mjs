// Validates the MRCEM question bank before it goes live: unique IDs, valid answer keys,
// non-empty fields, known domains, and that every file in the service-worker list exists.
import fs from "fs"; import vm from "vm"; import path from "path";
const dir = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "mrcem");
const QB = []; const ctx = { window: {}, QB };
ctx.add = (d, arr) => arr.forEach(x => {
  if (Array.isArray(x)) QB.push(x[0] === "s" ? { id: x[1], d, t: "sba", q: x[2], o: x[3], a: x[4], e: x[5], s: x[6] } : { id: x[1], d, t: "say", q: x[2], m: x[3], e: x[4] });
  else QB.push({ ...x, id: String(x.id) });
});
vm.createContext(ctx);
const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
const srcs = [...html.matchAll(/<script src="(data\/[^"]+)"><\/script>/g)].map(m => m[1]);
for (const s of srcs) vm.runInContext(fs.readFileSync(path.join(dir, s), "utf8"), ctx, { filename: s });
const DOMAINS = ["tox","law","resus","paeds","obs","trauma","cardio","med","env","neuro","psych","surg","comms"];
const errs = []; const seen = new Set();
for (const q of QB) {
  if (seen.has(q.id)) errs.push(`duplicate id ${q.id}`); seen.add(q.id);
  if (!DOMAINS.includes(q.d)) errs.push(`${q.id}: unknown domain ${q.d}`);
  if (!q.q || !q.e) errs.push(`${q.id}: missing stem or explanation`);
  if (q.t === "sba") {
    if (!Array.isArray(q.o) || q.o.length < 3) errs.push(`${q.id}: needs >=3 options`);
    else if (!(Number.isInteger(q.a) && q.a >= 0 && q.a < q.o.length)) errs.push(`${q.id}: answer key out of range`);
    if (q.o && new Set(q.o).size !== q.o.length) errs.push(`${q.id}: duplicate options`);
    if (/\b(option|answer) [A-D]\b/i.test(q.e)) errs.push(`${q.id}: explanation refers to a lettered option (options are shuffled)`);
  } else if (!q.m) errs.push(`${q.id}: Say-it card missing model answer`);
}
const sw = fs.readFileSync(path.join(dir, "sw.js"), "utf8");
for (const f of JSON.parse(sw.match(/const FILES = (\[[\s\S]*?\]);/)[1])) if (f !== "./" && !fs.existsSync(path.join(dir, f))) errs.push(`sw.js lists missing file ${f}`);
if (!ctx.window.FW || !ctx.window.FW.length) errs.push("frameworks missing");
console.log(`${QB.length} items (${QB.filter(q => q.t === "say").length} Say-it), ${ctx.window.FW ? ctx.window.FW.length : 0} frameworks`);
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
console.log("MRCEM bank valid ✓");
