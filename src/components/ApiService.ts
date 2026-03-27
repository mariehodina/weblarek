// src/components/ApiService.ts

import { IApi, IProduct, IOrder, IOrderResult, IProductsResponse } from '../types';
export class ApiService {
    private api: IApi;
    constructor(api: IApi) {
        this.api = api;
    }

    async getProducts(): Promise<IProduct[]> {
        try {
            const response = await this.api.get<IProductsResponse>('/product');
            return response.items;
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            throw error;
        }
    }


    async sendOrder(order: IOrder): Promise<IOrderResult> {
        try {
            const result = await this.api.post<IOrderResult>('/order', order);
            return result;
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
            throw error;
        }
    }
}