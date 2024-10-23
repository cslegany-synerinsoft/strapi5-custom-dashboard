export const CollectionType = ["singleType", "collectionType"] as const;
export type TCollectionType = typeof CollectionType[number];

export const CategoryIcon = ["Cog", "Database"] as const;
export type TCategoryIcon = typeof CategoryIcon[number];

export const ItemIcon = [
    'Cog', 'Database', 'Discuss', 'File', 'Folder', 'Image', 'Information', 'Key', 'Lightning', 'List', 'ListPlus',
    'Mail', 'Message', 'Microphone', 'Paragraph', 'PinMap', 'PriceTag', 'PuzzlePiece', 'User', 
    'ChartBubble', 'ChartCircle', 'ChartPie'
    //TODO: import all icon names
] as const;
export type TItemIcon = typeof ItemIcon[number];

export interface DashboardCategory {
    id: number;
    order: number;
    label: string;
    icon?: TCategoryIcon;
    hint?: string;
}

export interface DashboardItem {
    id: number;
    order: number;
    label: string;
    hint?: string;
    entityId: string; //api::article.article
    collectionType: TCollectionType; //map url to 'admin/content-manager/collection-types/api::article.article'
    category: number;
    icon?: TItemIcon;
    count?: number;
}

export interface DashboardIframe {
    id: number;
    order: number;
    label: string;
    hint?: string;
    url: string;
    icon?: TItemIcon;
    width?: string;
    height?: string;
    resize: boolean;
}

export interface PluginSettingsResponse {
    title?: string;
    subTitle?: string;
    categories: Array<DashboardCategory>;
    items: Array<DashboardItem>;
    iframes: Array<DashboardIframe>;
}