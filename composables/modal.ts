import {Ref} from "vue";

export const useModal = () => useState<boolean>('useModal', () => false) as Ref<boolean>;
