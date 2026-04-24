import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";

interface ICardBasket {
    onClick: () => void;
}

export class CardBasket extends Card<{ index: number }> {
    protected indexElement: HTMLElement;
    protected deleteButtonElement: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardBasket) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.deleteButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        
         if (actions?.onClick) {
            this.deleteButtonElement.addEventListener('click', (e) => {
                e.stopPropagation();
                actions.onClick();
            });
        }
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}