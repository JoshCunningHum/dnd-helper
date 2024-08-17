<script setup lang="ts">
import { ref } from "vue";
import WYSWYG from "../../lib/WYSWYG/index.vue";
import CascadeSelect from "primevue/cascadeselect";

const options = [
    {
        name: "Australia",
        code: "AU",
        options: [
            {
                name: "New South Wales",
                options: [
                    { cname: "Sydney", code: "A-SY" },
                    { cname: "Newcastle", code: "A-NE" },
                    { cname: "Wollongong", code: "A-WO" },
                ],
            },
            {
                name: "Queensland",
                options: [
                    { cname: "Brisbane", code: "A-BR" },
                    { cname: "Townsville", code: "A-TO" },
                ],
            },
        ],
    },
    {
        name: "Canada",
        code: "CA",
        options: [
            {
                name: "Quebec",
                options: [
                    { cname: "Montreal", code: "C-MO" },
                    { cname: "Quebec City", code: "C-QU" },
                ],
            },
            {
                name: "Ontario",
                options: [
                    { cname: "Ottawa", code: "C-OT" },
                    { cname: "Toronto", code: "C-TO" },
                ],
            },
        ],
    },
    {
        name: "California",
        options: [
            { cname: "Los Angeles", code: "US-LA" },
            { cname: "San Diego", code: "US-SD" },
            { cname: "San Francisco", code: "US-SF" },
        ],
    },
    {
        name: "Florida",
        options: [
            { cname: "Jacksonville", code: "US-JA" },
            { cname: "Miami", code: "US-MI" },
            { cname: "Tampa", code: "US-TA" },
            { cname: "Orlando", code: "US-OR" },
        ],
    },
    {
        name: "Texas",
        options: [
            { cname: "Austin", code: "US-AU" },
            { cname: "Dallas", code: "US-DA" },
            { cname: "Houston", code: "US-HO" },
        ],
    },
];
const value = ref();
</script>

<template>
    <div class="flex flex-grow flex-col gap-5 px-3 py-2">
        <div>
            <CascadeSelect
                v-model="value"
                :options="options"
                :optionGroupChildren="['options', 'options']"
                optionLabel="cname"
                optionGroupLabel="name"
            />
        </div>
        <div v-tip="`Parent Tooltip`">
            Parent
            <div v-tip="`Child Tooltip`">child</div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
