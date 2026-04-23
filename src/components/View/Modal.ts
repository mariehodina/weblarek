import { Component } from "../base/Component";
import { IEvents } from "../../types";

export class Modal extends Component<object> {
  protected modalElement: HTMLElement;
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected events: IEvents;
  private handleEscape: (event: KeyboardEvent) => void;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.modalElement = container;
    this.contentElement = container.querySelector(
      ".modal__content",
    ) as HTMLElement;
    this.closeButton = container.querySelector(
      ".modal__close",
    ) as HTMLButtonElement;

    this.closeButton.addEventListener("click", () => this.close());

    this.modalElement.addEventListener("click", (event) => {
      if (event.target === this.modalElement) {
        this.close();
      }
    });

    this.handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        this.close();
      }
    };
  }

  open(): void {
    this.modalElement.classList.add("modal_active");
    document.addEventListener("keydown", this.handleEscape);
  }

  close(): void {
    this.modalElement.classList.remove("modal_active");
    this.contentElement.innerHTML = "";
    document.removeEventListener("keydown", this.handleEscape);
  }

  setContent(content: HTMLElement): void {
    this.contentElement.innerHTML = "";
    this.contentElement.appendChild(content);
  }

  getContent(): HTMLElement | null {
    return this.contentElement.firstChild as HTMLElement;
  }

  render(): HTMLElement {
    return this.container;
  }
}
