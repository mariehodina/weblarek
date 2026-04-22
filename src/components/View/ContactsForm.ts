import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IContactsFormData {
    email: string;
    phone: string;
}

export class ContactsForm extends Component<IContactsFormData> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected errorElement: HTMLElement;
    protected events: EventEmitter;
    protected _email: string = '';
    protected _phone: string = '';
    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.emailInput.addEventListener('input', () => {
            this._email = this.emailInput.value;
            this.validate();
        });
        
        this.phoneInput.addEventListener('input', () => {
            this._phone = this.phoneInput.value;
            this.validate();
        });
        
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validate()) {
                this.events.emit('contacts:submit', {
                    email: this._email,
                    phone: this._phone
                });
            }
        });
        
        this.validate();
    }

    validate(): boolean {
        const emailValid = this._email.includes('@') && this._email.length > 3;
        const phoneValid = this._phone.length >= 10;
        const isValid = emailValid && phoneValid;
        this.submitButton.disabled = !isValid;
         if (!emailValid && !phoneValid) {
            this.setText(this.errorElement, '');
        } else if  (!emailValid) {
            this.setText(this.errorElement, 'Необходимо ввести email');
        } else if (!phoneValid) {
            this.setText(this.errorElement, 'Необходимо ввести номер телефона');
        } else {
            this.setText(this.errorElement, '');
        }
        
        return isValid;
    }

    reset(): void {
        this._email = '';
        this._phone = '';
        this.emailInput.value = '';
        this.phoneInput.value = '';
        this.submitButton.disabled = true;
        this.setText(this.errorElement, '');
    }

    render(data?: Partial<IContactsFormData>): HTMLElement {
        if (data) {
            if (data.email !== undefined) {
                this._email = data.email;
                this.emailInput.value = data.email;
            }
            if (data.phone !== undefined) {
                this._phone = data.phone;
                this.phoneInput.value = data.phone;
            }
        }
        this.validate();
        return this.container;
    }
}