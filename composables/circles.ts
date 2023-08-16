import {Circle, CircleUser} from "~/utils/types";

export const useCircleUsers = () => useState<{ isLoading: boolean, data: CircleUser[], selected: Circle | null }>('useCircleUsers', () => {
    return {isLoading: false, data: [], selected: null}
});
