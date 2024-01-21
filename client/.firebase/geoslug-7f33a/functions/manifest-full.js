export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","favicon.png","icons/.DS_Store","icons/camera.svg","icons/layer.svg","icons/reorient.svg","icons/thumbsdown.svg","icons/thumbsup.svg","stylesheets/fonts.css","stylesheets/fonts.scss","stylesheets/global.css","stylesheets/global.scss","stylesheets/guideline.css","stylesheets/guideline.scss"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml",".css":"text/css"},
	_: {
		client: {"start":"_app/immutable/entry/start.ZzG5JznF.js","app":"_app/immutable/entry/app.3txhwD4C.js","imports":["_app/immutable/entry/start.ZzG5JznF.js","_app/immutable/chunks/entry.Ho35uJDN.js","_app/immutable/chunks/scheduler.tGA8qe-D.js","_app/immutable/chunks/index.tgVM2Jmh.js","_app/immutable/entry/app.3txhwD4C.js","_app/immutable/chunks/scheduler.tGA8qe-D.js","_app/immutable/chunks/index.fefvp17n.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/store/post",
				pattern: /^\/api\/store\/post\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/store/post/_server.ts.js'))
			},
			{
				id: "/signin",
				pattern: /^\/signin\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
