import { Card } from "../base/Card";
import { IEvents } from "../../types";
import { ensureElement } from "../../utils/utils";

export interface ICardBasketData {
  id: string;
  title: string;
  price: number | null;
  index: number;
}

export class CardBasket extends Card<ICardBasketData> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    this.deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = this.container.dataset.id;
      if (id) {
        events.emit("basket:remove", { id });
      }
    });
  }

  set index(value: number) {
    if (this.indexElement) {
      this.indexElement.textContent = String(value);
    }
  }

  render(data: ICardBasketData): HTMLElement {
    super.render(data);
    this.container.dataset.id = data.id;
    this.index = data.index;
    return this.container;
  }
}
