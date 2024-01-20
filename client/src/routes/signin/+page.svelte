<script lang="ts">
</script>

<main>
	<h1 id="title">GeoSlug <span>Account</span></h1>

	<button>
		<p>Sign in</p>
	</button>
</main>

<style lang="scss">
	@import "$static/stylesheets/guideline";

	main {
		width: 100%;
		height: calc(100vh - $urlbar-height);
		padding: 0px 20px;
		box-sizing: border-box;

		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		#title {
			font-size: 36px;
			font-weight: 500;
			letter-spacing: -0.9px;
			text-align: center;

			span {
				font-weight: 300;
			}
		}

		button {
			width: min(100%, 500px);
			height: 50px;
			background-color: $white;
			margin-top: 30px;

			p {
				width: 100%;
				text-align: center;
				color: $black;
			}
		}
	}
</style>
