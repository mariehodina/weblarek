// src/components/View/Basket.ts
import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Basket extends Component<{ items: HTMLElement[], total: number }> {
    protected itemsContainer: HTMLElement;
    protected totalElement: HTMLElement;
    protected orderButton: HTMLButtonElement;
    protected events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        
        this.itemsContainer = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.orderButton.addEventListener('click', () => {
            console.log('Кнопка "Оформить" нажата');
            this.events.emit('basket:order');
        });
    }

    set items(items: HTMLElement[]) {
        this.itemsContainer.innerHTML = '';
        items.forEach(item => {
            this.itemsContainer.appendChild(item);
        });
    }
    set total(value: number) {
        this.setText(this.totalElement, `${value} синапсов`);
    }
}