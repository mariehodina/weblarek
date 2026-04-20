import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class Modal extends Component<object> {
    protected modalElement: HTMLElement;
    protected contentElement: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected events: EventEmitter;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this.events = events;
        
        this.modalElement = container;
        this.contentElement = container.querySelector('.modal__content') as HTMLElement;
        this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
        
        this.closeButton.addEventListener('click', () => this.close());
        
        this.modalElement.addEventListener('click', (event) => {
            if (event.target === this.modalElement) {
                this.close();
            }
        });
        
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.modalElement.classList.contains('modal_active')) {
                this.close();
            }
        });
    }

    open(): void {
        this.modalElement.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.modalElement.classList.remove('modal_active');
        this.contentElement.innerHTML = '';
        this.events.emit('modal:close');
    }

    setContent(content: HTMLElement): void {
        this.contentElement.innerHTML = '';
        this.contentElement.appendChild(content);
    }

    render(data?: object): HTMLElement {
        return this.container;
    }
}