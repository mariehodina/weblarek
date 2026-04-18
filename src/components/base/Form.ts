
import { Component } from './Component';
import { EventEmitter } from './Events';

export abstract class Form<T> extends Component<T> {
    protected events: EventEmitter;
    protected formElement: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected _isValid: boolean = false;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this.formElement = container as HTMLFormElement;
        this.submitButton = this.formElement.querySelector('.form__submit') as HTMLButtonElement;
        
        this.formElement.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            if (this._isValid) {
                this.onSubmit();
            }
        });
    }

    protected abstract onInputChange(field: keyof T, value: string): void;

    protected onSubmit(): void {
        this.events.emit(`${this.formElement.id}:submit`);
    }

    protected setValid(value: boolean): void {
        this._isValid = value;
        if (this.submitButton) {
            this.submitButton.disabled = !value;
        }
    }

    protected setError(field: keyof T, message: string): void {
        const errorElement = this.formElement.querySelector(`.form__error_${String(field)}`);
        if (errorElement) {
            this.setText(errorElement as HTMLElement, message);
        }
    }

    protected clearErrors(): void {
        const errors = this.formElement.querySelectorAll('[class*="form__error_"]');
        errors.forEach(error => {
            this.setText(error as HTMLElement, '');
        });
    }
}