import {CircleUser} from "~/utils/types";

export const useCircleUsers = () => useState<{ isLoading: boolean, data: CircleUser[] }>('useCircleUsers', () => {
    return {isLoading: false, data: []}
});
