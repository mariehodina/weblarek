import { Component } from "../base/Component";
import { IEvents } from "../../types";
import { ensureElement } from "../../utils/utils";

export class Basket extends Component<{ items: HTMLElement[]; total: number }> {
  protected itemsContainer: HTMLElement;
  protected totalElement: HTMLElement;
  protected orderButton: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.itemsContainer = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    this.totalElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );

    this.orderButton.addEventListener("click", () => {
      this.events.emit("basket:order");
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length === 0) {
      this.itemsContainer.innerHTML =
        '<p class="basket__empty">Корзина пуста</p>';
    } else {
      this.itemsContainer.replaceChildren(...items);
    }
    this.orderButton.disabled = items.length === 0;
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  getContainer(): HTMLElement {
    return this.container;
  }
}
