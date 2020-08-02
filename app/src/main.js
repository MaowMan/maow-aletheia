import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		meta:{
			title:"神的語言翻譯器",
			subtitle:"By:MaowMan v0.1 2020/7/20",
			proxy:"https://cors-anywhere.herokuapp.com",
			server:"https://us-central1-maow-alethia.cloudfunctions.net/download"
		},
	}
});

export default app;