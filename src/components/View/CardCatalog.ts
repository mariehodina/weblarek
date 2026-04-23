import { Card } from "../base/Card";
import { ensureElement } from "../../utils/utils";

const categoryMap = {
  "софт-скил": "card__category_soft",
  "хард-скил": "card__category_hard",
  другое: "card__category_other",
  дополнительное: "card__category_additional",
  кнопка: "card__category_button",
} as const;

type CategoryKey = keyof typeof categoryMap;

export interface ICardCatalogData {
  id: string;
  title: string;
  price: number | null;
  image: string;
  category: string;
}

export interface ICardCatalogActions {
  onClick: (id: string) => void;
}

export class CardCatalog extends Card<ICardCatalogData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardCatalogActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    if (actions?.onClick) {
      this.container.addEventListener("click", () => {
        const id = this.container.dataset.id;
        if (id) {
          actions.onClick(id);
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

  render(data: ICardCatalogData): HTMLElement {
    super.render(data);
    this.container.dataset.id = data.id;
    this.image = data.image;
    this.category = data.category;
    return this.container;
  }
}
