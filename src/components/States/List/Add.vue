<script setup lang="ts">
import { storeToRefs } from "pinia";
import * as yup from "yup";
import { useQuery } from "../../../hooks/query";
import { QuerySchemaMeta } from "../../../lib/Query/types";
import { useCharactersStore } from "../../../stores/characters";
import { useStatesStore } from "../../../stores/states";
import { State, StateData, StateType } from "../../../types/States";
import enumToArray from "../../../utils/enumToArray";

const stateStore = useStatesStore();
const characterStore = useCharactersStore();
const { tags, characters } = storeToRefs(characterStore);

const { ask } = useQuery();
const add = async () => {
    const state_types = enumToArray(StateType);

    await ask({
        title: "Add State",
        approveText: "Add",
        backdropClosing: false,
        schema: yup.object({
            name: yup.string().required(`State name is required`).label("Name"),

            attachType: yup
                .string()
                .required(`Choose an attachment type`)
                .oneOf(["Tag", "Character"])
                .label(`Attach To`)
                .meta({
                    type: "select-btn",
                    options: ["Tag", "Character"],
                } as QuerySchemaMeta),
            attachTags: yup
                .array(yup.string().required())
                .label(" ")
                .when("attachType", {
                    is: "Tag",
                    then: (schema) => schema.min(1, "Choose at least 1 tag"),
                })
                .default([])
                .meta({
                    type: "chips",
                    options: tags.value,
                    empty: `No recommendation's`,
                    show: (obj) => obj.attachType === "Tag",
                } as QuerySchemaMeta),
            attachChar: yup
                .number()
                .label(" ")
                .when("attachType", {
                    is: "Character",
                    then: (schema) => schema.required(`Choose a character to attached to`),
                })
                .meta({
                    type: "select",
                    options: characters.value,
                    optionLabel: "name",
                    optionValue: "id",
                    show: (obj) => obj.attachType === "Character",
                } as QuerySchemaMeta),
            type: yup
                .string()
                .label(`Type`)
                .required(`Choose a state type`)
                .oneOf(state_types)
                .meta({
                    type: "select-btn",
                    options: state_types,
                } as QuerySchemaMeta),
            initialNumber: yup
                .number()
                .label(`Initial Value`)
                .nullable()
                .meta({
                    type: "number",
                    show: (obj) => obj.type === state_types[0],
                } as QuerySchemaMeta),
            initialString: yup
                .string()
                .label(`Initial Value`)
                .nullable()
                .meta({
                    show: (obj) => obj.type === state_types[2],
                } as QuerySchemaMeta),
            initialBool: yup
                .bool()
                .label(`Initial Value`)
                .nullable()
                .default(false)
                .meta({
                    type: "checkbox",
                    show: (obj) => obj.type === state_types[1],
                } as QuerySchemaMeta),
            min: yup
                .number()
                .label("Minimum")
                .nullable()
                .meta({
                    show: (obj) => obj.type !== state_types[1],
                    type: "number",
                } as QuerySchemaMeta),
            max: yup
                .number()
                .label("Maximum")
                .nullable()
                .meta({
                    type: "number",
                    show: (obj) => obj.type !== state_types[1],
                } as QuerySchemaMeta),
        }),
        then: async (data) => {
            const args: StateData = { type: StateType[data.type] };
            switch (args.type) {
                case StateType.Boolean:
                    args.initial = data.initialBool || false;
                    break;
                case StateType.Number:
                    args.initial = data.initialNumber || undefined;
                    args.min = data.min || undefined;
                    args.max = data.max || undefined;
                    break;
                case StateType.String:
                    args.initial = data.initialString || undefined;
                    args.min = data.min || undefined;
                    args.max = data.max || undefined;
                    break;
            }
            const char = characters.value.find((c) => c.id === data.attachChar);
            const attached: State["attached"] =
                data.attachType === "Tag" ? data.attachTags : char || characters.value[0];

            await stateStore.add({
                name: data.name,
                attached: attached,
                data: args,
                triggers: [],
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
