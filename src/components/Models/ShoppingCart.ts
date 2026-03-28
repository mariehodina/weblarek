import { IProduct } from '../../types';

export class ShoppingCart {
    private items: IProduct[] = [];
    private events: any;

    constructor(eventEmitter: any) {
        this.events = eventEmitter;
    }
    getItems(): IProduct[] {
        return this.items;
    }
    addItem(product: IProduct): void {
        let alreadyExists = false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id === product.id) {
                alreadyExists = true;
                break;
            }
        }
        if (!alreadyExists) {
            this.items.push(product);
            if (this.events && this.events.emit) {
                this.events.emit('корзина изменена', this.items);
            }
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
        if (this.events && this.events.emit) {
            this.events.emit('корзина изменена', this.items);
        }
    }
    clear(): void {
        this.items = [];
        if (this.events && this.events.emit) {
            this.events.emit('сорзина изменена', this.items);
        }
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