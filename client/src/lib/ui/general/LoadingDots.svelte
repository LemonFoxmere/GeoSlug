<script lang="ts">
	import { onMount } from "svelte";

	let dots = 0;

	onMount(() => {
		setInterval(() => {
			dots++;
			dots %= 3;
		}, 400);
	});
</script>

{#each Array(dots + 1) as _}
	•
{/each}
