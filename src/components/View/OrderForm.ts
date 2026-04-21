import { Form } from '../base/Form';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IOrderFormData {
    payment: 'card' | 'cash' | null;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected _payment: 'card' | 'cash' | null = null;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);
        
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('.order__button', this.container);
        this.paymentButtons = Array.from(this.container.querySelectorAll('.order__buttons button'));
        
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const paymentType = button.getAttribute('name') as 'card' | 'cash';
                this.setPayment(paymentType);
            });
        });
        
        this.addressInput.addEventListener('input', () => {
            this.validateForm();
        });
        
        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.events.emit('order:submit', this.getFormData());
            }
        });
        
        this.validateForm();
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
        
        this.validateForm();
    }

    validateForm(): boolean {
        const isValid = this._payment !== null && this.addressInput.value.trim() !== '';
        
        this.submitButton.disabled = !isValid;
        
        return isValid;
    }

    getFormData(): IOrderFormData {
        return {
            payment: this._payment,
            address: this.addressInput.value
        };
    }

    reset(): void {
        this._payment = null;
        this.addressInput.value = '';
        
        this.paymentButtons.forEach(button => {
            button.classList.remove('button_alt-active');
        });
        
        this.submitButton.disabled = true;
    }

    render(data?: Partial<IOrderFormData>): HTMLElement {
        if (data) {
            if (data.payment) {
                this.setPayment(data.payment);
            }
            if (data.address !== undefined) {
                this.addressInput.value = data.address;
            }
        }
        this.validateForm();
        return this.container;
    }
}