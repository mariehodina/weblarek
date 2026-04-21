// src/components/Models/Buyer.ts
import { IBuyer } from '../../types';
import { EventEmitter } from '../base/Events';

export class Buyer {
    private data: IBuyer = {
        payment: 'card',
        email: '',
        phone: '',
        address: ''
    };
    private events: EventEmitter;

    constructor(events: EventEmitter) {
        this.events = events;
    }

    // Метод для установки одного поля
    setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        this.data[field] = value;
        this.events.emit('buyer:changed', this.data);
    }

    // Метод для установки нескольких полей
    setData(data: Partial<IBuyer>): void {
        this.data = { ...this.data, ...data };
        this.events.emit('buyer:changed', this.data);
    }

    // Получить все данные
    getData(): IBuyer {
        return this.data;
    }

    // Очистить данные
    clear(): void {
        this.data = {
            payment: 'card',
            email: '',
            phone: '',
            address: ''
        };
        this.events.emit('buyer:changed', this.data);
    }

    // Валидация
    validate(): Record<string, string> {
        const errors: Record<string, string> = {};
        
        if (!this.data.email) {
            errors.email = 'Введите email';
        } else if (!this.data.email.includes('@')) {
            errors.email = 'Неверный формат email';
        }
        
        if (!this.data.phone) {
            errors.phone = 'Введите телефон';
        } else if (this.data.phone.length < 10) {
            errors.phone = 'Слишком короткий номер';
        }
        
        if (!this.data.address) {
            errors.address = 'Введите адрес';
        }
        
        if (!this.data.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        
        return errors;
    }
}