<script setup lang="ts">
import { useQuery } from "../../../hooks/query";
import * as yup from "yup";
import { QuerySchemaMeta } from "../../../lib/Query/types";
import randomColor from "../../../utils/randomColor";
import { useCharactersStore } from "../../../stores/characters";
import { storeToRefs } from "pinia";
import {
    createGlobalState,
    get,
    promiseTimeout,
    useMagicKeys,
} from "@vueuse/core";
import base64ToArrayBuffer from "../../../utils/base64ToArrayBuffer";

//#region Store
const character_store = useCharactersStore();
const { tags } = storeToRefs(character_store);

//#region Query
const { ask } = useQuery();

const add = async () => {
    await ask({
        title: "Add Character",
        approveText: "Add",
        backdropClosing: false,
        schema: yup.object({
            name: yup
                .string()
                .required(`Character name is required!`)
                .label("Name"),

            // Optionals
            token: yup
                .string()
                .label("Token")
                .meta({
                    type: "file",
                    accept: "image/*",
                } satisfies QuerySchemaMeta),
            tags: yup
                .array(yup.string().required())
                .label("Tags")
                .meta({
                    type: "chips",
                    options: tags.value,
                    empty: "No tags recommendations",
                } as QuerySchemaMeta),
            description: yup
                .string()
                .label(`Description`)
                .meta({
                    type: "wyswyg",
                    placeholder: `Write a description (Optional)`,
                } satisfies QuerySchemaMeta),
            color: yup
                .string()
                .optional()
                .label(`Color`)
                .default(randomColor().slice(1, -2))
                .meta({
                    type: "color",
                } as QuerySchemaMeta),
        }),
        then: async (data) => {
            const { name, color, description, tags: set_tags, token } = data;
            const blob = token && new Blob([base64ToArrayBuffer(token)]);
            await character_store.add({
                name,
                color,
                description,
                image: blob || undefined,
                tags: set_tags,
            });
        },
    });
};
</script>

<template>
    <Button
        @click="add"
        size="small"
        icon="pi pi-plus"
        class="rounded-s-none !bg-primary-500 !ring-0"
        :rounded="false"
    />
</template>

<style lang="scss" scoped></style>
