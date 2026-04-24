import { Card } from "./Card";
import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

export type TCardCatalog = Pick<IProduct, 'category'> & {
    image: {
        src: string;
        alt?: string;
    };
}

    interface ICardCatalogActions {
        onClick: (event: MouseEvent) => void;
    }

    export class CardCatalog extends Card<TCardCatalog> {
        protected imageElement: HTMLImageElement;
        protected categoryElement: HTMLElement;

        constructor(container: HTMLElement, actions?: ICardCatalogActions) {
            super(container);

            this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
            this.categoryElement = ensureElement<HTMLElement>('.card__category', container);

            if(actions?.onClick) {
                container.addEventListener('click', actions.onClick);
            }
        }

        set image(value: {src: string; alt?: string}) {
            this.setImage(this.imageElement, value.src, value.alt);
        }

        set category(value: string) {
            this.categoryElement.textContent = value;
            for (const key in categoryMap) {
                this.categoryElement.classList.toggle(
                    categoryMap[key as keyof typeof categoryMap],
                    key === value
                )
            }
        }
    }