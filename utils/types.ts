export interface ElementEvent {
    show: () => void,
    hide: () => void,
    toggle: () => void,
}

export interface EditableTransaction {
    description: string,
    amount: number | null,
    id: string | null,
    date: string,
    categoryId: number | null
}
export interface Transaction {
    id: string
    amount: number
    description: string
    date: string
    categoryId: number
    createdAt: string
    updatedAt: string
    userId?: number
    category: Category
    isEditMode?: boolean
}

export interface Category {
    id: string
    name: string
    color?: string
    createdAt: string
    updatedAt: string
    checked?: boolean
    edited?: boolean
    userId?: string
    circleId?: string
}

export interface Circle {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    userId?: string
    circleUsers: CircleUser[]
}

export interface CircleUser {
    id: string
    userId: string
    createdAt: string
    updatedAt: string
    receiveReport: boolean
}
