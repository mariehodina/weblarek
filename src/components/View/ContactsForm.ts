import { Form } from "../base/Form";
import { IEvents } from "../../types";
import { ensureElement } from "../../utils/utils";

export interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected errorElement: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );
    this.errorElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );

    this.emailInput.addEventListener("input", () => {
      this.events.emit("contacts:field-change", {
        field: "email",
        value: this.emailInput.value,
      });
      this.validateAndUpdate();
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("contacts:field-change", {
        field: "phone",
        value: this.phoneInput.value,
      });
      this.validateAndUpdate();
    });

    if (this.submitButton) {
      this.submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.onSubmit();
      });
    }

    this.validateAndUpdate();
  }

  private validateAndUpdate(): void {
    const emailValid =
      this.emailInput.value.includes("@") && this.emailInput.value.length > 3;
    const phoneValid = this.phoneInput.value.length >= 10;
    const isValid = emailValid && phoneValid;

    if (this.submitButton) {
      this.submitButton.disabled = !isValid;
    }

    if (!emailValid && !phoneValid) {
      this.errorElement.textContent = "";
    } else if (!emailValid && phoneValid) {
      this.errorElement.textContent = "Введите корректный email";
    } else if (emailValid && !phoneValid) {
      this.errorElement.textContent = "Введите номер телефона";
    } else {
      this.errorElement.textContent = "";
    }
  }

  protected onSubmit(): void {
    const emailValid =
      this.emailInput.value.includes("@") && this.emailInput.value.length > 3;
    const phoneValid = this.phoneInput.value.length >= 10;

    if (emailValid && phoneValid) {
      this.events.emit("contacts:submit", {
        email: this.emailInput.value,
        phone: this.phoneInput.value,
      });
    }
  }

  render(data?: Partial<IContactsFormData>): HTMLElement {
    if (data) {
      if (data.email !== undefined) {
        this.emailInput.value = data.email;
      }
      if (data.phone !== undefined) {
        this.phoneInput.value = data.phone;
      }
    }
    this.validateAndUpdate();
    return this.container;
  }
}
