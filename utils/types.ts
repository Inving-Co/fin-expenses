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

export interface EditableAsset {
    name: string,
    amount: number | undefined,
    estimatedReturnAmount: number | undefined,
    estimatedReturnDate: string | undefined,
    id: string | undefined,
    platform: string | undefined
    type: string | undefined
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
    circleId?: string
}

export interface Category {
    id: string
    name: string
    color?: string
    type?: string
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

export interface Asset {
    id: string
    name: string
    amount: number
    estimatedReturnAmount?: number
    estimatedReturnDate?: string
    type?: string
    platform?: string
    color?: string
    createdAt: string
    updatedAt: string
    userId?: string
    circleId?: string
    assetHistory: AssetHistory[]
}

export interface AssetHistory {
    id: string
    name: string
    amount: number
    estimatedReturnAmount?: number
    estimatedReturnDate?: string
    type?: string
    platform?: string
    color?: string
    createdAt: string
    updatedAt: string
    userId?: string
    circleId?: string
    assetId: string
    asset: Asset
}
