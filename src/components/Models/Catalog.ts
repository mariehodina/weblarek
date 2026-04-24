import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Catalog {
    private _products: IProduct[] = [];
    private _selectedProduct: IProduct | null = null;

    constructor(protected events: IEvents) {}
    setProducts(products: IProduct[]): void {
        this._products = products;
        this.events.emit('item:changed');
    }

    getProducts(): IProduct[] {
        return this._products;
    }

    getProduct(id: string): IProduct | undefined {
        return this._products.find(product => product.id === id)
    }

    setSelectedProduct(product: IProduct):void {
        this._selectedProduct = product;
        this.events.emit('preview:changed');
    }

    getSelectedProduct(): IProduct | null {
        return this._selectedProduct;
    }
}