import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface ICardPreviewData {
    id: string;
    title: string;
    price: number | null;
    image: string;
    category: string;
    description: string;
}

export class CardPreview extends Component<ICardPreviewData> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    protected events: EventEmitter;
    private cardId: string = '';
    private isInBasket: boolean = false;
    private itemPrice: number | null = null;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        
        this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
        this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);
        this.titleElement = ensureElement<HTMLElement>(".card__title", this.container);
        this.descriptionElement = ensureElement<HTMLElement>(".card__text", this.container);
        this.priceElement = ensureElement<HTMLElement>(".card__price", this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>(".card__button", this.container);
        
        this.buttonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.isInBasket) {
                this.events.emit('basket:remove', { id: this.cardId });
            } else {
                this.events.emit('card:add-to-basket', { id: this.cardId });
            }
        });
    }

    set id(value: string) {
        this.cardId = value;
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.cardId;
    }

    set inBasket(value: boolean) {
        this.isInBasket = value;
        this.updateButton();
    }

    set price(value: number | null) {
        this.itemPrice = value;
        if (value === null) {
            this.setText(this.priceElement, 'Бесценно');
        } else {
            this.setText(this.priceElement, `${value} синапсов`);
        }
        this.updateButton();
    }

    private updateButton(): void {
        if (this.itemPrice === null) {
            this.buttonElement.textContent = 'Недоступно';
            this.buttonElement.disabled = true;
        } else if (this.isInBasket) {
            this.buttonElement.textContent = 'Удалить из корзины';
            this.buttonElement.disabled = false;
        } else {
            this.buttonElement.textContent = 'Купить';
            this.buttonElement.disabled = false;
        }
    }

    set category(value: string) {
        this.setText(this.categoryElement, value);
    }
    
    set image(value: string) {
        if (this.imageElement) {
            const src = value.startsWith('/') ? value : '/' + value;
            this.imageElement.src = src;
            this.imageElement.alt = this.title;
        }
    }
    
    set title(value: string) {
        this.setText(this.titleElement, value);
    }
    
    set description(value: string) {
        this.setText(this.descriptionElement, value);
    }

    render(data: ICardPreviewData): HTMLElement {
        this.id = data.id;
        this.title = data.title;
        this.price = data.price;
        this.image = data.image;
        this.category = data.category;
        this.description = data.description;
        return this.container;
    }
}