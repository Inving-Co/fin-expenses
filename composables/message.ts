import {Ref} from "vue";

interface MessagesCompose { role: string, content: string };
export const useMessages = () => useState<MessagesCompose[]>('useMessages', () => []) as Ref<MessagesCompose[]>;
