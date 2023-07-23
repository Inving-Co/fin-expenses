export interface ElementEvent {
    show: () => void,
    hide: () => void,
    toggle: () => void,
}

export interface EditableTransaction {
    description: string,
    amount: number | null,
    id: number | null,
    date: string,
    categoryId: number | null
}
export interface Transaction {
    id: number
    amount: number
    description: string
    date: string
    categoryId: number
    createdAt: string
    updatedAt: string
    userId?: number
    category: Category
}

export interface Category {
    id: number
    name: string
    color?: string
    createdAt: string
    updatedAt: string
}
