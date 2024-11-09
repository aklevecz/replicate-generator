<script>
	import { onDestroy, onMount } from 'svelte';
	import Raptor from './raptor.svelte';

	let size = $state(50);

	/** @type {*} */
	let interval = null;
	onMount(() => {
		function animate() {
			size = Math.floor(Math.random() * 100);
		}
		interval = setInterval(() => {
			animate();
		}, 1000);
		setTimeout(() => animate(), 10);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<Raptor {size} />
