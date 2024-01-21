<script lang="ts">
	import { PUBLIC_DEV_MAPBOX_KEY } from "$env/static/public";
	import PhotoPanel from "$lib/ui/panels/PhotoPanel.svelte";
	import mapboxgl from "mapbox-gl";
	import "mapbox-gl/dist/mapbox-gl.css";
	import { onMount } from "svelte";
	import { quartOut } from "svelte/easing";
	import { tweened } from "svelte/motion";
	import ControlOverlay from "./../lib/ui/map/ControlOverlay.svelte";
	import FilterPanel, { type FilterConfiguration } from "./../lib/ui/panels/FilterPanel.svelte";

	// Mapbox configuration
	mapboxgl.accessToken = PUBLIC_DEV_MAPBOX_KEY;
	let mainContainer: HTMLElement;
	let map: mapboxgl.Map;
	let mapElmnt: HTMLElement;
	let marker: mapboxgl.Marker;

	// Map interaction states
	let mapDragging: boolean = false;
	let mapOffsetLng = -122.05716;
	let mapOffsetLat = 37.0001;

	// Target location for map centering
	let targetLng: number;
	let targetLat: number;
	let targetZoom: number = 16;

	// Tweened values for smooth transitions
	const lng = tweened(0, { duration: 1000, easing: quartOut });
	const lat = tweened(0, { duration: 1000, easing: quartOut });
	const zoom = tweened(16, { duration: 1000, easing: quartOut });

	function initializeMap() {
		map = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/dark-v11",
			center: [$lng + mapOffsetLng, $lat + mapOffsetLat],
			zoom: 16,
			interactive: true
		});

		addMarkersToMap();
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
						"fill-extrusion-opacity": 0.6
					}
				},
				labelLayerId
			);
		});
	}

	function addMarkersToMap() {
		// Example GeoJSON data for markers
		const el = document.getElementById("custom-marker");
		if (el) {
			new mapboxgl.Marker(el).setLngLat([mapOffsetLng, mapOffsetLat]).addTo(map);
		}
	}

	function updateData() {
		lng.set(map.getCenter().lng - mapOffsetLng, { duration: 0 });
		lat.set(map.getCenter().lat - mapOffsetLat, { duration: 0 });
		zoom.set(map.getZoom(), { duration: 0 });
	}

	function updateCenter(lngDest: number, latDest: number, zoomDest: number = 16) {
		mapDragging = false;
		// Update target location
		targetLat = latDest;
		targetLng = lngDest;
		targetZoom = zoomDest;

		// Set tweened values
		lng.set(lngDest);
		lat.set(latDest);
		zoom.set(zoomDest);
	}
	function resetCenter() {
		map.flyTo({
			center: [mapOffsetLng, mapOffsetLat],
			zoom: 16,
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
	$: controlPanelOpen = !photoPanelOpen;

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

	// setTimeout(() => {
	// 	photoPanelOpen = true;
	// }, 500);

	// photos panel
	let photoUrl: string;
	let file: File;

	function startPictureUpload(evt: CustomEvent<{ file: File | null; url: string | null }>) {
		photoPanelOpen = true;

		if (evt.detail.file) file = evt.detail.file;
		if (evt.detail.url) photoUrl = evt.detail.url;
	}
	function closePhotoPanel() {
		URL.revokeObjectURL(photoUrl);
		photoPanelOpen = false;
	}

	function addNewMarker(uid: string, lng: number, lat: number) {
		const el = document.createElement("div");
		el.id = uid;
		el.style.opacity = "0";
		el.classList.add("marker");
		el.classList.add("blue");

		new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
	}

	function submitPhoto(
		evt: CustomEvent<{ animal: string; count: number; lng: number; lat: number }>
	) {
		setTimeout(() => {
			closePhotoPanel();
		}, 200);

		setTimeout(() => {
			// zoom to position and add new marker
			map.flyTo({
				center: [evt.detail.lng, evt.detail.lat],
				zoom: 20,
				bearing: -20,
				pitch: 60,
				duration: 2000
			});

			setTimeout(() => {
				addNewMarker(crypto.randomUUID(), evt.detail.lng, evt.detail.lat);
			}, 1500);
		}, 300);

		let timestamp = Date.now();
		let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

		URL.revokeObjectURL(photoUrl);
	}

	onMount(() => {
		initializeMap();
		// DEBUG:
		addNewMarker(crypto.randomUUID(), mapOffsetLng, mapOffsetLat);
	});
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.min.css" rel="stylesheet" />
	<script src="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.js"></script>
</svelte:head>

<main bind:this={mainContainer}>
	<section id="map-container">
		<div id="map-gradient" />
		<div id="map" class={filterOption?.pointFog ?? true ? "" : "point"} bind:this={mapElmnt} />
	</section>

	<!-- Custom Marker Element (hidden, used only for styling) -->
	<!-- <div id="custom-marker" class="marker red {filterOption?.pointFog ?? true ? '' : 'point'}" /> -->
	<!-- <div id="custom-marker2" class="marker blue {filterOption?.pointFog ?? true ? '' : 'point'}" /> -->

	<ControlOverlay
		bind:opened={controlPanelOpen}
		on:reorient={resetCenter}
		on:toggleFilter={toggleFilterPanel}
		on:picture={(e) => startPictureUpload(e)}
	/>

	<PhotoPanel
		bind:open={photoPanelOpen}
		bind:imgUrl={photoUrl}
		on:submit={submitPhoto}
		on:close={closePhotoPanel}
	/>

	<FilterPanel
		bind:open={filterPanelOpen}
		bind:configuration={filterOption}
		on:close={closeFilterPanel}
	/>

	<a id="signin" href="/signin" class="plain"><button><p>Sign In</p></button></a>

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
				height: calc(100% + 40px);
				z-index: 0;

				transition: transform 700ms $out-generic-expo;
			}
		}
	}
</style>
