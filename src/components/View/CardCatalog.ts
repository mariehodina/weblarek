// src/components/View/CardCatalog.ts
import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

const categoryMap = {
    "софт-скил": "card__category_soft",
    "хард-скил": "card__category_hard",
    "другое": "card__category_other",
    "дополнительное": "card__category_additional",
    "кнопка": "card__category_button",
} as const;

type CategoryKey = keyof typeof categoryMap;

export interface ICardCatalogData {
    id: string;
    title: string;
    price: number | null;
    image: string;
    category: string;
}
export class CardCatalog extends Component<ICardCatalogData> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected events: EventEmitter;
    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
        this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);
        this.titleElement = ensureElement<HTMLElement>(".card__title", this.container);
        this.priceElement = ensureElement<HTMLElement>(".card__price", this.container);
        this.container.addEventListener('click', () => {
            console.log('Клик по карточке, id:', this.id);
            this.events.emit('card:add-to-basket', { id: this.id });
        });
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }
    get id(): string {
        return this.container.dataset.id || '';
    }

    set category(value: string) {
        this.setText(this.categoryElement, value);
        
        for (const key in categoryMap) {
            this.categoryElement.classList.remove(categoryMap[key as CategoryKey]);
        }
        const categoryKey = value as CategoryKey;
        if (categoryMap[categoryKey]) {
            this.categoryElement.classList.add(categoryMap[categoryKey]);
        }
    }
    
    set image(value: string) {
    console.log('Устанавливаю изображение:', value);
    if (this.imageElement) {
        const src = value.startsWith('/') ? value : '/' + value;
        this.imageElement.src = src;
        this.imageElement.alt = this.title;
    }
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

    render(data: ICardCatalogData): HTMLElement {
        this.id = data.id;
        this.title = data.title;
        this.price = data.price;
        this.image = data.image;
        this.category = data.category;
        return this.container;
    }
}