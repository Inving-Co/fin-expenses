import {Transaction} from "~/utils/types";

export const useTransactions = () => useState<{ isLoading: boolean, data: Transaction[], selected: Transaction | null }>('useTransactions', () => {
    return {isLoading: false, data: [], selected: null}
});
