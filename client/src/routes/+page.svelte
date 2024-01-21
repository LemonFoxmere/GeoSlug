<script lang="ts" context="module">
	export const speciesColor: Record<species, string> = {
		slug: "yellow",
		deer: "red",
		tkey: "blue",
		coyo: "orange",
		racc: "green"
	};
	export const speciesName: Record<species, [string, string]> = {
		slug: ["Banana Slug", "Banana Slugs"],
		deer: ["Deer", "Deers"],
		tkey: ["Turkey", "Turkeys"],
		coyo: ["Coyote", "Coyotes"],
		racc: ["Raccoon", "Raccoons"]
	};
</script>

<script lang="ts">
	import { PUBLIC_DEV_MAPBOX_KEY } from "$env/static/public";
	import PhotoPanel from "$lib/ui/panels/PhotoPanel.svelte";
	import mapboxgl from "mapbox-gl";
	import "mapbox-gl/dist/mapbox-gl.css";
	import { onMount } from "svelte";
	import { quartOut } from "svelte/easing";
	import { tweened } from "svelte/motion";
	import type { PageData } from "./$types";
	import type { PostData, species } from "./+page.server";
	import ControlOverlay from "./../lib/ui/map/ControlOverlay.svelte";
	import FilterPanel, { type FilterConfiguration } from "./../lib/ui/panels/FilterPanel.svelte";
	import PostPanel from "./../lib/ui/panels/PostPanel.svelte";

	export let data: PageData;

	// Mapbox configuration
	mapboxgl.accessToken = PUBLIC_DEV_MAPBOX_KEY;
	let mainContainer: HTMLElement;
	let map: mapboxgl.Map;
	let mapElmnt: HTMLElement;
	let marker: mapboxgl.Marker;

	// Map interaction states
	let mapDragging: boolean = false;
	let mapOffsetLng = -122.05896;
	let mapOffsetLat = 36.9925;

	// Tweened values for smooth transitions
	const lng = tweened(0, { duration: 1000, easing: quartOut });
	const lat = tweened(0, { duration: 1000, easing: quartOut });
	const zoom = tweened(13.6, { duration: 1000, easing: quartOut });

	let mapCentered: boolean;
	$: mapCentered = Math.round($lng * 10000) / 10000 === 0 && Math.round($lat * 10000) / 10000 === 0;

	function initializeMap() {
		map = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/dark-v11",
			center: [$lng + mapOffsetLng, $lat + mapOffsetLat],
			zoom: 13.6,
			interactive: true
		});

		updateData();

		map.on("touchstart", () => (mapDragging = true));
		map.on("mousedown", () => (mapDragging = true));
		map.on("move", () => {
			if (mapDragging) updateData();
		});

		map.on("style.load", () => {
			// Insert the layer beneath any symbol layer.
			const layers = map.getStyle().layers;
			const labelLayerId = layers.find(
				(layer) => layer.type === "symbol" && layer!.layout!["text-field"]
			)!.id;

			// The 'building' layer in the Mapbox Streets
			// vector tileset contains building height data
			// from OpenStreetMap.
			map.addLayer(
				{
					id: "add-3d-buildings",
					source: "composite",
					"source-layer": "building",
					filter: ["==", "extrude", "true"],
					type: "fill-extrusion",
					minzoom: 15,
					paint: {
						"fill-extrusion-color": "#101010",

						// Use an 'interpolate' expression to
						// add a smooth transition effect to
						// the buildings as the user zooms in.
						"fill-extrusion-height": [
							"interpolate",
							["linear"],
							["zoom"],
							15,
							0,
							15.05,
							["get", "height"]
						],
						"fill-extrusion-base": [
							"interpolate",
							["linear"],
							["zoom"],
							15,
							0,
							15.05,
							["get", "min_height"]
						],
						"fill-extrusion-opacity": 1
					}
				},
				labelLayerId
			);
			map.addSource("mapbox-dem", {
				type: "raster-dem",
				url: "mapbox://mapbox.mapbox-terrain-dem-v1",
				tileSize: 512,
				maxzoom: 20
			});
			// add the DEM source as a terrain layer with exaggerated height
			map.setTerrain({ source: "mapbox-dem", exaggeration: 2 });
		});

		// add markers to the map based on the document data
		const posts = data.posts;
		for (const post of posts) {
			addNewMarker(post.id, post.lng, post.lat, post.type, post.timestamp);
		}
	}

	function updateData() {
		lng.set(map.getCenter().lng - mapOffsetLng, { duration: 0 });
		lat.set(map.getCenter().lat - mapOffsetLat, { duration: 0 });
		zoom.set(map.getZoom(), { duration: 0 });
	}

	// function updateCenter(lngDest: number, latDest: number, zoomDest: number = 16) {
	// 	mapDragging = false;
	// 	// Update target location
	// 	targetLat = latDest;
	// 	targetLng = lngDest;
	// 	targetZoom = zoomDest;

	// 	// Set tweened values
	// 	lng.set(lngDest);
	// 	lat.set(latDest);
	// 	zoom.set(zoomDest);
	// }
	function resetCenter() {
		map.flyTo({
			center: [mapOffsetLng, mapOffsetLat],
			zoom: 13.5,
			bearing: 0,
			pitch: 0
		});
	}

	// Reactive statements
	$: if (map && !mapDragging) {
		map.setCenter([$lng + mapOffsetLng, $lat + mapOffsetLat]);
		map.setZoom($zoom);
	}

	$: if (map && marker) {
		marker.setLngLat([map.getCenter().lng, map.getCenter().lat]);
	}

	// panel configuration
	let filterPanelOpen: boolean = false;
	let photoPanelOpen: boolean = false;
	let postPanelOpen: boolean = false;
	$: controlPanelOpen = !(photoPanelOpen || postPanelOpen);

	// filter panel
	let filterOption: FilterConfiguration;

	function closeFilterPanel() {
		filterPanelOpen = false;
		mapElmnt.removeEventListener("touchend", closeFilterPanel);
		mapElmnt.removeEventListener("touchmove", closeFilterPanel);
	}
	function toggleFilterPanel() {
		if (filterPanelOpen) {
			closeFilterPanel();
			return;
		}
		filterPanelOpen = true;

		// remove old event listeners
		mapElmnt.removeEventListener("touchend", closeFilterPanel);
		mapElmnt.removeEventListener("touchmove", closeFilterPanel);

		// add new event listeners
		mapElmnt.addEventListener("touchend", closeFilterPanel);
		mapElmnt.addEventListener("touchmove", closeFilterPanel);
	}

	// photos panel
	let photoUrl: string;
	let imageFile: File;

	function startPictureUpload(evt: CustomEvent<{ file: File | null; url: string | null }>) {
		photoPanelOpen = true;

		if (evt.detail.file) imageFile = evt.detail.file;
		if (evt.detail.url) photoUrl = evt.detail.url;

		// upload photo
	}
	function closePhotoPanel() {
		URL.revokeObjectURL(photoUrl);
		photoPanelOpen = false;
	}

	function addNewMarker(uid: string, lng: number, lat: number, type: species, timestamp: number) {
		// Calculate the difference in days between the current time and the timestamp
		const currentTimestamp = Date.now();
		const diffTime = Math.abs(currentTimestamp / 1000 - timestamp);
		const diffDays = Math.ceil(diffTime / (60 * 60 * 24));

		// If the marker is older than 10 days, do not add it to the map
		if (diffDays > 7) return;

		const el = document.createElement("div");
		el.id = uid;
		el.classList.add("marker");
		el.classList.add(`diff${Math.max(0, diffDays)}`);
		el.classList.add(speciesColor[type]);

		el.ontouchend = () => {
			// Open post panel and zoom into the marker
			openPostPanel(uid);
			setTimeout(() => {
				map.flyTo({
					center: [lng, lat - 0.00008],
					zoom: 20,
					bearing: 0,
					pitch: 0,
					duration: 2000
				});
			}, 100);
		};

		// Add the marker to the map with the specified longitude and latitude
		new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
	}

	const onImageUpload = (evt: CustomEvent<{ post: PostData }>) => {
		// add the new post to the posts collection
		data.posts.push(evt.detail.post);

		setTimeout(() => {
			closePhotoPanel();
		}, 200);

		setTimeout(() => {
			// zoom to position and add new marker
			map.flyTo({
				center: [evt.detail.post.lng, evt.detail.post.lat],
				zoom: 20,
				bearing: -20,
				pitch: 60,
				duration: 2000
			});

			setTimeout(() => {
				addNewMarker(
					evt.detail.post.id,
					evt.detail.post.lng,
					evt.detail.post.lat,
					evt.detail.post.type,
					Date.now() / 1000
				);
			}, 1800);
		}, 300);
	};

	// post panel
	function closePostPanel() {
		postPanelOpen = false;
	}
	let currentPostData: PostData | undefined;
	function openPostPanel(uid: string) {
		currentPostData = data.posts.find((post) => post.id === uid);
		// if post exists, open the post panel
		if (currentPostData) postPanelOpen = true;
	}

	onMount(() => {
		initializeMap();
	});
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.min.css" rel="stylesheet" />
	<script src="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.js"></script>
</svelte:head>

<main bind:this={mainContainer}>
	<section
		id="map-container"
		class="
	{filterOption?.pointFog ?? true ? '' : 'point'}
	{filterOption?.slug ?? true ? '' : 'no-slug'}
	{filterOption?.deer ?? true ? '' : 'no-deer'}
	{filterOption?.tkey ?? true ? '' : 'no-tkey'}
	{filterOption?.coyo ?? true ? '' : 'no-coyo'}
	{filterOption?.racc ?? true ? '' : 'no-racc'}
	"
	>
		<div id="map-gradient" />
		<div id="map" bind:this={mapElmnt} />
	</section>

	<ControlOverlay
		bind:opened={controlPanelOpen}
		bind:centered={mapCentered}
		on:reorient={resetCenter}
		on:toggleFilter={toggleFilterPanel}
		on:picture={(e) => startPictureUpload(e)}
	/>

	<PostPanel bind:open={postPanelOpen} postData={currentPostData} on:close={closePostPanel} />

	<PhotoPanel
		bind:open={photoPanelOpen}
		bind:imgUrl={photoUrl}
		bind:imgFile={imageFile}
		on:submit={(e) => onImageUpload(e)}
		on:close={closePhotoPanel}
	/>

	<FilterPanel
		bind:open={filterPanelOpen}
		bind:configuration={filterOption}
		on:close={closeFilterPanel}
	/>

	<!-- <a id="signin" href="/signin" class="plain"><button><p>Sign In</p></button></a> -->

	<!-- <section id="overlay">
		<p>Long: {Math.round($lng * 100000) / 100000}</p>
		<p>Lat: {Math.round($lat * 100000) / 100000}</p>
		<p>Zoom: {$zoom}</p>
	</section> -->
</main>

<style lang="scss">
	@import "$static/stylesheets/guideline";

	main {
		width: 100%;
		height: calc(100vh - $urlbar-height);
		overflow: hidden;

		display: flex;
		justify-content: center;
		align-items: center;

		#overlay {
			position: absolute;
			top: 20px;
			left: 20px;

			z-index: 1;

			p {
				color: $white;
			}
		}

		#signin {
			position: fixed;
			bottom: 25px;
			left: 25px;

			width: 130px;
			height: 55px;

			background: $light-grey;
			border-radius: 8px;

			display: flex;
			justify-content: center;
			align-items: center;

			z-index: 1;

			&:active {
				background-color: $grey;
			}

			p {
				font-size: 18px;
				color: $black;
			}
		}

		#map-container {
			width: 100%;
			height: 100%;
			position: fixed;

			#map-gradient {
				background-image: linear-gradient(180deg, $map-grey 0%, hsla(0, 0%, 13%, 0) 100%);
				position: fixed;
				width: 100%;
				height: 50px;
				top: 0px;

				pointer-events: none;

				z-index: 1;
			}

			#map {
				width: 100%;
				height: calc(100vh - 40px);
				z-index: 0;

				transition: transform 700ms $out-generic-expo;
			}
		}
	}
</style>
