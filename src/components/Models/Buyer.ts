import { IBuyer, IEvents, TPayment, TValidationErrors } from '../../types';
import { EventEmitter } from '../base/Events'

export class Buyer {
    private _data: IBuyer = {
        payment: null,
        email: '',
        phone: '',
        address: ''
    };
    private events: IEvents;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    setField<T extends keyof IBuyer>(field: T, value: IBuyer[T]): void {
        this._data[field] = value;
        this.events.emit('покупатель изменен', { data: this._data });
    }
    setData(data: Partial<IBuyer>): void {
        this._data = { ...this._data, ...data };
        this.events.emit('покупатель изменен', { data: this._data });
    }
    getData(): IBuyer {
        return this._data;
    }
    clear(): void {
        this._data = {
            payment: null,
            email: '',
            phone: '',
            address: ''
        };
        this.events.emit('покупатель изменен', { data: this._data });
    }
    validate(): TValidationErrors {
        const errors: TValidationErrors = {};

        if (!this._data.email) {
            errors.email = 'Введите корректный email адрес';
        } 
        if (!this._data.phone) {
            errors.phone = 'Введите корректный номер телефона';
        } 
        if (!this._data.address) {
            errors.address = 'Адрес некорректный';
        } 
        if (!this._data.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        return errors;
    }
}