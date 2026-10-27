<script lang="ts">
  import { Glass } from "../../src/svelte/index.js";
</script>

<Glass interactive class="mine">
  {#snippet child({ props })}<button {...props} type="button">Follow</button>{/snippet}
</Glass>
