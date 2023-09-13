import {Ref} from "vue";

export const useAmountVisibility = () => useState<boolean>('useAmountVisibility', () => false) as Ref<boolean>;
