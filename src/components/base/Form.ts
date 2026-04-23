import { Component } from "./Component";
import { IEvents } from "../../types";

export abstract class Form<T> extends Component<T> {
  protected events: IEvents;
  protected formElement: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorElements: Map<string, HTMLElement> = new Map();

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.formElement = container as HTMLFormElement;
    this.submitButton = this.formElement.querySelector(
      ".order__button",
    ) as HTMLButtonElement;
    if (!this.submitButton) {
      this.submitButton = this.formElement.querySelector(
        'button[type="submit"]',
      ) as HTMLButtonElement;
    }

    const allErrors = this.formElement.querySelectorAll(
      '[class*="form__error_"]',
    );
    allErrors.forEach((error) => {
      const className = error.className;
      const match = className.match(/form__error_(\w+)/);
      if (match) {
        this.errorElements.set(match[1], error as HTMLElement);
      }
    });

    this.formElement.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  protected setValid(isValid: boolean): void {
    if (this.submitButton) {
      this.submitButton.disabled = !isValid;
    }
  }

  protected setFieldError(field: keyof T, message: string): void {
    const errorElement = this.errorElements.get(String(field));
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  protected abstract onSubmit(): void;
}
