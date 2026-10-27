<!--
  @component
  A line between items, passed over by the finger and the keys.
-->
<script lang="ts">
  import { mergeProps, type PartProps } from "@fluidkit/core/svelte";

  let { child, children, ...rest }: PartProps = $props();

  const merged = $derived(mergeProps({ role: "separator" }, rest));
</script>

{#if child}
  {@render child({ props: merged })}
{:else}
  <div {...merged}>{@render children?.()}</div>
{/if}
