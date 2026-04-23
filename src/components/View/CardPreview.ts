import { Card } from '../base/Card';
import { ensureElement } from '../../utils/utils';

const categoryMap = {
    "софт-скил": "card__category_soft",
    "хард-скил": "card__category_hard",
    "другое": "card__category_other",
    "дополнительное": "card__category_additional",
    "кнопка": "card__category_button",
} as const;

type CategoryKey = keyof typeof categoryMap;

export interface ICardPreviewData {
    id: string;
    title: string;
    price: number | null;
    image: string;
    category: string;
    description: string;
    inBasket?: boolean;
}

export interface ICardPreviewActions {
    onButtonClick: (id: string) => void;
}

export class CardPreview extends Card<ICardPreviewData> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardPreviewActions) {
        super(container);
        
        this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
        this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);
        this.descriptionElement = ensureElement<HTMLElement>(".card__text", this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>(".card__button", this.container);
        
        if (actions?.onButtonClick) {
            this.buttonElement.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = this.container.dataset.id;
                if (id) {
                    actions.onButtonClick(id);
                }
            });
        }
    }

    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
            
            for (const key in categoryMap) {
                this.categoryElement.classList.remove(categoryMap[key as CategoryKey]);
            }
            
            const categoryKey = value as CategoryKey;
            if (categoryMap[categoryKey]) {
                this.categoryElement.classList.add(categoryMap[categoryKey]);
            }
        }
    }
    
    set image(value: string) {
        if (this.imageElement) {
            this.imageElement.src = value;
            this.imageElement.alt = this.title;
        }
    }
    
    set description(value: string) {
        if (this.descriptionElement) {
            this.descriptionElement.textContent = value;
        }
    }

    set buttonText(value: string) {
        if (this.buttonElement) {
            this.buttonElement.textContent = value;
        }
    }

    set buttonEnabled(value: boolean) {
        if (this.buttonElement) {
            this.buttonElement.disabled = !value;
        }
    }

    render(data: ICardPreviewData): HTMLElement {
        super.render(data);
        this.container.dataset.id = data.id;
        this.image = data.image;
        this.category = data.category;
        this.description = data.description;
        
        if (data.price === null) {
            this.buttonText = 'Недоступно';
            this.buttonEnabled = false;
        } else if (data.inBasket) {
            this.buttonText = 'Удалить из корзины';
            this.buttonEnabled = true;
        } else {
            this.buttonText = 'Купить';
            this.buttonEnabled = true;
        }
        
        return this.container;
    }
}