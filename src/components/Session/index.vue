<script setup lang="ts">
import { ref } from "vue";
import WYSWYG from "../../lib/WYSWYG/index.vue";

const desc = ref<string>("");
</script>

<template>
    <div class="flex flex-grow flex-col gap-5 px-3 py-2">
        <div>
            <WYSWYG v-model="desc" />
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
