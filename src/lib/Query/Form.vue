<script setup lang="ts" generic="Schema extends Record<string, any>">
import {
    get,
    set,
    useArrayFilter,
    watchDeep,
    watchImmediate,
} from "@vueuse/core";
import { computed, provide, ref, toRaw, unref } from "vue";
import * as yup from "yup";
import Field from "./Field.vue";
import { QueryField, QueryInfer, isSchemaMeta } from "./types";

const props = defineProps<{
    schema: yup.ObjectSchema<Schema>;
    confirmText?: string;
    isSubmitting?: boolean;
}>();

const emits = defineEmits<{
    (e: "submit", state: QueryInfer<Schema>): void;
}>();

const fields = ref<QueryField[]>([]);
const state = ref<QueryInfer<Schema>>({} as QueryInfer<Schema>);
const hidden_fields = ref<string[]>([]);
watchDeep(fields, (fs) => {
    // @ts-ignore
    state.value = {} as QueryInfer<Schema>;
    const obj = fs.reduce<QueryInfer<Schema>>((obj, { key, value }) => {
        // @ts-expect-error TS can't keep up with my genius
        obj[key] = value;
        return obj;
    }, {} as QueryInfer<Schema>) as QueryInfer<Schema>;
    // @ts-ignore
    state.value = obj;

    // Check for hidden fields (hidden by show())
    hidden_fields.value.splice(0);
    Object.entries(props.schema.fields).forEach(([key, value]) => {
        const { meta } = value.spec;
        if (!isSchemaMeta(meta)) return;
        if (meta.show && !meta.show(obj)) hidden_fields.value.push(key);
    });
});

// Error Transformer
const transformYupErrorsIntoObject = (
    errors: yup.ValidationError,
): Record<string, string> => {
    const validationErrors: Record<string, string> = {};
    if (!errors.inner) return {};
    errors.inner.forEach((error: any) => {
        if (error.path !== undefined) {
            validationErrors[error.path] = error.errors[0];
        }
    });
    return validationErrors;
};
const errors = ref<Record<string, string>>({});
provide(`query-errors`, errors);
const hasNoErrors = computed(() => Object.keys(errors.value).length === 0);

// Validate on change
watchDeep(state, (v) => {
    try {
        props.schema.validateSync(v, { abortEarly: false });
        set(errors, {});
    } catch (e) {
        set(errors, transformYupErrorsIntoObject(e as yup.ValidationError));
    }
});

watchImmediate(
    () => props.schema,
    (schema) => {
        fields.value.splice(0);
        fields.value.push(
            ...Object.entries(schema.fields).map(([key, value]) => {
                const { meta, label, default: def, type: t } = value.spec;
                const oneofs = Array.from(value._whitelist);

                const field: QueryField = {
                    label: label || key,
                    key,
                    type: t || "text",
                    default: def,
                    value: def,
                };

                if (isSchemaMeta(meta)) {
                    // select" | "select-btn
                    if ("options" in meta) {
                        Object.assign(
                            field,
                            {
                                type: meta.type,
                                options: meta.options,
                            },
                            meta.type === "chips"
                                ? {
                                      empty: meta.empty,
                                      value: [],
                                  }
                                : {
                                      multiple: meta.multiple,
                                  },
                        );
                    } else if (meta.type === "range") {
                        Object.assign(field, {
                            type: meta.type,
                            min: meta.min || 0,
                            max: meta.max || 100,
                            step: meta.step || 1,
                        });
                    } else if (meta.type === "component") {
                        Object.assign(field, {
                            mount: meta.mount,
                            type: meta.type,
                        });
                    } else if (meta.type === "wyswyg") {
                        Object.assign(field, {
                            type: meta.type,
                            placeholder: meta.placeholder,
                        });
                    } else {
                        field.type = meta.type;
                    }
                } else if (oneofs.length) {
                    Object.assign(field, { type: "select", options: oneofs });
                } else if (value.type === "boolean") {
                    field.type = "checkbox"; // Might use switch idk
                }

                return field;
            }),
        );
    },
);

//#region Filtered Fields
const filtered_fields = useArrayFilter(
    fields,
    (f) => !hidden_fields.value.includes(f.key),
);

//#region Submit
const onSubmit = () => {
    if (!get(hasNoErrors)) return;
    const v = state.value;
    const sanitized = Object.fromEntries(
        //@ts-expect-error Generic Issues
        Object.entries(v).map(([k, v]) => [k, toRaw(v)]),
    );

    // Coerce Values
    const casted = props.schema.cast(sanitized);
    emits("submit", casted);
};
</script>

<template>
    <form class="flex flex-col pb-2" @submit.prevent="onSubmit">
        <div class="flex w-full flex-col px-4 pt-2">
            <table class="table-auto">
                <tbody>
                    <Field
                        v-for="(field, i) in filtered_fields"
                        :key="i"
                        :field="field"
                    />
                </tbody>
            </table>
        </div>
        <div class="flex justify-end gap-2 pt-2">
            <Button
                :disabled="!hasNoErrors"
                severity="success"
                type="submit"
                :loading="props.isSubmitting"
                :label="confirmText || 'Confirm'"
            />
        </div>
    </form>
</template>

<style lang="scss" scoped></style>
