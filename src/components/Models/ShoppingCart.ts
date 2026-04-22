import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ShoppingCart {
    private items: IProduct[] = [];
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    getItems(): IProduct[] {
        return [...this.items]; 
    }

    addItem(product: IProduct): void {
        if (product.price === null) {
            console.log('Нельзя добавить бесценный товар в корзину');
            this.events.emit('cart:error', { message: 'Бесценный товар нельзя добавить в корзину', product });
            return;
        }

        if (!this.containsItem(product.id)) {
            this.items.push(product);
            this.events.emit('cart:add', { product });
            this.emitCartChange();
        } else {
            console.log('Товар уже в корзине');
            this.events.emit('cart:error', { message: 'Товар уже в корзине', product });
        }
    }
    
    removeItem(productId: string): void {
        const removed = this.items.find(item => item.id === productId);
        if (removed) {
            this.items = this.items.filter(item => item.id !== productId);
            this.events.emit('cart:remove', { productId, product: removed });
            this.emitCartChange();
        }
    }

    clear(): void {
        const oldItems = [...this.items];
        this.items = [];
        this.events.emit('cart:clear', { items: oldItems });
        this.emitCartChange();
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    getItemCount(): number {
        return this.items.length;
    }

    containsItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
    hasPricelessItems(): boolean {
        return this.items.some(item => item.price === null);
    }
    getPricedItems(): IProduct[] {
        return this.items.filter(item => item.price !== null);
    }

    private emitCartChange(): void {
        this.events.emit('cart:changed', {
            items: this.items,
            count: this.getItemCount(),
            total: this.getTotalPrice()
        });
    }
}