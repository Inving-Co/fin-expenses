import {Record} from "~/utils/types";
import {Ref} from "vue";

interface TransactionCompose { isLoading: boolean, data: Record[], selected: Record | null }

export const useTransactions = () => useState<TransactionCompose>('useTransactions', () => {
    return {isLoading: false, data: [], selected: null}
}) as Ref<TransactionCompose>;
