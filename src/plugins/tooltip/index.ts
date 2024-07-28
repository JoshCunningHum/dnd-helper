import { App, Directive, Plugin } from "vue";
import TooltipVue from "./components/index.vue";
import { PluginOptions, TooltipValue } from "./types";

export default {
    install: (app: App, options?: Partial<PluginOptions>) => {
        const { componentName = "Tooltip" } = options || {};

        const Tooltip: Directive<HTMLElement, TooltipValue> = (
            el,
            { value },
        ) => {
            if (!value) return;
            // Just add the data as dataobject
            el.dataset.__TOOLTIP__ = JSON.stringify(value);
        };

        app.directive("tip", Tooltip);
        app.component(componentName, TooltipVue);
    },
} satisfies Plugin;
