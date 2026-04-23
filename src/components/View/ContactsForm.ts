import { Form } from '../base/Form';
import { IEvents } from '../../types';
import { IContactsFormData } from '../../types';
import { ensureElement } from '../../utils/utils';

export class ContactsForm extends Form<IContactsFormData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected errorElement: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);
        
        this.emailInput.addEventListener('input', () => {
            this.events.emit('contacts:field-change', {
                field: 'email',
                value: this.emailInput.value
            });
            this.checkAndEnableButton();
        });
        
        this.phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:field-change', {
                field: 'phone',
                value: this.phoneInput.value
            });
            this.checkAndEnableButton();
        });
        
        if (this.submitButton) {
            this.submitButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.onSubmit();
            });
        }
        
        this.checkAndEnableButton();
    }

    private checkAndEnableButton(): void {
        const emailValid = this.emailInput.value;
        const phoneValid = this.phoneInput.value;
        const isValid = emailValid && phoneValid;
        
        if (this.submitButton) {
            this.submitButton.disabled = !isValid;
        }
        
        if (emailValid && !phoneValid) {
            this.errorElement.textContent = 'Укажите номер телефона';
        } else if (!emailValid && phoneValid) {
            this.errorElement.textContent = 'Укажите email';
        } else {
            this.errorElement.textContent = '';
        }
    }

    setError(error: string): void {
        if (this.errorElement) {
            this.errorElement.textContent = error;
        }
    }

    protected onSubmit(): void {
        const emailValid = this.emailInput.value;
        const phoneValid = this.phoneInput.value;
        
        if (emailValid && phoneValid) {
            this.events.emit('contacts:submit', {
                email: this.emailInput.value,
                phone: this.phoneInput.value
            });
        }
    }

    // render(data?: Partial<IContactsFormData>): HTMLElement {
    //     if (data) {
    //         if (data.email !== undefined) {
    //             this.emailInput.value = data.email;
    //         }
    //         if (data.phone !== undefined) {
    //             this.phoneInput.value = data.phone;
    //         }
    //     }
    //     this.checkAndEnableButton();
    //     return this.container;
    // }
}