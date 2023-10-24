import {Circle, CircleBudget, CircleBudgetPlannings, CircleUser} from "~/utils/types";
import {Ref} from "vue";

interface CircleUserCompose {
    isLoading: boolean,
    data: CircleUser[],
    selected: Circle | undefined,
    refreshSelected: Promise<void> | undefined,
    selectedCircleUser: CircleUser | undefined;
}

interface CircleBudgetCompose {
    isLoading: boolean,
    budget: CircleBudget | undefined,
    plannings: CircleBudgetPlannings[]

}

export const useCircleUsers = () => useState<CircleUserCompose>('useCircleUsers', () => {
    return {isLoading: false, data: [], selected: undefined, refreshSelected: undefined, selectedCircleUser: undefined}
}) as Ref<CircleUserCompose>;


export const useCircleBudget = () => useState<CircleBudgetCompose>('useCircleBudget', () => {
    return {isLoading: false, budget: undefined, plannings: []}
}) as Ref<CircleBudgetCompose>;
