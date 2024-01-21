import { n as noop, c as create_ssr_component, d as createEventDispatcher, e as escape, f as null_to_empty, h as add_attribute, i as assign, j as identity, a as validate_store, b as subscribe, v as validate_component } from "../../chunks/ssr.js";
import { F as FIREBASE_CONFIG } from "../../chunks/dynamic.env.js";
import { initializeApp } from "firebase/app";
import "firebase/storage";
import mapboxgl from "mapbox-gl";
import { w as writable } from "../../chunks/index2.js";
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
const PUBLIC_DEV_MAPBOX_KEY = "pk.eyJ1IjoibGVtb25mb3htZXJlIiwiYSI6ImNscmxzd2JsODB1NXYycXBnNTd4c2w4d20ifQ.V48CpbWN9rfL4sfo70hEjQ";
const css$4 = {
  code: '@media screen and (min-width: 621px){}@media screen and (max-width: 621px){}@media screen and (min-width: 1000px){}@media screen and (max-width: 1000px){}@keyframes s-TLgm6duHKhDr-fadeIn{from{filter:opacity(0) blur(15px)}to{filter:opacity(1) blur(15px)}}button.s-TLgm6duHKhDr.s-TLgm6duHKhDr{font-family:"Outfit", system-ui, Helvetica, sans-serif;touch-action:manipulation;border:none;background-color:hsl(240, 4%, 9%);border-radius:10px;font-size:16px;font-weight:400;color:hsl(0, 0%, 100%);background:none;letter-spacing:-0.44px;padding:6px 16px;margin:0;box-sizing:border-box;cursor:pointer;-webkit-tap-highlight-color:transparent;-webkit-user-drag:none;-moz-user-select:none;user-select:none;-webkit-user-select:none;-ms-user-select:none}main.s-TLgm6duHKhDr.s-TLgm6duHKhDr{width:calc(100% - 40px);height:600px;padding:0px 0px 20px 0px;box-sizing:border-box;border-radius:14px;position:fixed;bottom:20px;left:20px;overflow:scroll;display:flex;justify-content:flex-start;align-items:center;flex-direction:column;background-color:hsl(240, 4%, 9%);z-index:2;transition:transform 700ms cubic-bezier(0.3, 1, 0.22, 1.003)}main.s-TLgm6duHKhDr #main-photo-placeholder.s-TLgm6duHKhDr{width:100%;height:auto;aspect-ratio:1/1.15}main.s-TLgm6duHKhDr #main-photo.s-TLgm6duHKhDr{width:100%;height:auto;aspect-ratio:1/1.15;object-fit:cover}main.s-TLgm6duHKhDr #submit.s-TLgm6duHKhDr{width:calc(100% - 36px);height:50px;margin-top:20px;background-color:hsl(226, 88%, 58%);text-align:center}main.s-TLgm6duHKhDr #options.s-TLgm6duHKhDr{width:100%;margin-top:25px;display:flex}main.s-TLgm6duHKhDr #options h2.s-TLgm6duHKhDr{font-weight:500;font-size:18px;color:hsl(0, 0%, 51%);letter-spacing:-0.45px}main.s-TLgm6duHKhDr #options #count.s-TLgm6duHKhDr{width:100%;margin:0px 18px 0px 13px;box-sizing:border-box;display:flex;flex-direction:column}main.s-TLgm6duHKhDr #options #count #slider-container.s-TLgm6duHKhDr{position:relative;width:100%;height:50px;margin-top:10px;overflow:hidden;border:1px solid hsl(0, 0%, 18%);border-radius:8px;transition:transform 700ms cubic-bezier(0.3, 1, 0.22, 1.003)}main.s-TLgm6duHKhDr #options #count #slider-container.s-TLgm6duHKhDr:active{transform:scale(1.1)}main.s-TLgm6duHKhDr #options #count #slider-container #background.s-TLgm6duHKhDr{position:absolute;width:100%;height:100%;transition:transform 700ms cubic-bezier(0.3, 1, 0.22, 1.003);background-color:hsl(226, 88%, 58%);transform-origin:left}main.s-TLgm6duHKhDr #options #count #slider-container p.s-TLgm6duHKhDr{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;z-index:1}main.s-TLgm6duHKhDr #options #animal.s-TLgm6duHKhDr{width:130px;min-width:130px;margin-left:18px;box-sizing:border-box;display:flex;flex-direction:column}main.s-TLgm6duHKhDr #options #animal select.s-TLgm6duHKhDr{appearance:none;width:100%;height:50px;margin-top:10px;background-color:transparent;border:1px solid hsl(0, 0%, 18%);border-radius:8px;display:flex;justify-content:center;align-items:center;font-family:"Outfit", system-ui, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:-0.37px;color:hsl(0, 0%, 93%);text-align-last:center}main.s-TLgm6duHKhDr hr.s-TLgm6duHKhDr{position:absolute;top:14px;width:36px;height:5px;border-radius:10px;background:transparent;backdrop-filter:blur(50px) saturate(0) contrast(5) invert(1);-webkit-backdrop-filter:blur(50px) saturate(0) contrast(5) invert(1)}main.hidden.s-TLgm6duHKhDr.s-TLgm6duHKhDr{transform:translateY(675px)}',
  map: null
};
const PhotoPanel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  createEventDispatcher();
  let { open } = $$props;
  let { imgFile } = $$props;
  let { imgUrl } = $$props;
  let panelParent;
  let dropdownElement;
  let maxCount = 10;
  let currentCount = 2;
  let sliderContainer;
  initializeApp(FIREBASE_CONFIG);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.imgFile === void 0 && $$bindings.imgFile && imgFile !== void 0)
    $$bindings.imgFile(imgFile);
  if ($$props.imgUrl === void 0 && $$bindings.imgUrl && imgUrl !== void 0)
    $$bindings.imgUrl(imgUrl);
  $$result.css.add(css$4);
  return `<main class="${escape(null_to_empty(open ? "no-drag" : "no-drag hidden"), true) + " s-TLgm6duHKhDr"}"${add_attribute(
    "style",
    "",
    0
  )}${add_attribute("this", panelParent, 0)}><hr class="s-TLgm6duHKhDr"> ${imgUrl ? `<img id="main-photo"${add_attribute("src", imgUrl, 0)} alt="" class="s-TLgm6duHKhDr">` : `<div id="main-photo-placeholder" class="s-TLgm6duHKhDr"></div>`} <section id="options" class="s-TLgm6duHKhDr"><section id="animal" class="s-TLgm6duHKhDr"><h2 class="s-TLgm6duHKhDr" data-svelte-h="svelte-gtwa8a">Animal</h2> <select name="animals" class="s-TLgm6duHKhDr"${add_attribute("this", dropdownElement, 0)}><option value="slug" data-svelte-h="svelte-1eh7axh">Banana Slug</option><option value="deer" data-svelte-h="svelte-9wyhda">Deer</option><option value="tkey" data-svelte-h="svelte-11g24e9">Turkey</option><option value="coyo" data-svelte-h="svelte-1dsij0f">Coyote</option><option value="racc" data-svelte-h="svelte-137x88k">Raccoon</option></select></section> <section id="count" class="s-TLgm6duHKhDr"><h2 class="s-TLgm6duHKhDr" data-svelte-h="svelte-14mfgoz">Count</h2> <div id="slider-container" class="s-TLgm6duHKhDr"${add_attribute("this", sliderContainer, 0)}><div id="background" style="${"transform: scaleX(" + escape(currentCount / maxCount, true) + ")"}" class="s-TLgm6duHKhDr"></div> <p class="s-TLgm6duHKhDr">${escape(currentCount)}</p></div></section></section> <button id="submit" class="s-TLgm6duHKhDr">${`Submit Photo`}</button> </main>`;
});
function quartOut(t) {
  return Math.pow(t - 1, 3) * (1 - t) + 1;
}
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function get_interpolator(a, b) {
  if (a === b || a !== a)
    return () => a;
  const type = typeof a;
  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error("Cannot interpolate values of different type");
  }
  if (Array.isArray(a)) {
    const arr = b.map((bi, i) => {
      return get_interpolator(a[i], bi);
    });
    return (t) => arr.map((fn) => fn(t));
  }
  if (type === "object") {
    if (!a || !b)
      throw new Error("Object cannot be null");
    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return (t) => new Date(a + t * delta);
    }
    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach((key) => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return (t) => {
      const result = {};
      keys.forEach((key) => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }
  if (type === "number") {
    const delta = b - a;
    return (t) => a + t * delta;
  }
  throw new Error(`Cannot interpolate ${type} values`);
}
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    target_value = new_value;
    let previous_task = task;
    let started = false;
    let {
      delay = 0,
      duration = 400,
      easing = identity,
      interpolate = get_interpolator
    } = assign(assign({}, defaults), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start)
        return true;
      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === "function")
          duration = duration(value, new_value);
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > /** @type {number} */
      duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}
const css$3 = {
  code: '@media screen and (min-width: 621px){}@media screen and (max-width: 621px){}@media screen and (min-width: 1000px){}@media screen and (max-width: 1000px){}@keyframes s-45vs8dfFadfq-fadeIn{from{filter:opacity(0) blur(15px)}to{filter:opacity(1) blur(15px)}}button.s-45vs8dfFadfq.s-45vs8dfFadfq{font-family:"Outfit", system-ui, Helvetica, sans-serif;touch-action:manipulation;border:none;background-color:hsl(240, 4%, 9%);border-radius:10px;font-size:16px;font-weight:400;color:hsl(0, 0%, 100%);background:none;letter-spacing:-0.44px;padding:6px 16px;margin:0;box-sizing:border-box;cursor:pointer;-webkit-tap-highlight-color:transparent;-webkit-user-drag:none;-moz-user-select:none;user-select:none;-webkit-user-select:none;-ms-user-select:none}input.s-45vs8dfFadfq.s-45vs8dfFadfq{height:36px;padding:0px 10px;box-sizing:border-box;transition:none;border:2px solid hsl(240, 4%, 9%);border-radius:8px;background:none;font-family:"Outfit", system-ui, Helvetica, sans-serif;font-size:14px}input.s-45vs8dfFadfq.s-45vs8dfFadfq::placeholder{color:hsl(0, 0%, 51%);transition:opacity 300ms ease-in}main.s-45vs8dfFadfq.s-45vs8dfFadfq{position:fixed;bottom:25px;right:10px;z-index:2;display:flex;justify-content:center;align-items:center;flex-direction:column;transition:transform 200ms cubic-bezier(0.3, -0.01, 0.4, 1.004)}main.s-45vs8dfFadfq button.s-45vs8dfFadfq{position:relative;width:55px;height:55px;background-color:hsl(240, 4%, 9%);display:flex;justify-content:center;align-items:center;border-radius:8px}main.s-45vs8dfFadfq button.s-45vs8dfFadfq:active{background-color:hsl(0, 0%, 18%)}main.s-45vs8dfFadfq button input.s-45vs8dfFadfq{position:absolute;top:0px;left:0px;width:100%;height:100%}main.s-45vs8dfFadfq button img.s-45vs8dfFadfq,main.s-45vs8dfFadfq button svg.s-45vs8dfFadfq{width:18px;height:18px}main.s-45vs8dfFadfq button#camera.s-45vs8dfFadfq{border-radius:8px 8px 0px 0px;margin-bottom:1px}main.s-45vs8dfFadfq button#recenter.s-45vs8dfFadfq{border-radius:0px 0px 8px 8px;margin-bottom:15px}main.hidden.s-45vs8dfFadfq.s-45vs8dfFadfq{transform:translate(80px, 0px)}',
  map: null
};
const ControlOverlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  createEventDispatcher();
  let { opened = true } = $$props;
  let { centered = true } = $$props;
  if ($$props.opened === void 0 && $$bindings.opened && opened !== void 0)
    $$bindings.opened(opened);
  if ($$props.centered === void 0 && $$bindings.centered && centered !== void 0)
    $$bindings.centered(centered);
  $$result.css.add(css$3);
  return `<main class="${escape(null_to_empty(opened ? "" : "hidden"), true) + " s-45vs8dfFadfq"}"><button id="camera" class="s-45vs8dfFadfq"><input type="file" accept="image/png, image/jpeg, image/heic" hidden class="s-45vs8dfFadfq"> <img src="/icons/camera.svg" class="s-45vs8dfFadfq"></button> <button id="recenter" class="s-45vs8dfFadfq"><svg width="19px" height="19px" viewBox="0 0 19 19" version="1.1" class="s-45vs8dfFadfq"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Screen-/-Filter-open" transform="translate(-341, -603)" stroke-linejoin="round"${add_attribute("fill", centered ? "#EEEEEE" : "transparent", 0)} fill-rule="nonzero" stroke="#EEEEEE" stroke-width="1.5"><g id="Menu" transform="translate(323, 528.9)"><g id="Reorient" transform="translate(0, 56)"><path d="M34.8773681,19.2967391 L29.4711206,35.354452 L28.2500958,26.7492377 L19.8848367,26.7492377 L34.8773681,19.2967391 Z" id="Path"></path></g></g></g></g></svg></button> <button id="filter" class="s-45vs8dfFadfq"><img src="/icons/layer.svg" class="s-45vs8dfFadfq"></button> </main>`;
});
const css$2 = {
  code: '@media screen and (min-width: 621px){}@media screen and (max-width: 621px){}@media screen and (min-width: 1000px){}@media screen and (max-width: 1000px){}@keyframes s-s50Bl-jjbF1o-fadeIn{from{filter:opacity(0) blur(15px)}to{filter:opacity(1) blur(15px)}}button.s-s50Bl-jjbF1o.s-s50Bl-jjbF1o{font-family:"Outfit", system-ui, Helvetica, sans-serif;touch-action:manipulation;border:none;background-color:hsl(240, 4%, 9%);border-radius:10px;font-size:16px;font-weight:400;color:hsl(0, 0%, 100%);background:none;letter-spacing:-0.44px;padding:6px 16px;margin:0;box-sizing:border-box;cursor:pointer;-webkit-tap-highlight-color:transparent;-webkit-user-drag:none;-moz-user-select:none;user-select:none;-webkit-user-select:none;-ms-user-select:none}main.s-s50Bl-jjbF1o.s-s50Bl-jjbF1o{width:calc(100% - 100px);height:477px;padding:14px 18px;box-sizing:border-box;border-radius:14px;position:fixed;bottom:20px;left:20px;overflow:hidden;display:flex;justify-content:flex-start;align-items:center;flex-direction:column;background-color:hsl(240, 4%, 9%);z-index:2;transition:transform 700ms cubic-bezier(0.3, 1, 0.22, 1.003)}main.s-s50Bl-jjbF1o section.s-s50Bl-jjbF1o{width:100%;margin-top:20px}main.s-s50Bl-jjbF1o section h2.s-s50Bl-jjbF1o{font-weight:500;font-size:18px;color:hsl(0, 0%, 51%);letter-spacing:-0.45px}main.s-s50Bl-jjbF1o section#animal #selection-parent.s-s50Bl-jjbF1o{position:relative;width:100%;margin-top:10px;display:flex;flex-direction:column;display:flex;border-radius:6px}main.s-s50Bl-jjbF1o section#animal #selection-parent button.s-s50Bl-jjbF1o{width:100%;height:50px;text-align:center;border-radius:8px}main.s-s50Bl-jjbF1o section#animal #selection-parent button.active.s-s50Bl-jjbF1o{background-color:hsl(226, 88%, 58%)}main.s-s50Bl-jjbF1o section#animal #selection-parent button.square-top.s-s50Bl-jjbF1o{border-top-right-radius:0px;border-top-left-radius:0px}main.s-s50Bl-jjbF1o section#animal #selection-parent button.square-bottom.s-s50Bl-jjbF1o{border-bottom-right-radius:0px;border-bottom-left-radius:0px}main.s-s50Bl-jjbF1o section#hot.s-s50Bl-jjbF1o{width:100%}main.s-s50Bl-jjbF1o section#hot #selection-parent.s-s50Bl-jjbF1o{position:relative;width:100%;height:50px;margin-top:10px;display:flex;border:1px solid hsl(0, 0%, 18%);border-radius:6px}main.s-s50Bl-jjbF1o section#hot #selection-parent #background.s-s50Bl-jjbF1o{position:absolute;width:50%;height:100%;background-color:hsl(226, 88%, 58%);border-radius:6px;z-index:-1;transition:transform 500ms cubic-bezier(0.3, 1, 0.22, 1.003)}main.s-s50Bl-jjbF1o section#hot #selection-parent #background.alt.s-s50Bl-jjbF1o{transform:translateX(100%)}main.s-s50Bl-jjbF1o section#hot #selection-parent button.s-s50Bl-jjbF1o{height:100%;width:50%;border-radius:0px;text-align:center;z-index:1}main.s-s50Bl-jjbF1o hr.s-s50Bl-jjbF1o{width:36px;height:5px;border-radius:10px;background-color:hsl(0, 0%, 18%);margin-bottom:10px}main.s-s50Bl-jjbF1o h1.s-s50Bl-jjbF1o{width:100%;text-align:left;font-weight:600;font-size:28px;color:hsl(0, 0%, 93%);letter-spacing:-0.7px}main.hidden.s-s50Bl-jjbF1o.s-s50Bl-jjbF1o{transform:translateY(552px)}',
  map: null
};
const FilterPanel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let { open } = $$props;
  let { configuration = {
    pointFog: true,
    slug: true,
    deer: true,
    tkey: true,
    coyo: true,
    racc: true
  } } = $$props;
  let panelParent;
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.configuration === void 0 && $$bindings.configuration && configuration !== void 0)
    $$bindings.configuration(configuration);
  $$result.css.add(css$2);
  return `<main class="${escape(null_to_empty(open ? "" : "hidden"), true) + " s-s50Bl-jjbF1o"}"${add_attribute(
    "style",
    "",
    0
  )}${add_attribute("this", panelParent, 0)}><hr class="s-s50Bl-jjbF1o"> <h1 class="s-s50Bl-jjbF1o" data-svelte-h="svelte-1l1t1r">Filter Settings</h1> <section id="hot" class="s-s50Bl-jjbF1o"><h2 class="s-s50Bl-jjbF1o" data-svelte-h="svelte-1yqvi5j">Hotspot Type</h2> <div id="selection-parent" class="s-s50Bl-jjbF1o"><div id="background" class="${escape(null_to_empty(configuration.pointFog ? "" : "alt"), true) + " s-s50Bl-jjbF1o"}"></div> <button class="s-s50Bl-jjbF1o" data-svelte-h="svelte-37ml87">Default</button> <button class="s-s50Bl-jjbF1o" data-svelte-h="svelte-108ec05">Point</button></div></section> <section id="animal" class="s-s50Bl-jjbF1o"><h2 class="s-s50Bl-jjbF1o" data-svelte-h="svelte-1ojql8r">Visible Animals</h2> <div id="selection-parent" class="s-s50Bl-jjbF1o"><button class="${escape(configuration.slug ? "active" : "", true) + " " + escape(configuration.deer ? "square-bottom" : "", true) + " s-s50Bl-jjbF1o"}">Banana Slug</button> <button class="${escape(configuration.deer ? "active" : "", true) + " " + escape(configuration.slug ? "square-top" : "", true) + " " + escape(configuration.tkey ? "square-bottom" : "", true) + " s-s50Bl-jjbF1o"}">Deer</button> <button class="${escape(configuration.tkey ? "active" : "", true) + " " + escape(configuration.deer ? "square-top" : "", true) + " " + escape(configuration.coyo ? "square-bottom" : "", true) + " s-s50Bl-jjbF1o"}">Turkey</button> <button class="${escape(configuration.coyo ? "active" : "", true) + " " + escape(configuration.tkey ? "square-top" : "", true) + " " + escape(configuration.racc ? "square-bottom" : "", true) + " s-s50Bl-jjbF1o"}">Coyote</button> <button class="${escape(configuration.racc ? "active" : "", true) + " " + escape(configuration.coyo ? "square-top" : "", true) + " s-s50Bl-jjbF1o"}">Raccoon</button></div></section> </main>`;
});
const css$1 = {
  code: '@media screen and (min-width: 621px){.only-phone.s-NPdjPyvq7OjS.s-NPdjPyvq7OjS{display:none !important}}@media screen and (max-width: 621px){.exclude-phone.s-NPdjPyvq7OjS.s-NPdjPyvq7OjS{display:none !important}}@media screen and (min-width: 1000px){.exclude-desktop.s-NPdjPyvq7OjS.s-NPdjPyvq7OjS{display:none !important}}@media screen and (max-width: 1000px){.only-desktop.s-NPdjPyvq7OjS.s-NPdjPyvq7OjS{display:none !important}}.glass-heavy.s-NPdjPyvq7OjS.s-NPdjPyvq7OjS,.glass-light.s-NPdjPyvq7OjS.s-NPdjPyvq7OjS{backdrop-filter:blur(40px) saturate(200%);-webkit-backdrop-filter:blur(40px) saturate(200%)}@keyframes s-NPdjPyvq7OjS-fadeIn{from{filter:opacity(0) blur(15px)}to{filter:opacity(1) blur(15px)}}button.s-NPdjPyvq7OjS.s-NPdjPyvq7OjS{font-family:"Outfit", system-ui, Helvetica, sans-serif;touch-action:manipulation;border:none;background-color:hsl(240, 4%, 9%);border-radius:10px;font-size:16px;font-weight:400;color:hsl(0, 0%, 100%);background:none;letter-spacing:-0.44px;padding:6px 16px;margin:0;box-sizing:border-box;cursor:pointer;-webkit-tap-highlight-color:transparent;-webkit-user-drag:none;-moz-user-select:none;user-select:none;-webkit-user-select:none;-ms-user-select:none}main.s-NPdjPyvq7OjS.s-NPdjPyvq7OjS{width:calc(100% - 40px);height:305px;padding:14px 18px;box-sizing:border-box;border-radius:14px;position:fixed;bottom:20px;left:20px;overflow:scroll;display:flex;justify-content:flex-start;align-items:center;flex-direction:column;background-color:hsl(240, 4%, 9%);z-index:2;transition:transform 700ms cubic-bezier(0.3, 1, 0.22, 1.003)}main.s-NPdjPyvq7OjS .post.s-NPdjPyvq7OjS{width:100%;margin-top:20px;display:flex;flex-direction:column}main.s-NPdjPyvq7OjS .post #content.s-NPdjPyvq7OjS{display:flex}main.s-NPdjPyvq7OjS .post #content img.s-NPdjPyvq7OjS{min-width:130px;width:130px;min-height:130px;height:130px;border-radius:8px;object-fit:cover}main.s-NPdjPyvq7OjS .post #content #desc.s-NPdjPyvq7OjS{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;margin-left:17px}main.s-NPdjPyvq7OjS .post #content #desc h2.s-NPdjPyvq7OjS{font-weight:600;font-size:24px;color:hsl(0, 0%, 93%);letter-spacing:-0.6px}main.s-NPdjPyvq7OjS .post #content #desc #animal.s-NPdjPyvq7OjS,main.s-NPdjPyvq7OjS .post #content #desc #date.s-NPdjPyvq7OjS{font-weight:400;font-size:16px;color:hsl(0, 0%, 51%);letter-spacing:-0.2px}main.s-NPdjPyvq7OjS .post #content #desc #animal.s-NPdjPyvq7OjS{margin-top:7px}main.s-NPdjPyvq7OjS .post #content #desc #animal span.red.s-NPdjPyvq7OjS{color:hsl(0, 89%, 61%)}main.s-NPdjPyvq7OjS .post #content #desc #animal span.blue.s-NPdjPyvq7OjS{color:hsl(238, 83%, 63%)}main.s-NPdjPyvq7OjS .post #content #desc #animal span.green.s-NPdjPyvq7OjS{color:hsl(101, 83%, 63%)}main.s-NPdjPyvq7OjS .post #content #desc #animal span.yellow.s-NPdjPyvq7OjS{color:hsl(43, 83%, 63%)}main.s-NPdjPyvq7OjS .post #content #desc #animal span.orange.s-NPdjPyvq7OjS{color:hsl(20, 90%, 59%)}main.s-NPdjPyvq7OjS .post #content #desc #date.s-NPdjPyvq7OjS{margin-top:0px}main.s-NPdjPyvq7OjS .post #content #desc #date span.s-NPdjPyvq7OjS{color:hsl(0, 0%, 93%)}main.s-NPdjPyvq7OjS .post #rating.s-NPdjPyvq7OjS{width:100%;margin-top:15px}main.s-NPdjPyvq7OjS .post #rating #title.s-NPdjPyvq7OjS{font-weight:500;font-size:15px;color:hsl(0, 0%, 51%);letter-spacing:-0.35px}main.s-NPdjPyvq7OjS .post #rating #button-container.s-NPdjPyvq7OjS{width:100%;height:40px;margin-top:7px;border:1px solid hsl(0, 0%, 18%);border-radius:6px;overflow:hidden;display:flex}main.s-NPdjPyvq7OjS .post #rating #button-container button.s-NPdjPyvq7OjS{width:50%;height:100%;box-sizing:border-box;border-radius:0px;display:flex;justify-content:center;align-items:center}main.s-NPdjPyvq7OjS .post #rating #button-container button.s-NPdjPyvq7OjS:first-child{border-right:1px solid hsl(0, 0%, 18%)}main.s-NPdjPyvq7OjS .post #rating #button-container button.s-NPdjPyvq7OjS:active{background-color:hsl(0, 0%, 18%)}main.s-NPdjPyvq7OjS .post #rating #button-container button:active img.s-NPdjPyvq7OjS{opacity:0.3}main.s-NPdjPyvq7OjS .post #rating #button-container button.active#yes.s-NPdjPyvq7OjS{background-color:hsl(226, 88%, 58%)}main.s-NPdjPyvq7OjS .post #rating #button-container button.active#yes img.s-NPdjPyvq7OjS{opacity:1}main.s-NPdjPyvq7OjS .post #rating #button-container button.active#no.s-NPdjPyvq7OjS{background-color:hsl(0, 0%, 18%)}main.s-NPdjPyvq7OjS .post #rating #button-container button.active#no img.s-NPdjPyvq7OjS{opacity:0.5}main.s-NPdjPyvq7OjS .post #rating #button-container button img.s-NPdjPyvq7OjS{height:13px;opacity:0.2}main.s-NPdjPyvq7OjS hr.s-NPdjPyvq7OjS{width:36px;height:5px;border-radius:10px;background-color:hsl(0, 0%, 18%);margin-bottom:10px}main.s-NPdjPyvq7OjS h1.s-NPdjPyvq7OjS{width:100%;text-align:left;font-weight:600;font-size:28px;color:hsl(0, 0%, 93%);letter-spacing:-0.7px}main.hidden.s-NPdjPyvq7OjS.s-NPdjPyvq7OjS{transform:translateY(380px)}',
  map: null
};
const PostPanel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentPostRating;
  createEventDispatcher();
  createEventDispatcher();
  let { open } = $$props;
  let { postData } = $$props;
  let panelParent;
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.postData === void 0 && $$bindings.postData && postData !== void 0)
    $$bindings.postData(postData);
  $$result.css.add(css$1);
  currentPostRating = postData ? localStorage.getItem(postData.id) : "";
  return `<main class="${escape(null_to_empty(open ? "no-drag" : "no-drag hidden"), true) + " s-NPdjPyvq7OjS"}"${add_attribute(
    "style",
    "",
    0
  )}${add_attribute("this", panelParent, 0)}><hr class="s-NPdjPyvq7OjS"> <h1 class="s-NPdjPyvq7OjS" data-svelte-h="svelte-1vaw4uu">Spotted Animals</h1> ${postData ? `<section class="post s-NPdjPyvq7OjS"><section id="content" class="s-NPdjPyvq7OjS"><img${add_attribute("src", postData.image_url, 0)} alt="animal" class="s-NPdjPyvq7OjS"> <section id="desc" class="s-NPdjPyvq7OjS"><h2 id="name" class="s-NPdjPyvq7OjS">${escape(postData.name)}</h2> <p id="animal" class="s-NPdjPyvq7OjS">Spotted <span class="${escape(null_to_empty(speciesColor[postData.type]), true) + " s-NPdjPyvq7OjS"}">${escape(postData.count)} ${escape(speciesName[postData.type][Math.min(postData.count - 1, 1)])}</span></p> <p id="date" class="s-NPdjPyvq7OjS"><span class="s-NPdjPyvq7OjS">${escape(Math.ceil(Math.abs(Date.now() / 1e3 - postData.timestamp) / (60 * 60 * 24)))}</span> days ago</p></section></section> <section id="rating" class="s-NPdjPyvq7OjS"><h2 id="title" class="s-NPdjPyvq7OjS" data-svelte-h="svelte-10drvqp">Is this submission accurate?</h2> <div id="button-container" class="s-NPdjPyvq7OjS"><button id="yes" class="${escape(null_to_empty(currentPostRating === "1" ? "active" : ""), true) + " s-NPdjPyvq7OjS"}"><img src="/icons/thumbsup.svg" alt="" class="s-NPdjPyvq7OjS"></button> <button id="no" class="${escape(null_to_empty(currentPostRating === "-1" ? "active" : ""), true) + " s-NPdjPyvq7OjS"}"><img src="/icons/thumbsdown.svg" alt="" class="s-NPdjPyvq7OjS"></button></div></section></section>` : ``} </main>`;
});
const css = {
  code: "@media screen and (min-width: 621px){}@media screen and (max-width: 621px){}@media screen and (min-width: 1000px){}@media screen and (max-width: 1000px){}@keyframes s-y_bCXRrkrYfP-fadeIn{from{filter:opacity(0) blur(15px)}to{filter:opacity(1) blur(15px)}}main.s-y_bCXRrkrYfP.s-y_bCXRrkrYfP{width:100%;height:calc(100vh - 85px);overflow:hidden;display:flex;justify-content:center;align-items:center}main.s-y_bCXRrkrYfP #map-container.s-y_bCXRrkrYfP{width:100%;height:100%;position:fixed}main.s-y_bCXRrkrYfP #map-container #map-gradient.s-y_bCXRrkrYfP{background-image:linear-gradient(180deg, hsl(0, 0%, 13%) 0%, hsla(0, 0%, 13%, 0) 100%);position:fixed;width:100%;height:50px;top:0px;pointer-events:none;z-index:1}main.s-y_bCXRrkrYfP #map-container #map.s-y_bCXRrkrYfP{width:100%;height:calc(100vh - 40px);z-index:0;transition:transform 700ms cubic-bezier(0.3, 1, 0.22, 1.003)}",
  map: null
};
const speciesColor = {
  slug: "yellow",
  deer: "red",
  tkey: "blue",
  coyo: "orange",
  racc: "green"
};
const speciesName = {
  slug: ["Banana Slug", "Banana Slugs"],
  deer: ["Deer", "Deers"],
  tkey: ["Turkey", "Turkeys"],
  coyo: ["Coyote", "Coyotes"],
  racc: ["Raccoon", "Raccoons"]
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let controlPanelOpen;
  let $$unsubscribe_zoom;
  let $lat, $$unsubscribe_lat;
  let $lng, $$unsubscribe_lng;
  let { data } = $$props;
  mapboxgl.accessToken = PUBLIC_DEV_MAPBOX_KEY;
  let mainContainer;
  let mapElmnt;
  const lng = tweened(0, { duration: 1e3, easing: quartOut });
  validate_store(lng, "lng");
  $$unsubscribe_lng = subscribe(lng, (value) => $lng = value);
  const lat = tweened(0, { duration: 1e3, easing: quartOut });
  validate_store(lat, "lat");
  $$unsubscribe_lat = subscribe(lat, (value) => $lat = value);
  const zoom = tweened(13.6, { duration: 1e3, easing: quartOut });
  validate_store(zoom, "zoom");
  $$unsubscribe_zoom = subscribe(zoom, (value) => value);
  let mapCentered;
  let filterPanelOpen = false;
  let photoPanelOpen = false;
  let postPanelOpen = false;
  let filterOption;
  let photoUrl;
  let imageFile;
  let currentPostData;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    mapCentered = Math.round($lng * 1e4) / 1e4 === 0 && Math.round($lat * 1e4) / 1e4 === 0;
    controlPanelOpen = !(photoPanelOpen || postPanelOpen);
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-1jae5dz_START --><link href="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.min.css" rel="stylesheet"><script src="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.js" data-svelte-h="svelte-tr3vq5"><\/script><!-- HEAD_svelte-1jae5dz_END -->`, ""} <main class="s-y_bCXRrkrYfP"${add_attribute("this", mainContainer, 0)}><section id="map-container" class="${"" + escape(filterOption?.pointFog ?? true ? "" : "point", true) + " " + escape(filterOption?.slug ?? true ? "" : "no-slug", true) + " " + escape(filterOption?.deer ?? true ? "" : "no-deer", true) + " " + escape(filterOption?.tkey ?? true ? "" : "no-tkey", true) + " " + escape(filterOption?.coyo ?? true ? "" : "no-coyo", true) + " " + escape(filterOption?.racc ?? true ? "" : "no-racc", true) + " s-y_bCXRrkrYfP"}"><div id="map-gradient" class="s-y_bCXRrkrYfP"></div> <div id="map" class="s-y_bCXRrkrYfP"${add_attribute("this", mapElmnt, 0)}></div></section> ${validate_component(ControlOverlay, "ControlOverlay").$$render(
      $$result,
      {
        opened: controlPanelOpen,
        centered: mapCentered
      },
      {
        opened: ($$value) => {
          controlPanelOpen = $$value;
          $$settled = false;
        },
        centered: ($$value) => {
          mapCentered = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(PostPanel, "PostPanel").$$render(
      $$result,
      {
        postData: currentPostData,
        open: postPanelOpen
      },
      {
        open: ($$value) => {
          postPanelOpen = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(PhotoPanel, "PhotoPanel").$$render(
      $$result,
      {
        open: photoPanelOpen,
        imgUrl: photoUrl,
        imgFile: imageFile
      },
      {
        open: ($$value) => {
          photoPanelOpen = $$value;
          $$settled = false;
        },
        imgUrl: ($$value) => {
          photoUrl = $$value;
          $$settled = false;
        },
        imgFile: ($$value) => {
          imageFile = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(FilterPanel, "FilterPanel").$$render(
      $$result,
      {
        open: filterPanelOpen,
        configuration: filterOption
      },
      {
        open: ($$value) => {
          filterPanelOpen = $$value;
          $$settled = false;
        },
        configuration: ($$value) => {
          filterOption = $$value;
          $$settled = false;
        }
      },
      {}
    )}   </main>`;
  } while (!$$settled);
  $$unsubscribe_zoom();
  $$unsubscribe_lat();
  $$unsubscribe_lng();
  return $$rendered;
});
export {
  Page as default,
  speciesColor,
  speciesName
};
