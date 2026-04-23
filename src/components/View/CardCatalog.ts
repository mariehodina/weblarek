import { Card } from "../base/Card";
import { ICardCatalogData, categoryMap, CategoryKey } from "../../types";
import { ensureElement } from "../../utils/utils";

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
