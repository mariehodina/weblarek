import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IShoppingCart {
    items: HTMLElement[];
    total: number;
    valid: boolean;
}

export class ShoppingCart extends Component<IShoppingCart> {
    protected BasketlistElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.BasketlistElement = ensureElement<HTMLElement>('.basket__list', container);
        this.priceElement = ensureElement<HTMLElement>('.basket__price', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', container);
        this.buttonElement.addEventListener('click', () => {
                events.emit('order:open');
            });
    }

    set items(items: HTMLElement[]) {
        this.BasketlistElement.replaceChildren(...items);
    }

    set total(value: number) {
        this.priceElement.textContent = String(value) + ' синапсов';
    }

    set valid(value: boolean) {
            this.buttonElement.disabled = !value;
    }
}