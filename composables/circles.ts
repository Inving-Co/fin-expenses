import {Circle, CircleUser} from "~/utils/types";
import {Ref} from "vue";

interface CircleUserCompose {
    isLoading: boolean,
    data: CircleUser[],
    selected: Circle | undefined,
    refreshSelected: Promise<void> | undefined,
    selectedCircleUser: CircleUser | undefined;
}

export const useCircleUsers = () => useState<CircleUserCompose>('useCircleUsers', () => {
    return {isLoading: false, data: [], selected: undefined, refreshSelected: undefined, selectedCircleUser: undefined}
}) as Ref<CircleUserCompose>;
