

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.ff8nncJO.js","_app/immutable/chunks/scheduler.tGA8qe-D.js","_app/immutable/chunks/index.fefvp17n.js"];
export const stylesheets = [];
export const fonts = [];
