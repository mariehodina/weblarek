import { Component } from "./Component";

export abstract class Card<T> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = container.querySelector(".card__title") as HTMLElement;
    this.priceElement = container.querySelector(".card__price") as HTMLElement;
  }

  set title(value: string) {
    if (this.titleElement) {
      this.titleElement.textContent = value;
    }
  }

  set price(value: number | null) {
    if (this.priceElement) {
      if (value === null) {
        this.priceElement.textContent = "Бесценно";
      } else {
        this.priceElement.textContent = `${value} синапсов`;
      }
    }
  }

  render(data: T): HTMLElement {
    if ((data as any).title !== undefined) {
      this.title = (data as any).title;
    }
    if ((data as any).price !== undefined) {
      this.price = (data as any).price;
    }
    return this.container;
  }
}
