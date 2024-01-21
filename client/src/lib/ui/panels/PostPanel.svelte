<script lang="ts">
	import type { PostData } from "$route/+page.server";
	import { speciesColor, speciesName } from "$route/+page.svelte";
	import { createEventDispatcher, onMount } from "svelte";
	const disp = createEventDispatcher();
	const submitDisp = createEventDispatcher<{
		submit: { animal: string; count: number; lng: number; lat: number };
	}>();

	export let open: boolean;

	export let postData: PostData | undefined;

	let panelParent: HTMLElement;
	let initDragPosition: [number, number] = [0, 0];
	let currentDragPosition: [number, number] = [0, 0];
	let dragging: boolean = false;
	let dragTime: [number, number] = [0, 0];

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
			dragging = false;
			let diff = calcDistance(0, currentDragPosition[1] - initDragPosition[1]);
			dragTime[1] = performance.now();
			let dur = dragTime[1] - dragTime[0];
			let vel = (diff / dur) * 1000;

			if (currentDragPosition[1] > initDragPosition[1] && (diff > 200 || vel > 1000)) {
				closeSelf();
			}
		};
	};

	// post rating
	const thumbsUp = () => {
		currentPostRating = "1";
		if (postData) localStorage.setItem(postData.id, "1");
	};
	const thumbsDown = () => {
		currentPostRating = "-1";
		if (postData) localStorage.setItem(postData.id, "-1");
	};

	$: currentPostRating = postData ? localStorage.getItem(postData.id) : "";

	onMount(() => {
		setupPanelDragging();
	});
</script>

<main
	bind:this={panelParent}
	class={open ? "no-drag" : "no-drag hidden"}
	style={dragging
		? `transform: translateY(${Math.max(0, currentDragPosition[1] - initDragPosition[1])}px); transition: none;`
		: ""}
>
	<hr />
	<h1>Spotted Animals</h1>

	{#if postData}
		<section class="post">
			<section id="content">
				<img src={postData.image_url} alt="animal" />

				<section id="desc">
					<h2 id="name">{postData.name}</h2>
					<p id="animal">
						Spotted <span class={speciesColor[postData.type]}
							>{postData.count} {speciesName[postData.type][Math.min(postData.count - 1, 1)]}</span
						>
					</p>
					<p id="date">
						<span
							>{Math.ceil(Math.abs(Date.now() / 1000 - postData.timestamp) / (60 * 60 * 24))}</span
						> days ago
					</p>
				</section>
			</section>
			<section id="rating">
				<h2 id="title">Is this submission accurate?</h2>

				<div id="button-container">
					<button id="yes" class={currentPostRating === "1" ? "active" : ""} on:click={thumbsUp}
						><img src="/icons/thumbsup.svg" alt="" /></button
					>
					<button id="no" class={currentPostRating === "-1" ? "active" : ""} on:click={thumbsDown}
						><img src="/icons/thumbsdown.svg" alt="" /></button
					>
				</div>
			</section>
		</section>
	{/if}
</main>

<style lang="scss">
	@import "$static/stylesheets/guideline";

	main {
		$panel-height: 305px;

		width: calc(100% - 40px);
		height: $panel-height;
		padding: 14px 18px;
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

		.post {
			width: 100%;
			margin-top: 20px;
			display: flex;
			flex-direction: column;

			#content {
				display: flex;

				img {
					min-width: 130px;
					width: 130px;
					min-height: 130px;
					height: 130px;

					border-radius: 8px;
					object-fit: cover;
				}

				#desc {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: flex-start;
					margin-left: 17px;

					h2 {
						font-weight: 600;
						font-size: 24px;
						color: $light-grey;
						letter-spacing: -0.6px;
					}
					#animal,
					#date {
						font-weight: 400;
						font-size: 16px;
						color: $grey;
						letter-spacing: -0.2px;
					}
					#animal {
						margin-top: 7px;

						span {
							&.red {
								color: $map-red;
							}
							&.blue {
								color: $map-blue;
							}
							&.green {
								color: $map-green;
							}
							&.yellow {
								color: $map-yellow;
							}
							&.orange {
								color: $map-orange;
							}
						}
					}
					#date {
						margin-top: 0px;

						span {
							color: $light-grey;
						}
					}
				}
			}

			#rating {
				width: 100%;
				margin-top: 15px;

				#title {
					font-weight: 500;
					font-size: 15px;
					color: $grey;
					letter-spacing: -0.35px;
				}
				#button-container {
					width: 100%;
					height: 40px;
					margin-top: 7px;

					border: 1px solid $dark-grey;
					border-radius: 6px;
					overflow: hidden;

					display: flex;

					button {
						width: 50%;
						height: 100%;
						box-sizing: border-box;
						border-radius: 0px;

						display: flex;
						justify-content: center;
						align-items: center;

						&:first-child {
							border-right: 1px solid $dark-grey;
						}

						&:active {
							background-color: $dark-grey;

							img {
								opacity: 0.3;
							}
						}

						&.active {
							&#yes {
								background-color: $blue;
								img {
									opacity: 1;
								}
							}
							&#no {
								background-color: $dark-grey;
								img {
									opacity: 0.5;
								}
							}
						}

						img {
							height: 13px;
							opacity: 0.2;
						}
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
