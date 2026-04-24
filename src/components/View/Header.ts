import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
// import { ensureElement } from "../../utils/utils";

interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected countorElement: HTMLElement;
    protected basket: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.countorElement = container.querySelector('.header__basket-counter') as HTMLElement;
        this.basket = container.querySelector('.header__basket') as HTMLButtonElement;

        this.basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.countorElement.textContent = String(value);
    }
}