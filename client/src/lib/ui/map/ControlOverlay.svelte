<script lang="ts">
	import { createEventDispatcher } from "svelte";
	const disp = createEventDispatcher();
	const photoDisp = createEventDispatcher<{ picture: { file: File | null; url: string | null } }>();

	export let opened = true;
	export let centered = true;

	const orient = () => disp("reorient");
	const toggleFilter = () => disp("toggleFilter");

	let cameraInput: HTMLInputElement;
	let imageUrl: string | null = null;

	const uploadPhoto = () => {
		const file = cameraInput.files ? cameraInput.files[0] : null;
		if (file) {
			imageUrl = URL.createObjectURL(file);
		} else {
			imageUrl = null;
		}

		// send the value of cameraInput to parent
		photoDisp("picture", { file, url: imageUrl });
	};
</script>

<main class={opened ? "" : "hidden"}>
	<button id="camera" on:click={() => cameraInput?.click()}>
		<input
			bind:this={cameraInput}
			on:change={uploadPhoto}
			type="file"
			accept="image/png, image/jpeg, image/heic"
			hidden
		/>
		<img src="/icons/camera.svg" />
	</button>

	<button id="recenter" on:click={orient}>
		<svg width="19px" height="19px" viewBox="0 0 19 19" version="1.1">
			<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g
					id="Screen-/-Filter-open"
					transform="translate(-341, -603)"
					stroke-linejoin="round"
					fill={centered ? "#EEEEEE" : "transparent"}
					fill-rule="nonzero"
					stroke="#EEEEEE"
					stroke-width="1.5"
				>
					<g id="Menu" transform="translate(323, 528.9)">
						<g id="Reorient" transform="translate(0, 56)">
							<path
								d="M34.8773681,19.2967391 L29.4711206,35.354452 L28.2500958,26.7492377 L19.8848367,26.7492377 L34.8773681,19.2967391 Z"
								id="Path"
							></path>
						</g>
					</g>
				</g>
			</g>
		</svg>
	</button>

	<button id="filter" on:click={toggleFilter}> <img src="/icons/layer.svg" /> </button>
</main>

<style lang="scss">
	@import "$static/stylesheets/guideline";

	main {
		position: fixed;
		bottom: 25px;
		right: 10px;
		z-index: 2;

		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		transition: transform 200ms $out-generic;

		button {
			position: relative;
			width: 55px;
			height: 55px;
			background-color: $black;

			display: flex;
			justify-content: center;
			align-items: center;

			border-radius: 8px;

			&:active {
				background-color: $dark-grey;
			}

			input {
				position: absolute;
				top: 0px;
				left: 0px;
				width: 100%;
				height: 100%;
			}

			img,
			svg {
				width: 18px;
				height: 18px;
			}

			&#camera {
				border-radius: 8px 8px 0px 0px;
				margin-bottom: 1px;
			}
			&#recenter {
				border-radius: 0px 0px 8px 8px;
				margin-bottom: 15px;
			}
		}

		&.hidden {
			transform: translate(80px, 0px);
		}
	}
</style>
