export interface Ad {
    id?: number;
    description: string;
    image: string[];
    video: string[];
    hotelId: number;
    hotelName?: string;
    categoryId: number;
    categoryName?: string;
    subCategoryId: number;
    subCategoryName?: string;
    type: string
}