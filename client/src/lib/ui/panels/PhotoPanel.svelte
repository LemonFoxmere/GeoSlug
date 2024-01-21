<script lang="ts" context="module">
	import LoadingDots from "./../general/LoadingDots.svelte";
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
	import type { PostData, species } from "$route/+page.server";

	import { FIREBASE_CONFIG } from "$lib/@const/dynamic.env";
	import { initializeApp } from "firebase/app";
	import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
	import { createEventDispatcher, onMount } from "svelte";
	const disp = createEventDispatcher();
	const submitDisp = createEventDispatcher<{
		submit: { post: PostData };
	}>();

	export let open: boolean;
	export let imgFile: File;
	export let imgUrl: string;

	let panelParent: HTMLElement;
	let initDragPosition: [number, number] = [0, 0];
	let currentDragPosition: [number, number] = [0, 0];
	let dragging: boolean = false;
	let dragTime: [number, number] = [0, 0];

	let uploading: boolean;

	const calcDistance = (x: number, y: number): number => {
		return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	};

	const closeSelf = () => disp("close");

	const setupPanelDragging = () => {
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
		panelParent.ontouchend = () => {
			dragging = sliderDragging = false;
			let diff = calcDistance(0, currentDragPosition[1] - initDragPosition[1]);
			dragTime[1] = performance.now();
			let dur = dragTime[1] - dragTime[0];
			let vel = (diff / dur) * 1000;

			if (currentDragPosition[1] > initDragPosition[1] && (diff > 200 || vel > 1000)) {
				closeSelf();
			}
		};
	};

	// dropdown
	let dropdownElement: HTMLSelectElement;

	// slider
	let maxCount = 10;
	let currentCount = 2;
	let previousCount = currentCount;

	let sliderContainer: HTMLDivElement;
	let sliderDragging = false;

	const setupSliderDragging = () => {
		sliderContainer.ontouchstart = (e) => {
			e.stopPropagation();

			initDragPosition = [e.touches[0].clientX, e.touches[0].clientY];
			dragging = sliderDragging = false;
		};
		sliderContainer.ontouchmove = (e) => {
			e.preventDefault();
			e.stopPropagation();

			currentDragPosition = [e.touches[0].clientX, e.touches[0].clientY];
			let delta: number = calcDistance(0, e.touches[0].clientX - initDragPosition[0]);
			let signedDelta: number = e.touches[0].clientX - initDragPosition[0];

			if (!dragging && delta > 10) {
				// exceed drag threshold
				dragging = sliderDragging = true;
				// reset initial drag position
				initDragPosition = [e.touches[0].clientX, e.touches[0].clientY];
				previousCount = currentCount;
			}

			if (dragging) {
				currentCount = Math.max(
					1,
					Math.min(maxCount, previousCount + Math.floor(signedDelta / 30))
				);
			}
		};
		sliderContainer.ontouchend = (e) => {
			dragging = sliderDragging = false;

			previousCount = currentCount;
		};
	};

	// Initialize Firebase
	const app = initializeApp(FIREBASE_CONFIG);

	async function submitPhoto(animal: species, count: number, lng: number, lat: number) {
		uploading = true;

		// Create a root reference
		const storage = getStorage(app);
		const storageRef = ref(
			storage,
			`animalimages/${crypto.randomUUID()}.${imgFile.name.split(".").pop()}`
		);

		let url: string;

		// Upload the file to the defined Firebase Storage reference
		try {
			const snapshot = await uploadBytes(storageRef, imgFile);
			// After a successful upload, you can get the URL of the uploaded file
			url = await getDownloadURL(snapshot.ref);
		} catch (err) {
			console.error("Upload failed", err);
			uploading = false;
			return;
		}

		// upload all data to firestore
		const newPost: PostData = {
			id: crypto.randomUUID(),
			name: "Lemon Foxmere",
			type: animal,
			lat: lat,
			lng: lng,
			count: count,
			image_url: url,
			timestamp: Date.now() / 1000 // format in seconds
		};
		let res = await fetch("/api/store/post", {
			method: "POST",
			body: JSON.stringify({
				payload: newPost
			}),
			headers: {
				"content-type": "application/json"
			}
		});
		if (!res.ok) {
			alert("Failed to upload photo. Please try again later.");
			uploading = false;
			return;
		}

		return newPost;
	}

	const onSubmit = () => {
		// get lng and lat from user's device
		let lng = 0;
		let lat = 0;

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					lng = position.coords.longitude;
					lat = position.coords.latitude;

					const newPost = await submitPhoto(
						dropdownElement.value as species,
						currentCount,
						lng,
						lat
					);

					if (!newPost) {
						alert("Failed to upload photo. Please try again later.");
						return;
					}

					submitDisp("submit", {
						post: newPost
					});
					uploading = false;

					// animate the card flying out
					panelParent.style.pointerEvents = "none";
					panelParent.style.transform = "translateY(-900px) scale(0.1, 2)";
					panelParent.style.transition = "transform 400ms cubic-bezier(0.55, 0, 0.675, 0.19)";

					setTimeout(() => {
						panelParent.style.transition = "none";

						setTimeout(() => {
							panelParent.style.transform = "";
							panelParent.style.pointerEvents = "";
						}, 0);
					}, 500);
				},
				(err) => {
					alert(
						`Please enable geolocation service in your browser to submit a photo. Error: ${err}`
					);
				},
				{
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0
				}
			);
		} else {
			alert("Your browser does not support geolocation. Cannot submit photo.");
		}

		URL.revokeObjectURL(imgUrl);
	};

	onMount(() => {
		setupPanelDragging();
		setupSliderDragging();
	});
</script>

<main
	bind:this={panelParent}
	class={open ? "no-drag" : "no-drag hidden"}
	style={dragging && !sliderDragging
		? `transform: translateY(${Math.max(0, currentDragPosition[1] - initDragPosition[1])}px); transition: none;`
		: ""}
>
	<hr />

	{#if imgUrl}
		<img id="main-photo" src={imgUrl} alt="" />
	{:else}
		<div id="main-photo-placeholder"></div>
	{/if}

	<section id="options">
		<section id="animal">
			<h2>Animal</h2>

			<select bind:this={dropdownElement} name="animals">
				<option value="slug">Banana Slug</option>
				<option value="deer">Deer</option>
				<option value="tkey">Turkey</option>
				<option value="coyo">Coyote</option>
				<option value="racc">Raccoon</option>
			</select>
		</section>

		<section id="count">
			<h2>Count</h2>

			<div bind:this={sliderContainer} id="slider-container">
				<div id="background" style="transform: scaleX({currentCount / maxCount})" />
				<p>{currentCount}</p>
			</div>
		</section>
	</section>

	<button id="submit" on:click={onSubmit}>
		{#if uploading}
			<LoadingDots />
		{:else}
			Submit Photo
		{/if}
	</button>
</main>

<style lang="scss">
	@import "$static/stylesheets/guideline";

	main {
		$panel-height: 600px;

		width: calc(100% - 40px);
		height: $panel-height;
		padding: 0px 0px 20px 0px;
		box-sizing: border-box;
		border-radius: 14px;

		position: fixed;
		bottom: 20px;
		left: 20px;
		overflow: scroll;

		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-direction: column;

		background-color: $black;
		z-index: 2;

		transition: transform 700ms $out-generic-expo;

		#main-photo-placeholder {
			width: 100%;
			height: auto;
			aspect-ratio: 1/1.15;
		}

		#main-photo {
			width: 100%;
			height: auto;
			aspect-ratio: 1/1.15;

			object-fit: cover;
		}

		#submit {
			width: calc(100% - 36px);
			height: 50px;
			margin-top: 20px;
			background-color: $blue;
			text-align: center;
		}

		#options {
			width: 100%;
			margin-top: 25px;

			display: flex;

			h2 {
				font-weight: 500;
				font-size: 18px;
				color: $grey;
				letter-spacing: -0.45px;
			}

			#count {
				width: 100%;
				margin: 0px 18px 0px 13px;
				box-sizing: border-box;

				display: flex;
				flex-direction: column;

				#slider-container {
					position: relative;
					width: 100%;
					height: 50px;

					margin-top: 10px;
					overflow: hidden;

					border: 1px solid $dark-grey;
					border-radius: 8px;

					transition: transform 700ms $out-generic-expo;

					&:active {
						transform: scale(1.1);
					}

					#background {
						position: absolute;
						width: 100%;
						height: 100%;

						transition: transform 700ms $out-generic-expo;

						background-color: $blue;
						transform-origin: left;
					}

					p {
						position: absolute;
						top: 0;
						left: 0;

						width: 100%;
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: center;

						z-index: 1;
					}
				}
			}

			#animal {
				width: 130px;
				min-width: 130px;
				margin-left: 18px;
				box-sizing: border-box;

				display: flex;
				flex-direction: column;

				select {
					appearance: none;

					width: 100%;
					height: 50px;
					margin-top: 10px;

					background-color: transparent;
					border: 1px solid $dark-grey;
					border-radius: 8px;

					display: flex;
					justify-content: center;
					align-items: center;

					font-family: "Outfit", system-ui, Helvetica, sans-serif;
					font-size: 16px;
					font-weight: 400;
					letter-spacing: -0.37px;
					color: $light-grey;
					text-align-last: center;
				}
			}
		}

		hr {
			position: absolute;
			top: 14px;

			width: 36px;
			height: 5px;
			border-radius: 10px;
			background: transparent;

			backdrop-filter: blur(50px) saturate(0) contrast(5) invert(1);
			-webkit-backdrop-filter: blur(50px) saturate(0) contrast(5) invert(1);
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
