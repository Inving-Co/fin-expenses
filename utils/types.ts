import { CircleSettings } from "@prisma/client"

export interface OpenAIChatMessage { role: string, content: string | null, function_call: { name: string, arguments: string } | undefined }

export interface ElementEvent {
    show: () => void,
    hide: () => void,
    toggle: () => void,
}

export interface EditableRecord {
    description: string,
    amount: number | null,
    id: string | null,
    date: string,
    categoryId: string | null
    assetId: string | null
    asset: Asset | null
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

export interface Record {
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
    asset?: Asset
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
    currency: string
    userId?: string
    circleSettingId: string
    circleSettings: CircleSettings
    circleUsers: CircleUser[] | undefined
    assets: Asset[] | undefined
}

export interface CircleUser {
circleId: string
    id: string
    userId: string
    createdAt: string
    updatedAt: string
    receiveReport: boolean
    circle: Circle | undefined
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
