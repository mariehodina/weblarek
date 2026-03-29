import { IProduct, IEvents } from '../../types';
import { EventEmitter } from '../base/Events';
export class ShoppingCart {
    private items: IProduct[] = [];
    private events: IEvents;
    constructor(events: EventEmitter) {
        this.events = events;
    }
    getItems(): IProduct[] {
        return this.items;
    }
    addItem(product: IProduct): void {
        if (!this.containsItem(product.id)) {
            this.items.push(product);
            this.events.emit('корзина изменена', { items: this.items });
        }
    }
    removeItem(productId: string): void {
        const newItems: IProduct[] = [];
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id !== productId) {
                newItems.push(this.items[i]);
            }
        }
        this.items = newItems;
        this.events.emit('корзина изменена', { items: this.items });
    }
    clear(): void {
        this.items = [];
        this.events.emit('корзина изменена', { items: this.items });
    }
    getTotalPrice(): number {
        let total = 0;
        
        for (let i = 0; i < this.items.length; i++) {
            const price = this.items[i].price;
            if (price !== null) {
                total = total + price;
            }
        }
        return total;
    }
    getItemCount(): number {
        return this.items.length;
    }
    containsItem(productId: string): boolean {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id === productId) {
                return true;
            }
        }
        return false;
    }
}