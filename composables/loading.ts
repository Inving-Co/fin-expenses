import {Ref} from "vue";

export const useLoading = () => useState<boolean>('useLoading', () => false) as Ref<boolean>;
export const useDarkMode = () => useState<boolean>('useDarkMode', () => false) as Ref<boolean>;
