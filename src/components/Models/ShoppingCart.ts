import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ShoppingCart {
    private items: IProduct[] = [];
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }
    getItems(): IProduct[] {
        return this.items;
    }
    addItem(product: IProduct): void {
        if (!this.containsItem(product.id)) {
            this.items.push(product);
            this.events.emit('cart:add', { product });
            this.emitCartChange();
        }
    }
    removeItem(productId: string): void {
        const removed = this.items.find(item => item.id === productId);
        this.items = this.items.filter(item => item.id !== productId);
        this.events.emit('cart:remove', { productId, product: removed });
        this.emitCartChange();
    }
    clear(): void {
        const oldItems = [...this.items];
        this.items = [];
        this.events.emit('cart:clear', { items: oldItems });
        this.emitCartChange();
    }
    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + (item.price || 0), 0);
    }
    getItemCount(): number {
        return this.items.length;
    }
    containsItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
    private emitCartChange(): void {
        this.events.emit('cart:changed', {
            items: this.items,
            count: this.getItemCount(),
            total: this.getTotalPrice()
        });
    }
}