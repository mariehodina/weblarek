import { IBuyer, IEvents, TPayment } from '../../types';
import { EventEmitter } from '../base/Events'

export class Buyer {
    private _data: IBuyer = {
        payment: 'card',
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
        this.events.emit('buyer:changed', { data: this._data });
    }
    setData(data: Partial<IBuyer>): void {
        this._data = { ...this._data, ...data };
        this.events.emit('buyer:changed', { data: this._data });
    }
    getData(): IBuyer {
        return this._data;
    }
    clear(): void {
        this._data = {
            payment: 'card',
            email: '',
            phone: '',
            address: ''
        };
        this.events.emit('покупатель изменен', { data: this._data });
    }
    validate(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};
        // Валидация email
        if (!this._data.email) {
            errors.email = 'Email обязателен для заполнения';
        } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(this._data.email)) {
            errors.email = 'Введите корректный email адрес';
        }
        // Валидация телефона
        if (!this._data.phone) {
            errors.phone = 'Телефон обязателен для заполнения';
        } else if (!/^[\d\s\+\(\)\-]+$/.test(this._data.phone)) {
            errors.phone = 'Введите корректный номер телефона';
        }
        // Валидация адреса
        if (!this._data.address) {
            errors.address = 'Адрес обязателен для заполнения';
        } else if (this._data.address.length < 5) {
            errors.address = 'Адрес должен содержать минимум 5 символов';
        }
        // Валидация способа оплаты
        if (!this._data.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        return errors;
    }
}