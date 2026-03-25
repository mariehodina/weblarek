import { IProduct, IEvents } from '../../types';
import { EventEmitter } from '../base/events';

export class ShoppingCart {
    private _items: IProduct[] = [];
    private events: IEvents;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(product: IProduct): void {
        if (!this.containsItem(product.id)) {
            this._items.push(product);
            this.events.emit('корзина изменена', { items: this._items });
        }
    }

    removeItem(productId: string): void {
        this._items = this._items.filter(item => item.id !== productId);
        this.events.emit('корзина изменена', { items: this._items });
    }

    clear(): void {
        this._items = [];
        this.events.emit('корзина изменена', { items: this._items });
    }

    getTotalPrice(): number {
        return this._items.reduce((total, item) => {
            if (item.price !== null) {
                return total + item.price;
            }
            return total;
        }, 0);
    }

    getItemCount(): number {
        return this._items.length;
    }

    containsItem(productId: string): boolean {
        return this._items.some(item => item.id === productId);
    }
}