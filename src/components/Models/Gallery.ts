import { Component } from '../base/Component';
import { IGalleryData } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Gallery extends Component<IGalleryData> {
    protected catalogElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.catalogElement = ensureElement<HTMLElement>('.gallery__catalog', this.container);
    }

    set catalog(items: HTMLElement[]) {
        if (items && items.length) {
            this.catalogElement.replaceChildren(...items);
        } else {
            this.catalogElement.innerHTML = '<p class="gallery__empty">Товары отсутствуют</p>';
        }
    }

    get catalog(): HTMLElement[] {
        return Array.from(this.catalogElement.children) as HTMLElement[];
    }

    clear(): void {
        this.catalogElement.innerHTML = '';
    }
}