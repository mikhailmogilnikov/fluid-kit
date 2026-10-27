<script lang="ts">
  import { Glass } from "../../src/svelte/index.js";

  let { highlight }: { highlight: boolean } = $props();
</script>

<Glass {highlight}>Plain</Glass>
