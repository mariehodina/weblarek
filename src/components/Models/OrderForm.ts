import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export abstract class Form<T> extends Component<T> {
    protected events: EventEmitter;
    protected formElement: HTMLFormElement;
    protected submitButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        this.formElement = container as HTMLFormElement;

        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        
        this.submitButton = container.querySelector('button') as HTMLButtonElement;
        
        this.formElement.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            this.onInputChange(target);
        });
        
        this.formElement.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.onSubmit();
        });
    }

    protected onInputChange(target: HTMLInputElement): void {
    }

    protected onSubmit(): void {
    }

    protected setValid(value: boolean): void {
        this.submitButton.disabled = !value;
    }
}