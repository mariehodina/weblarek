import { Form } from '../base/Form';
import { IContactsFormData } from '../../types';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export class ContactsForm extends Form<IContactsFormData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected _email: string = '';
    protected _phone: string = '';

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container, events);
        
        this.emailInput = ensureElement<HTMLInputElement>('.form__input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('.form__input[name="phone"]', this.container);
        
        this.emailInput.addEventListener('input', () => {
            this._email = this.emailInput.value;
            this.onInputChange('email', this._email);
        });
        
        this.phoneInput.addEventListener('input', () => {
            this._phone = this.phoneInput.value;
            this.onInputChange('phone', this._phone);
        });
    }

    protected onInputChange(field: keyof IContactsFormData, value: string): void {
        if (field === 'email') {
            this._email = value;
        } else if (field === 'phone') {
            this._phone = value;
        }
        
        const isValid = this._email.trim() !== '' && this._phone.trim() !== '';
        this.setValid(isValid);
        
        this.events.emit('contacts:change', {
            email: this._email,
            phone: this._phone
        });
    }

    set email(value: string) {
        this._email = value;
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this._phone = value;
        this.phoneInput.value = value;
    }

    getFormData(): IContactsFormData {
        return {
            email: this._email,
            phone: this._phone
        };
    }

    reset(): void {
        this._email = '';
        this._phone = '';
        this.emailInput.value = '';
        this.phoneInput.value = '';
        this.setValid(false);
        this.clearErrors();
    }

    render(data?: Partial<IContactsFormData>): HTMLElement {
        if (data?.email !== undefined) this.email = data.email;
        if (data?.phone !== undefined) this.phone = data.phone;
        return this.container;
    }
}