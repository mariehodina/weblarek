import { Component } from '../base/Component';
import { IGalleryData } from '../../types';

export class Gallery extends Component<IGalleryData> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set catalog(items: HTMLElement[]) {
        if (items && items.length) {
            this.container.replaceChildren(...items);
        } else {
            this.container.innerHTML = '<p class="gallery__empty">Товары отсутствуют</p>';
        }
    }
}