import { Card } from '../base/Card';
import { ICardBasketData } from '../../types';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export class CardBasket extends Card<ICardBasketData> {
    protected indexElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;
    protected events: EventEmitter;
    private cardId: string = '';  

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        
        this.deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();  
            this.events.emit('basket:remove', { id: this.cardId });
        });
    }

    get id(): string {
        return this.cardId;
    }

    set id(value: string) {
        this.cardId = value;
        this.container.dataset.id = value;  
    }

    set index(value: number) {
        this.setText(this.indexElement, String(value));
    }

    set title(value: string) {
        this.setText(this.titleElement, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this.priceElement, 'Бесценно');
        } else {
            this.setText(this.priceElement, `${value} синапсов`);
        }
    }

    render(data?: Partial<ICardBasketData>): HTMLElement {
        if (data) {
            if (data.id !== undefined) this.id = data.id;
            if (data.index !== undefined) this.index = data.index;
            if (data.title !== undefined) this.title = data.title;
            if (data.price !== undefined) this.price = data.price;
        }
        return this.container;
    }
}