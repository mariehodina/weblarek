export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface ICardCatalogData {
    id: string;
    title: string;
    price: number | null;
    image: string;
    category: string;
}

export interface ICardBasketData {
    id: string;
    title: string;
    price: number | null;
    index: number;
}

export interface ICardPreviewData {
    id: string;
    title: string;
    price: number | null;
    image: string;
    category: string;
    description: string;
}

export interface IGalleryData {
    catalog: HTMLElement[];
}

export interface IOrderFormData {
    payment: 'card' | 'cash' | null;
    address: string;
}

export interface IContactsFormData {
    email: string;
    phone: string;
}

export type TPayment = 'card' | 'cash' | null;

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IOrder extends IBuyer {
    items: string[];  
    total: number;    
}

export interface IOrderResult {
    id: string;
    total: number;
}
export interface IProductsResponse {
    total: number;   
    items: IProduct[]; 
}

export interface IEvents {
    on<T extends object>(event: string, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

export type TValidationErrors = Partial<Record<keyof IBuyer, string>>;