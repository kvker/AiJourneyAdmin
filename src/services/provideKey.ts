import type { InjectionKey, Ref } from "vue";

export const UiStatusMapKey = Symbol('globalStatus') as InjectionKey<Ref<UiStatusMap>>