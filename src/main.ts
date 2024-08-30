import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import { GesturePlugin } from "@vueuse/gesture";

// Fonts
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/martian-mono";

import "./assets/base.css";
import "./assets/style.css";
import "@/assets/theme.scss";
import App from "./App.vue";

//@ts-ignore
import Wind from "./assets/presets/wind";
//@ts-ignore
import Aura from "./assets/presets/aura";
import "primeicons/primeicons.css";
import StyleClass from "primevue/styleclass";
import ConfirmationService from "primevue/confirmationservice";
import BadgeDirective from "primevue/badgedirective";
import Ripple from "primevue/ripple";

//#region PrimeVue Components
import Dropdown from "primevue/dropdown";
import FloatLabel from "primevue/floatlabel";
import InputGroup from "primevue/inputgroup";
import Button from "primevue/button";
import Toast from "primevue/toast";
import ConfirmPopup from "primevue/confirmpopup";
import ConfirmDialog from "primevue/confirmdialog";
import InputText from "primevue/inputtext";
import ButtonGroup from "primevue/buttongroup";
import FocusTrap from "primevue/focustrap";

//#region Own Components
import Fill from "./components/Fill.vue";
import Empty from "./components/Empty.vue";
import Screen from "./components/Screen.vue";
import tooltip from "./plugins/tooltip";

//#endregion

const pinia = createPinia();

const app = createApp(App);

app.use(GesturePlugin);
app.use(PrimeVue, { unstyled: true, pt: Wind, ripple: true });
app.use(ConfirmationService);
app.use(pinia);
app.use(tooltip);

app.component("Dropdown", Dropdown);
app.component("FloatLabel", FloatLabel);
app.component("InputGroup", InputGroup);
app.component("Button", Button);
app.component("ButtonGroup", ButtonGroup);
app.component("Toast", Toast);
app.component("ConfirmPopup", ConfirmPopup);
app.component("ConfirmDialog", ConfirmDialog);
app.component("InputText", InputText);
app.component("Fill", Fill);
app.component("Empty", Empty);
app.component("Screen", Screen);

app.directive("styleclass", StyleClass);
app.directive("focustrap", FocusTrap);
app.directive("ripple", Ripple);
app.directive("badge", BadgeDirective);
app.mount("#app");
