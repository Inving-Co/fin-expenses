import {Category, CircleUser} from "~/utils/types";
import {Ref} from "vue";

interface CategoriesCompose { isLoading: boolean, data: Category[] }

export const useCategories = () => useState<CategoriesCompose>('useCategories', () => {
    return { isLoading: false, data: [] }
}) as Ref<CategoriesCompose>;
