import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export interface IBasketData {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketData> {
    protected itemsContainer: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.itemsContainer = ensureElement<HTMLElement>('.basket__list', container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', container);
        
        this.buttonElement.addEventListener('click', () => {
            this.events.emit('order:start');
        });
    }

    set items(items: HTMLElement[]) {
        if (items.length === 0) {
            this.itemsContainer.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
            this.buttonElement.disabled = true;
        } else {
            this.itemsContainer.innerHTML = '';
            items.forEach(item => this.itemsContainer.appendChild(item));
            this.buttonElement.disabled = false;
        }
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }

    render(data?: IBasketData): HTMLElement {
        if (data) {
            this.items = data.items;
            this.total = data.total;
        }
        return this.container;
    }
}