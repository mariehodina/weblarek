import { Component } from "../base/Component";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected closeForm: HTMLButtonElement;
    protected totalForm: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this.closeForm = container.querySelector('.order-success__close') as HTMLButtonElement;
        this.totalForm = container.querySelector('.order-success__description') as HTMLElement;

        if (actions?.onClick) {
            this.closeForm.addEventListener('click', actions.onClick)
        }
    }

    set total(value: number) {
        this.totalForm.textContent = `Списано ${value.toLocaleString('ru-RU')} синапсов`
    }
}