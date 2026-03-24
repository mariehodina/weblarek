import { IProduct, IEvents } from '../../types';
import { EventEmitter } from '../base/events';

export class Catalog {
    private _products: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;
    private events: IEvents;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    setProducts(products: IProduct[]): void {
        this._products = products;
        this.events.emit('catalog:changed', { products: this._products });
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    getProductById(id: string): IProduct | undefined {
        return this._products.find(product => product.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this._selectedProduct = product;
        this.events.emit('product:selected', { product: this._selectedProduct });
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }
}