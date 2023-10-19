import {Ref} from "vue";

interface AuthCompose { userId: string | undefined, email: string | undefined };
export const useAuth = () => useState<AuthCompose | undefined>('useAuth', () => undefined) as Ref<AuthCompose | undefined>;
