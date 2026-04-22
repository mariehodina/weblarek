import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IOrderFormData {
    payment: 'card' | 'cash' | null;
    address: string;
}

export class OrderForm extends Component<IOrderFormData> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected errorElement: HTMLElement;
    protected events: EventEmitter;
    protected _payment: 'card' | 'cash' | null = null;
    protected _address: string = '';

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('.order__button', this.container);
        this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.paymentButtons = Array.from(this.container.querySelectorAll('.order__buttons button'));
        
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const paymentType = button.getAttribute('name') as 'card' | 'cash';
                this.setPayment(paymentType);
            });
        });
        
        this.addressInput.addEventListener('input', () => {
            this._address = this.addressInput.value;
            this.validate();
        });
        
        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (this._payment !== null && this._address.trim() !== '') {
                this.events.emit('order:submit', {
                    payment: this._payment,
                    address: this._address
                });
            }
        });
        
        this.validate();
    }

    setPayment(type: 'card' | 'cash'): void {
        this._payment = type;
        
        this.paymentButtons.forEach(button => {
            const buttonType = button.getAttribute('name');
            if (buttonType === type) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
        
        this.validate();
    }

    validate(): void {
        const paymentSelected = this._payment !== null;
        const addressFilled = this._address.trim() !== '';
        this.submitButton.disabled = !(paymentSelected && addressFilled);
        
        if (!paymentSelected && !addressFilled) {
            this.setText(this.errorElement, '');
        } else if (!paymentSelected) {
            this.setText(this.errorElement, 'Необходимо выбрать способ оплаты');
        } else if (!addressFilled) {
            this.setText(this.errorElement, 'Необходимо выбрать адрес доставки');
        } else {
            this.setText(this.errorElement, '');
        }
    }

    reset(): void {
        this._payment = null;
        this._address = '';
        this.addressInput.value = '';
        this.paymentButtons.forEach(button => {
            button.classList.remove('button_alt-active');
        });
        this.submitButton.disabled = true;
        this.setText(this.errorElement, '');
    }

    render(data?: Partial<IOrderFormData>): HTMLElement {
        if (data) {
            if (data.payment) this.setPayment(data.payment);
            if (data.address !== undefined) {
                this._address = data.address;
                this.addressInput.value = data.address;
            }
        }
        this.validate();
        return this.container;
    }
}