<script lang="ts">
	import type { Color } from "$lib/client/types/color";
    import { tick } from "svelte";

	export let size: number;
	export let color: Color;

	export let open: boolean = false;

	function onOut(node: HTMLDivElement, { duration }: any): any {
		setTimeout(() => {
			node.classList.add("lock-css-transition")
		}, duration)

		return { duration: 0 }
	}
</script>

<div out:onOut={{}} class="wrap" class:open style="width: {size}px; height: {size}px">
	<svg class="base" fill="var(--c-{color})" height={size} width={size} viewBox="0 0 330 330" xml:space="preserve">
		<g transform="matrix(1, 0, 0, 1, 0, 5.551115123125783e-17)">
			<path id="XMLID_510_" d="M 65 330 L 265 330 C 273.284 330 280 323.284 280 315 L 280 145 C 280 136.716 273.284 130 265 130 L 80 130 L 65 130 C 56.716 130 50 136.716 50 145 L 50 315 C 50 323.284 56.716 330 65 330 Z M 180 234.986 L 180 255 C 180 263.284 173.284 270 165 270 C 156.716 270 150 263.284 150 255 L 150 234.986 C 143.932 230.421 140 223.162 140 215 C 140 201.215 151.215 190 165 190 C 178.785 190 190 201.215 190 215 C 190 223.162 186.068 230.421 180 234.986 Z"/>
		</g>
	</svg>
	
	<svg class="hook" fill="var(--c-{color})" height={size} width={size} viewBox="0 0 330 330" xml:space="preserve">
		<g transform="matrix(1, 0, 0, 1, 2.842170943040401e-14, 0)">
			<path id="XMLID_510_2" d="M 80 85 L 250 85 C 250 38.131 211.869 0 165 0 C 118.131 0 80 38.131 80 85 Z M 110 85 C 110 54.673 134.673 30 165 30 C 195.327 30 220 54.673 220 85 L 110 85 Z"/>
			<rect x="80" y="84.881" width="30" height="46" style="stroke: rgb(0, 0, 0); paint-order: fill; stroke-width: 0px;"/>
			<rect x="220" y="84.143" width="30" height="214.83" style="stroke: rgb(0, 0, 0); paint-order: fill; stroke-width: 0px;"/>
		</g>
	</svg>
</div>

<style>
	:global(.lock-css-transition) > .base {
		animation: unlockBottom 0.5s forwards ease-in-out;
	}
	:global(.lock-css-transition) > .hook {
		animation: unlockTop 0.5s forwards ease-in-out;
	}

	@keyframes unlockBottom {
		0% {
			top: 2.5px;
		}

		100% {
			top: 100px;
		}
	}

	@keyframes unlockTop {
		0% {
			top: -2.5px;
		}

		100% {
			top: -100px;
		}
	}

	.wrap {
		position: relative;
	}
	
	.base {
		position: absolute;
		top: 0px;
		left: 0;
		
		transition: top 0.2s ease-in-out;
	}
	
	.hook {
		position: absolute;
		top: 0px;
		left: 0;

		transition: top 0.2s ease-in-out;
	}

	.open > .hook {
		top: -2.5px;
	}

	.open > .base {
		top: 2.5px;
	}
</style>