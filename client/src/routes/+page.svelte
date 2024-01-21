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

	onMount(() => {
		initializeMap();
	});

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

	setTimeout(() => {
		photoPanelOpen = true;
	}, 500);

	// photos panel
	function startPictureUpload(evt: CustomEvent<{ file: File | null; url: string | null }>) {
		photoPanelOpen = true;
		const { file, url } = evt.detail;

		console.log(url);
		console.log(file);
	}
	function closePhotoPanel() {
		photoPanelOpen = false;
	}
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.min.css" rel="stylesheet" />
	<script src="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.js"></script>
</svelte:head>

<main>
	<section id="map-container">
		<div id="map-gradient" />
		<div id="map" bind:this={mapElmnt} />
	</section>

	<!-- Custom Marker Element (hidden, used only for styling) -->
	<div id="custom-marker" class="marker red {filterOption?.pointFog ?? true ? '' : 'point'}" />

	<ControlOverlay
		bind:opened={controlPanelOpen}
		on:reorient={resetCenter}
		on:toggleFilter={toggleFilterPanel}
		on:picture={(e) => startPictureUpload(e)}
	/>

	<PhotoPanel bind:open={photoPanelOpen} on:close={closePhotoPanel} />

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

		.marker {
			width: 50px;
			height: 50px;

			border-radius: 50%;
			z-index: 1;

			filter: blur(15px);

			transition: 700ms $out-generic-expo;
			transition-property: filter, background-color, outline;

			outline: 5px solid transparent;
			background-color: transparent;

			&.red {
				background-image: radial-gradient(circle at 50% 50%, $map-red 30%, transparent 100%);
			}

			&.point {
				filter: blur(0px);
				background-color: $map-red;
				outline: 5px solid $black;
				outline-offset: -8px;
			}
		}

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
