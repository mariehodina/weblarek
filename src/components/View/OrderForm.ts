import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { TPayment } from "../../types";
import { ensureAllElements } from "../../utils/utils";

export interface IOrderFormData {
    payment: TPayment | null;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    protected formelements: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.formelements = ensureAllElements<HTMLButtonElement>('.button_alt', container);

        this.formelements.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('order.payment:change', { target: button.name });
            });
        });
    }

    set payment(value: TPayment | null) {
        this.formelements.forEach(button => {
                button.classList.toggle('button_alt-active', value !== null && button.name === value);
        });
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}