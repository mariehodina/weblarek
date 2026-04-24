import { Card } from "./Card";
import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

export type TCardPreview = Pick<IProduct, 'category' | 'description'> & {
    image: {
        src: string;
        alt?: string;
    };
    buttonText: string;
    buttonNone: boolean;
};

interface ICardPreviewActions {
    onClick: () => void;
}

export class CardPreview extends Card<TCardPreview> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected textElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardPreviewActions) {
        super(container);

        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.textElement = ensureElement<HTMLElement>('.card__text', container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onClick) {
            this.buttonElement.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!this.buttonElement.disabled) {
                    actions.onClick();
                }
            });
        }
    }

    set image(value: { src: string; alt?: string }) {
        this.setImage(this.imageElement, value.src, value.alt);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as keyof typeof categoryMap],
                key === value
            );
        }
    }

    set text(value: string) {
        this.textElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set buttonNone(value: boolean) {
        this.buttonElement.disabled = value;
    }

    set price(value: number | null) {
        if (this.priceElement) {
            if (value === null) {
                this.priceElement.textContent = '';
            } else {
                this.priceElement.textContent = `${value} синапсов`;
            }
        }
    }
}