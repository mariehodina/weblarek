import { Form } from '../base/Form';
import { IEvents } from '../../types';
import { ensureElement } from '../../utils/utils';

export interface IOrderFormData {
    payment: 'card' | 'cash' | null;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;
    protected errorElement: HTMLElement;
    private selectedPayment: 'card' | 'cash' | null = null;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.paymentButtons = Array.from(this.container.querySelectorAll('.order__buttons button'));
        this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);
        
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const paymentType = button.getAttribute('name') as 'card' | 'cash';
                this.selectedPayment = paymentType;
                this.events.emit('order:field-change', {
                    field: 'payment',
                    value: paymentType
                });
                this.validateAndUpdate();
            });
        });
        
        this.addressInput.addEventListener('input', () => {
            this.events.emit('order:field-change', {
                field: 'address',
                value: this.addressInput.value
            });
            this.validateAndUpdate();
        });
        
        if (this.submitButton) {
            this.submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.onSubmit();
            });
        }
        
        this.validateAndUpdate();
    }

    private validateAndUpdate(): void {
        const isPaymentSelected = this.selectedPayment !== null;
        const isAddressFilled = this.addressInput.value.trim() !== '';
        const isValid = isPaymentSelected && isAddressFilled;
        
        if (this.submitButton) {
            this.submitButton.disabled = !isValid;
        }
        
       if (isAddressFilled && !isPaymentSelected) {
            this.errorElement.textContent = 'Выберите способ оплаты';
        } else if (isPaymentSelected && !isAddressFilled) {
            this.errorElement.textContent = 'Укажите адрес доставки';
        } else {
            this.errorElement.textContent = '';
        }
    }

    setActivePaymentButton(type: 'card' | 'cash' | null): void {
        this.selectedPayment = type;
        this.paymentButtons.forEach(button => {
            const buttonType = button.getAttribute('name');
            if (buttonType === type) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
        this.validateAndUpdate();
    }

    setError(error: string): void {
        if (this.errorElement) {
            this.errorElement.textContent = error;
        }
    }

   protected onSubmit(): void {
    if (this.selectedPayment && this.addressInput.value.trim()) {
        this.events.emit('order:submit', {
            payment: this.selectedPayment,
            address: this.addressInput.value
        });
    }
}

    // render(data?: Partial<IOrderFormData>): HTMLElement {
    //     if (data) {
    //         if (data.payment !== undefined) {
    //             this.setActivePaymentButton(data.payment);
    //         }
    //         if (data.address !== undefined) {
    //             this.addressInput.value = data.address;
    //         }
    //     }
    //     this.validateAndUpdate();
    //     return this.container;
    // }
}