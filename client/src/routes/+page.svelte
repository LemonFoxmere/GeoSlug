<script lang="ts">
	import { PUBLIC_DEV_MAPBOX_KEY } from "$env/static/public";
	import mapboxgl from "mapbox-gl";
	import { onMount } from "svelte";
	mapboxgl.accessToken = PUBLIC_DEV_MAPBOX_KEY;

	onMount(() => {
		const map = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/dark-v11",
			center: [-122.05716, 37.0001],
			zoom: 16
		});
	});
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.min.css" rel="stylesheet" />
	<script src="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.js"></script>
</svelte:head>

<main>
	<div id="map-gradient" />
	<div id="map" />
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

		#map-gradient {
			background-image: linear-gradient(180deg, $map-grey 0%, hsla(0, 0%, 13%, 0) 100%);
			position: absolute;
			width: 100%;
			height: 50px;
			top: 0px;

			pointer-events: none;

			z-index: 1;
		}

		#map {
			position: fixed;
			width: 100%;
			height: 100%;
			z-index: 0;
		}
	}
</style>
