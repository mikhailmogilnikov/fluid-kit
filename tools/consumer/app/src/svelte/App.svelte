<script lang="ts">
  import Scene from "./Scene.svelte";

  let shown = $state(true);
  let lines = $state<string[]>([]);
  const log = (line: string) => lines.push(line);
</script>

<button data-testid="toggle" onclick={() => (shown = !shown)}>Toggle</button>
<pre data-testid="log">{lines.join("\n")}</pre>
{#if shown}
  <Scene {log} />
{/if}
