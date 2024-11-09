<script>
  import { browser } from "$app/environment";
  import AuthFlow from "$lib/components/auth-flow.svelte";
  import storage from "$lib/storage";
  import { onMount } from "svelte";

	let imgSrc = $state("")

  onMount(() => {
	  if(browser) {
		let base64ImgUrl = storage.getLastGenerated();
		imgSrc = base64ImgUrl
	  }
  })
</script>
<div>Last Generated</div>
<img src={imgSrc} alt="Generated" style="width:50px;height:50px;" />
<AuthFlow />

<style>
</style>
