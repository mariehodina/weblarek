import { Card } from "../base/Card";
import { ICardPreviewData } from "../../types";
import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";

const categoryMap = {
  "софт-скил": "card__category_soft",
  "хард-скил": "card__category_hard",
  другое: "card__category_other",
  дополнительное: "card__category_additional",
  кнопка: "card__category_button",
} as const;

type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends Card<ICardPreviewData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected titleElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected events: EventEmitter;
  protected _id: string = "";
  protected _inBasket: boolean = false;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__description",
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.buttonElement.addEventListener("click", () => {
      this.events.emit("card:add-to-basket", { id: this._id });
    });
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  set inBasket(value: boolean) {
    this._inBasket = value;
    if (value) {
      this.buttonElement.textContent = "Уже в корзине";
      this.buttonElement.disabled = true;
    } else {
      this.buttonElement.textContent = "В корзину";
      this.buttonElement.disabled = false;
    }
  }

  set category(value: string) {
    this.setText(this.categoryElement, value);
    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
  }

  set title(value: string) {
    this.setText(this.titleElement, value);
  }

  set description(value: string) {
    this.setText(this.descriptionElement, value);
  }

  set price(value: number | null) {
    if (value === null) {
      this.setText(this.priceElement, "Бесценно");
      this.buttonElement.disabled = true;
    } else {
      this.setText(this.priceElement, `${value} синапсов`);
    }
  }

  render(data?: Partial<ICardPreviewData>): HTMLElement {
    if (data) {
      if (data.id !== undefined) this.id = data.id;
      if (data.category !== undefined) this.category = data.category;
      if (data.image !== undefined) this.image = data.image;
      if (data.title !== undefined) this.title = data.title;
      if (data.description !== undefined) this.description = data.description;
      if (data.price !== undefined) this.price = data.price;
    }
    return this.container;
  }
}
