<script setup lang="ts">
import { ref } from "vue";
import Scene from "./Scene.vue";

const shown = ref(true);
const lines = ref<string[]>([]);
const log = (line: string) => lines.value.push(line);
</script>

<template>
  <button data-testid="toggle" @click="shown = !shown">Toggle</button>
  <pre data-testid="log">{{ lines.join("\n") }}</pre>
  <Scene v-if="shown" :log="log" />
</template>
