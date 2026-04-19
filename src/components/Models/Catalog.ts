import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Catalog {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;
    private events: EventEmitter;

    constructor(events: EventEmitter) {  
        this.events = events;
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
        console.log('Каталог обновлен, товаров:', this.products.length);
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }

    
}