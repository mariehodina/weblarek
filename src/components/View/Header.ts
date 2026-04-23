import { Component } from "../base/Component";
import { IEvents } from "../../types";
import { ensureElement } from "../../utils/utils";

export class Header extends Component<{ counter: number }> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );
    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );

    this.basketButton.addEventListener("click", () => {
      this.events.emit("header:basket-open");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
