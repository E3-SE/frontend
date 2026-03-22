export interface MassageShop {
    _id: string;
    name: string;
    address: string;
    district: string;
    province: string;
    postalcode: string;
    tel: string;
    pictures: string[];
    price: number;
    averageRating: number;
    userRatingCount: number;
    id: string;
}

export interface MassagesResponse {
    success: boolean;
    count: number;
    totalCount: number;
    pagination: {
        next?: { page: number; limit: number };
    };
    data: MassageShop[];
}

export interface BookingItem {
    _id: string;
    reserveDate: string;
    user: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    massage: MassageShop;
    isRated: boolean;
    createdAt: string;
    __v: number;
    rating?: number;
}