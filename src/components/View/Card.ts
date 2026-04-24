import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface ICard {
    title: string;
    price: number | null;
}

export class Card<T = ICard> extends Component<T & ICard> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    }

    set title(value: string) {
        this.titleElement.textContent = String(value);
    }

    set price(value: number | null) {
            this.priceElement.textContent = value === null? 'Бесценно' : String(value) + ' синапсов';
    }
}
//   render(data: T): HTMLElement {
//     if ((data as any).title !== undefined) {
//       this.title = (data as any).title;
//     }
//     if ((data as any).price !== undefined) {
//       this.price = (data as any).price;
//     }
//     return this.container;
//   }

