// src/components/view/CardCatalog.ts
import { Card } from '../base/Card';
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";

const categoryMap = {
    "софт-скил": "card__category_soft",
    "хард-скил": "card__category_hard",
    "другое": "card__category_other",
    "дополнительное": "card__category_additional",
    "кнопка": "card__category_button",
} as const;

type CategoryKey = keyof typeof categoryMap;
export type TCardCatalog = Pick<IProduct, "image" | "category">;

export interface ICardActions {
    onClick?: (event: MouseEvent) => void;
}

export class CardCatalog extends Card<TCardCatalog> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        
        this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
        this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);
        this.titleElement = ensureElement<HTMLElement>(".card__title", this.container);
        this.priceElement = ensureElement<HTMLElement>(".card__price", this.container);
        
        if (actions?.onClick) {
            this.container.addEventListener("click", actions.onClick);
        }
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        
        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as CategoryKey],
                key === value
            );
        }
    }
    
    set image(value: string) {
        this.setImage(this.imageElement, value, this.title);
    }
    
    set title(value: string) {
        this.titleElement.textContent = value;
    }
    
    set price(value: number | null) {
        if (value === null) {
            this.priceElement.textContent = 'Бесценно';
        } else {
            this.priceElement.textContent = `${value} синапсов`;
        }
    }
}