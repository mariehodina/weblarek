import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

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
      return;
    }

    if (!this.containsItem(product.id)) {
      this.items.push(product);
      this.emitCartChange();
    }
  }

  removeItem(productId: string): void {
    const removed = this.items.find((item) => item.id === productId);
    if (removed) {
      this.items = this.items.filter((item) => item.id !== productId);
      this.emitCartChange();
    }
  }

  clear(): void {
    this.items = [];
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
    return this.items.some((item) => item.id === id);
  }

  private emitCartChange(): void {
    this.events.emit("cart:changed");
  }
}
