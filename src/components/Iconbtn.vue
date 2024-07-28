<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string;
    noRipple?: boolean;
  }>(),
  {
    icon: "pi-search",
  },
);
</script>

<template>
  <i
    v-if="!noRipple"
    class="pi cursor-pointer rounded-full p-1 text-xl text-surface-400 hover:text-surface-300"
    :class="icon"
    v-ripple
  />
  <i
    v-else
    class="pi cursor-pointer rounded-full p-1 text-xl text-surface-400 hover:text-surface-300"
    :class="icon"
  />
</template>

<style lang="scss" scoped></style>
