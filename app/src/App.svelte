<script>
	export let meta;
	import '../style/style.css'
	import Hero from "./Hero.svelte";
	import Control from "./Control.svelte";
	document.title = meta.title
</script>
<svelte:head>
	<script defer src="https://kit.fontawesome.com/230002ca0f.js" crossorigin="anonymous"></script>
</svelte:head>
<Hero meta = {meta} ></Hero>
<Control meta = {meta} ></Control>

