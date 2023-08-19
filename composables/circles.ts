import {Circle, CircleUser} from "~/utils/types";
import {Ref} from "vue";

interface CircleUserCompose { isLoading: boolean, data: CircleUser[], selected: Circle | null }

export const useCircleUsers = () => useState<CircleUserCompose>('useCircleUsers', () => {
    return {isLoading: false, data: [], selected: null}
}) as Ref<CircleUserCompose>;
