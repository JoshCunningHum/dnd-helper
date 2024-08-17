<script setup lang="ts">
import { storeToRefs } from "pinia";
import Query from "./lib/Query/index.vue";
import Screen from "./components/Screen.vue";
import SideMenu from "./components/Sidebar/index.vue";
import { useMenuStore, MenuItem } from "./stores/menu";
import { useConfigStore } from "./stores/config";
import { provide, ref, watch } from "vue";
import { set } from "@vueuse/core";
import TriggerViewModal from "@/components/TriggerViewer/Modal.vue";
import { State } from "./types/States";

// Initilize Config First
const configStore = useConfigStore();
const { config } = storeToRefs(configStore);

const menuStore = useMenuStore();
const { menu, menus } = storeToRefs(menuStore);

// Handle Global Search
const last_menu = ref<MenuItem>();
watch(menu, (_, last) => set(last_menu, last));

// Handle Editing of State Triggers Opening Modal
const stateToEdit = ref<State | undefined>();
const startStateEdit = (state: State) => set(stateToEdit, state);
provide("editStateTriggers", startStateEdit);
</script>

<template>
    <Screen class="relative -z-0 flex overflow-hidden bg-surface-800 text-surface-50">
        <SideMenu :items="menus" v-model="menu" />
        <component
            v-if="!!menu.component || (!!last_menu && last_menu.component)"
            :is="menu.component || last_menu?.component"
            class="-z-10"
        />
        <!-- All Popups and Dialogs -->
        <Toast />
        <Query />
        <TriggerViewModal v-model:state="stateToEdit" />
        <Tooltip />
    </Screen>
</template>

<style lang="scss" scoped></style>
