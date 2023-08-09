export const useAuth = () => useState<{ userId: string | undefined, email: string | undefined } | null>('useAuth', () => null);
