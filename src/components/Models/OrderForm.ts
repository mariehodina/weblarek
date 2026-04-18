import { Form } from '../base/Form';
import { IOrderFormData } from '../../types';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export class OrderForm extends Form<IOrderFormData> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;
    protected _payment: 'card' | 'cash' | null = null;
    protected _address: string = '';

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);
        
        this.addressInput = ensureElement<HTMLInputElement>('.form__input[name="address"]', this.container);
        this.paymentButtons = Array.from(this.container.querySelectorAll('.order__button'));
        
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.getAttribute('data-payment') as 'card' | 'cash';
                this.setPayment(payment);
                this.onInputChange('payment', payment);
            });
        });
        
        this.addressInput.addEventListener('input', () => {
            this._address = this.addressInput.value;
            this.onInputChange('address', this._address);
        });
    }

    protected setPayment(payment: 'card' | 'cash'): void {
        this._payment = payment;
        this.paymentButtons.forEach(btn => {
            const btnPayment = btn.getAttribute('data-payment');
            btn.classList.toggle('button_alt-active', btnPayment === payment);
        });
    }

    protected onInputChange(field: keyof IOrderFormData, value: string): void {
        if (field === 'payment') {
            this._payment = value as 'card' | 'cash';
        } else if (field === 'address') {
            this._address = value;
        }
        
        const isValid = this._payment !== null && this._address.trim() !== '';
        this.setValid(isValid);
        
        this.events.emit('order:change', {
            payment: this._payment,
            address: this._address
        });
    }

    set address(value: string) {
        this._address = value;
        this.addressInput.value = value;
    }

    set payment(value: 'card' | 'cash' | null) {
        if (value) {
            this.setPayment(value);
        }
    }

    getFormData(): IOrderFormData {
        return {
            payment: this._payment,
            address: this._address
        };
    }

    reset(): void {
        this._payment = null;
        this._address = '';
        this.addressInput.value = '';
        this.paymentButtons.forEach(btn => {
            btn.classList.remove('button_alt-active');
        });
        this.setValid(false);
        this.clearErrors();
    }

    render(data?: Partial<IOrderFormData>): HTMLElement {
        if (data?.payment !== undefined) this.payment = data.payment;
        if (data?.address !== undefined) this.address = data.address;
        return this.container;
    }
}