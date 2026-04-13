import { Component } from './Component';

export abstract class Card<T> extends Component<T> {
    protected container: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.container = container;
    }
}