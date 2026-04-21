import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Component<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.events = events;

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );

    this.emailInput.addEventListener("input", () => this.validate());
    this.phoneInput.addEventListener("input", () => this.validate());

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.validate()) {
        this.events.emit("contacts:submit", {
          email: this.emailInput.value,
          phone: this.phoneInput.value,
        });
      }
    });

    this.validate();
  }

  validate(): boolean {
    const emailValid = this.emailInput.value.includes("@");
    const phoneValid = this.phoneInput.value.length >= 10;
    const isValid = emailValid && phoneValid;
    this.submitButton.disabled = !isValid;
    return isValid;
  }

  render(data?: Partial<IContactsFormData>): HTMLElement {
    if (data) {
      if (data.email) this.emailInput.value = data.email;
      if (data.phone) this.phoneInput.value = data.phone;
    }
    this.validate();
    return this.container;
  }
}
