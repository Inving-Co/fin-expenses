import {Ref} from "vue";

export const useLoading = () => useState<boolean>('useLoading', () => false) as Ref<boolean>;
