<script lang="ts">
	import { PUBLIC_DEV_MAPBOX_KEY } from "$env/static/public";
	import mapboxgl from "mapbox-gl";
	import { onMount } from "svelte";
	mapboxgl.accessToken = PUBLIC_DEV_MAPBOX_KEY;

	onMount(() => {
		const map = new mapboxgl.Map({
			container: "map",
			style: "mapbox://styles/mapbox/dark-v11",
			center: [16.37, 48.2],
			zoom: 12
		});
	});
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.min.css" rel="stylesheet" />
	<script src="https://api.mapbox.com/mapbox-assembly/v0.23.2/assembly.js"></script>
</svelte:head>

<main>
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

		#map {
			position: fixed;
			width: 100%;
			height: 100%;
		}
	}
</style>
