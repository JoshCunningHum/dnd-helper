<script setup lang="ts">
import { set } from "@vueuse/core";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import OverlayPanel from "primevue/overlaypanel";
import { computed, ref, toValue, watch } from "vue";

InputText;

const model = defineModel<number>({ default: 72 });
const props = defineProps<{
	miliatary?: boolean;
}>();

//#region Input
const inp = ref<OverlayPanel>();

const hr = computed({
	get: () => ~~((model.value - (isPM.value ? 720 : 0)) / 60),
	set: (v) => {
		v = v < 0 ? 0 : v > 11 ? 11 : v;
		model.value = v * 60 + min.value + (isPM.value ? 720 : 0);
	},
});

const min = computed({
	get: () => model.value % 60,
	set: (v) => {
		v = v < 0 ? 0 : v > 59 ? 59 : v;
		model.value = hr.value * 60 + v + (isPM.value ? 720 : 0);
	},
});

const isPM = computed({
	get: () => model.value >= 720,
	set: (v) => {
		model.value = hr.value * 60 + min.value + (v ? 720 : 0);
	},
});
</script>

<template>
	<div class="root">
		<InputText
			class="w-full"
			@click="inp?.toggle"
			:value="`${hr === 0 ? 12 : hr}:${min.toString().padStart(2, '0')} ${
				isPM ? 'PM' : 'AM'
			}`"
			@keydown.prevent="() => {}" />

		<OverlayPanel
			ref="inp"
			:pt="{
				content: 'p-0',
			}">
			<div class="container">
				<input
					:max="12"
					:min="0"
					:value="hr === 0 ? 12 : hr"
					@change="e => {
						const value = Number((e.target as HTMLInputElement).value);
						hr = value === 12 ? 0 : value;
					}"
					tabindex="1"
					type="number"
					@click="(ev: MouseEvent) => (ev.target as HTMLInputElement).select()"
					class="number" />
				<div class="spinner">
					<button
						class="btn"
						tabindex="-1"
						@click="hr++">
						⯅
					</button>
					<button
						class="btn"
						tabindex="-1"
						@click="hr--">
						⯆
					</button>
				</div>
				<span class="divider">:</span>
				<input
					:max="59"
					:min="0"
					v-model="min"
					tabindex="1"
					type="number"
					@click="(ev: MouseEvent) => (ev.target as HTMLInputElement).select()"
					class="number" />
				<div class="spinner">
					<button
						class="btn"
						tabindex="-1"
						@click="min++">
						⯅
					</button>
					<button
						class="btn"
						tabindex="-1"
						@click="min--">
						⯆
					</button>
				</div>
				<button
					tabindex="1"
					class="number btn"
					@click="isPM = !isPM">
					{{ isPM ? "PM" : "AM" }}
				</button>
			</div>
		</OverlayPanel>
	</div>
</template>

<style scoped>
.root {
}

.container {
	display: flex;
	border: rgb(var(--surface-700)) 1px solid;
	border-radius: 5px;
	overflow: hidden;
}

input[type="number"]::-webkit-inner-spin-button {
	display: none;
}

.divider {
	height: 3rem;
	display: flex;
	align-items: center;
}

.number {
	background-color: rgb(var(--surface-900));
	caret-color: transparent;
	height: 3rem;
	width: 3rem;
	text-align: center;
}

.number:focus {
	outline: 2px solid transparent;
	outline-offset: 2px;
}

.spinner {
	display: flex;
	flex-direction: column;
}

.spinner .btn {
	font-size: 0.75em;
	height: 1.5rem;
	padding: 0px 1rem;
}

.btn {
	background-color: rgb(var(--surface-700));
}
.btn:hover {
	background-color: rgb(var(--surface-800));
}
.btn:active {
	background-color: rgb(var(--surface-900));
}
.btn:focus {
	border: rgb(var(--surface-400)) 2px solid;
	border-radius: 5px;
}
</style>
