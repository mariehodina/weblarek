import { IBuyer } from "../../types";
import { EventEmitter } from "../base/Events";

export class Buyer {
  private data: IBuyer = {
    payment: null,
    email: "",
    phone: "",
    address: "",
  };
  private events: EventEmitter;
  constructor(events: EventEmitter) {
    this.events = events;
  }

  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    this.data[field] = value;
    this.events.emit("buyer:changed");
  }

  setData(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
    this.events.emit("buyer:changed");
  }

  getData(): IBuyer {
    return this.data;
  }

  clear(): void {
    this.data = {
      payment: null,
      email: "",
      phone: "",
      address: "",
    };
    this.events.emit("buyer:changed");
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!this.data.email) {
      errors.email = "Введите email";
    }

    if (!this.data.phone) {
      errors.phone = "введите номер";
    }

    if (!this.data.address) {
      errors.address = "Введите адрес";
    }

    if (!this.data.payment) {
      errors.payment = "Выберите способ оплаты";
    }

    return errors;
  }
}
