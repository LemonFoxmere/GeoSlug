

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/signin/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.zV9nH_JA.js","_app/immutable/chunks/scheduler.M0FcunTQ.js","_app/immutable/chunks/index.qramQVqu.js"];
export const stylesheets = ["_app/immutable/assets/3.xXmC6fge.css"];
export const fonts = [];
