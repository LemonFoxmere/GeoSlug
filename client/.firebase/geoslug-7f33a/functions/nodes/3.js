

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/signin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.FiVgebbj.js","_app/immutable/chunks/scheduler.tGA8qe-D.js","_app/immutable/chunks/index.fefvp17n.js"];
export const stylesheets = ["_app/immutable/assets/3.xXmC6fge.css"];
export const fonts = [];
