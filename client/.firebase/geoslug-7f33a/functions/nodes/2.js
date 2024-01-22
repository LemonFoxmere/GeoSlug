import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.6EEaEmHJ.js","_app/immutable/chunks/scheduler.tGA8qe-D.js","_app/immutable/chunks/index.fefvp17n.js","_app/immutable/chunks/index.tgVM2Jmh.js"];
export const stylesheets = ["_app/immutable/assets/2.JV66_STd.css"];
export const fonts = [];
