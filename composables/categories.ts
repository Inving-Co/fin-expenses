import {Category, CircleUser} from "~/utils/types";

export const useCategories = () => useState<{ isLoading: boolean, data: Category[] }>('useCategories', () => {
    return { isLoading: false, data: [] }
});
