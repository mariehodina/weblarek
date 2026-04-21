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
            this.events.emit('card:button-click', { id: this.cardId });
        });
    }

    set id(value: string) {
        this.cardId = value;
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.cardId;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set buttonEnabled(value: boolean) {
        this.buttonElement.disabled = !value;
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
    
    set price(value: number | null) {
        if (value === null) {
            this.setText(this.priceElement, 'Бесценно');
        } else {
            this.setText(this.priceElement, `${value} синапсов`);
        }
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