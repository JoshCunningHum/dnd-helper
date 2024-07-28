<script setup lang="ts">
import ColorPicker from "primevue/colorpicker";
import InputNumber from "primevue/inputnumber";
import InputSwitch from "primevue/inputswitch";
import SelectButton from "primevue/selectbutton";
import Slider from "primevue/slider";
import Textarea from "primevue/textarea";
import { computed, inject, ref, Ref } from "vue";
import { QueryField } from "./types";
import TimePicker from "../../components/TimePicker.vue";
import File from "./File.vue";
import Custom from "./Custom.vue";
import Chips from "./Chips.vue";
import WYSWYG from "../WYSWYG/index.vue";

const props = defineProps<{
    field: QueryField;
}>();

const errors = inject<Ref<Record<string, string>>>(`query-errors`, ref({}));
const error = computed<string>(() =>
    props.field.key in errors.value ? errors.value[props.field.key] : "",
);
</script>

<template>
    <tr>
        <td class="label mt-1 py-2 pb-0 pr-3">{{ field.label }}</td>
        <td class="mt-1 flex flex-col py-2 pt-0.5">
            <InputNumber v-if="field.type === 'number'" v-model="field.value" />
            <Textarea
                v-else-if="field.type === 'textarea'"
                v-model="field.value"
            />
            <ColorPicker
                v-else-if="field.type === 'color'"
                v-model="field.value"
            />
            <Dropdown
                v-else-if="field.type === 'select'"
                v-model="field.value"
                :multiple="!!field.multiple"
                :options="field.options"
            />
            <SelectButton
                v-else-if="field.type === 'select-btn'"
                class="pb-1"
                v-model="field.value"
                :multiple="!!field.multiple"
                :options="field.options"
            />
            <TimePicker
                v-else-if="field.type === 'time'"
                v-model="field.value"
            />

            <div
                v-else-if="field.type === 'range'"
                class="flex items-center gap-4 pr-3"
            >
                <InputNumber class="!w-16" v-model="field.value" />
                <Slider
                    v-model="field.value"
                    :min="field.min"
                    :max="field.max"
                    :step="field.step"
                    class="flex-grow"
                />
            </div>
            <InputSwitch
                v-else-if="field.type === 'checkbox'"
                v-model="field.value"
            />
            <Chips
                v-else-if="field.type === 'chips'"
                v-model="field.value"
                :options="field.options"
                :empty-string="field.empty"
            />
            <File
                v-else-if="field.type === 'file'"
                v-model="field.value"
                :accept="field.accept"
                :multiple="field.multiple"
            />
            <WYSWYG
                v-else-if="field.type === 'wyswyg'"
                v-model="field.value"
                :placeholder="field.placeholder"
            />
            <Custom
                v-else-if="field.type === 'component'"
                v-model="field.value"
                :mount="field.mount"
            />
            <InputText
                v-else
                v-model="field.value"
                :placeholder="field.default"
            />
            <span v-if="error.length" class="h-0 text-xs text-red-400">{{
                error
            }}</span>
        </td>
    </tr>
</template>

<style lang="scss" scoped></style>
