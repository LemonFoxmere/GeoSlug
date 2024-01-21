<script lang="ts" context="module">
	export interface FilterConfiguration {
		pointFog: boolean;
		slug: boolean;
		deer: boolean;
		tkey: boolean;
		coyo: boolean;
		racc: boolean;
	}
</script>

<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	const disp = createEventDispatcher();

	export let open: boolean;
	export let configuration: FilterConfiguration = {
		pointFog: true,
		slug: true,
		deer: true,
		tkey: true,
		coyo: true,
		racc: true
	};

	let panelParent: HTMLElement;
	let initDragPosition: [number, number] = [0, 0];
	let currentDragPosition: [number, number] = [0, 0];
	let dragging: boolean = false;
	let dragTime: [number, number] = [0, 0];

	const calcDistance = (x: number, y: number): number => {
		return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	};

	const closeSelf = () => disp("close");

	onMount(() => {
		panelParent.ontouchstart = (e) => {
			initDragPosition = [e.touches[0].clientX, e.touches[0].clientY];
			dragging = false;
		};
		panelParent.ontouchmove = (e) => {
			e.preventDefault();

			currentDragPosition = [e.touches[0].clientX, e.touches[0].clientY];
			if (!dragging && calcDistance(0, e.touches[0].clientY - initDragPosition[1]) > 20) {
				// exceed drag threshold
				dragging = true;
				dragTime[0] = performance.now();
				// reset initial drag position
				initDragPosition = [e.touches[0].clientX, e.touches[0].clientY];
			}
		};
		panelParent.ontouchend = (e) => {
			dragging = false;
			let diff = calcDistance(0, currentDragPosition[1] - initDragPosition[1]);
			dragTime[1] = performance.now();
			let dur = dragTime[1] - dragTime[0];
			let vel = (diff / dur) * 1000;

			console.log(currentDragPosition[1] > initDragPosition[1]);
			if (currentDragPosition[1] > initDragPosition[1] && (diff > 200 || vel > 1000)) {
				closeSelf();
			}
		};
	});
</script>

<main
	bind:this={panelParent}
	class={open ? "" : "hidden"}
	style={dragging
		? `transform: translateY(${Math.max(0, currentDragPosition[1] - initDragPosition[1])}px); transition: none;`
		: ""}
>
	<hr />
	<h1>Filter Settings</h1>

	<section id="hot">
		<h2>Hotspot Type</h2>

		<div id="selection-parent">
			<div id="background" class={configuration.pointFog ? "" : "alt"}></div>
			<button on:click={() => (configuration.pointFog = true)}>Default</button>
			<button on:click={() => (configuration.pointFog = false)}>Point</button>
		</div>
	</section>

	<section id="animal">
		<h2>Visible Animals</h2>

		<div id="selection-parent">
			<button
				class="{configuration.slug ? 'active' : ''} {configuration.deer ? 'square-bottom' : ''}"
				on:click={() => (configuration.slug = !configuration.slug)}>Banana Slug</button
			>
			<button
				class="{configuration.deer ? 'active' : ''} 
                {configuration.slug ? 'square-top' : ''} 
                {configuration.tkey ? 'square-bottom' : ''}"
				on:click={() => (configuration.deer = !configuration.deer)}>Deer</button
			>
			<button
				class="{configuration.tkey ? 'active' : ''} 
                {configuration.deer ? 'square-top' : ''} 
                {configuration.coyo ? 'square-bottom' : ''}"
				on:click={() => (configuration.tkey = !configuration.tkey)}>Turkey</button
			>
			<button
				class="{configuration.coyo ? 'active' : ''} 
                {configuration.tkey ? 'square-top' : ''} 
                {configuration.racc ? 'square-bottom' : ''}"
				on:click={() => (configuration.coyo = !configuration.coyo)}>Coyote</button
			>
			<button
				class="{configuration.racc ? 'active' : ''} 
                {configuration.coyo ? 'square-top' : ''}"
				on:click={() => (configuration.racc = !configuration.racc)}>Raccoon</button
			>
		</div>
	</section>
</main>

<style lang="scss">
	@import "$static/stylesheets/guideline";

	main {
		$panel-height: 477px;

		width: calc(100% - 100px);
		height: $panel-height;
		padding: 14px 18px;
		box-sizing: border-box;
		border-radius: 14px;

		position: fixed;
		bottom: 20px;
		left: 20px;
		overflow: hidden;

		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-direction: column;

		background-color: $black;
		z-index: 2;

		transition: transform 700ms $out-generic-expo;

		section {
			width: 100%;
			margin-top: 20px;

			h2 {
				font-weight: 500;
				font-size: 18px;
				color: $grey;
				letter-spacing: -0.45px;
			}

			&#animal {
				#selection-parent {
					position: relative;
					width: 100%;
					margin-top: 10px;

					display: flex;
					flex-direction: column;

					display: flex;
					border-radius: 6px;

					button {
						width: 100%;
						height: 50px;
						text-align: center;
						border-radius: 8px;

						&.active {
							background-color: $blue;
						}

						&.square-top {
							border-top-right-radius: 0px;
							border-top-left-radius: 0px;
						}
						&.square-bottom {
							border-bottom-right-radius: 0px;
							border-bottom-left-radius: 0px;
						}
					}
				}
			}

			&#hot {
				width: 100%;

				#selection-parent {
					position: relative;
					width: 100%;
					height: 50px;
					margin-top: 10px;

					display: flex;

					border: 1px solid $dark-grey;
					border-radius: 6px;

					#background {
						position: absolute;
						width: 50%;
						height: 100%;

						background-color: $blue;
						border-radius: 6px;
						z-index: -1;

						transition: transform 500ms $out-generic-expo;

						&.alt {
							transform: translateX(100%);
						}
					}

					button {
						height: 100%;
						width: 50%;
						border-radius: 0px;
						text-align: center;
						z-index: 1;
					}
				}
			}
		}

		hr {
			width: 36px;
			height: 5px;
			border-radius: 10px;
			background-color: $dark-grey;
			margin-bottom: 10px;
		}

		h1 {
			width: 100%;
			text-align: left;
			font-weight: 600;
			font-size: 28px;
			color: $light-grey;
			letter-spacing: -0.7px;
		}

		&.hidden {
			transform: translateY(calc($panel-height + 75px));
		}
	}
</style>
