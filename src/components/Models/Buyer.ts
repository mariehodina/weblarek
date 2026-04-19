import { IBuyer, TPayment } from '../../types';
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
    getData(): IBuyer {
        return { ...this.data };
    }
    setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
        const oldValue = this.data[field];
        this.data[field] = value;
        this.events.emit('buyer:field:change', { field, value, oldValue });
        this.emitBuyerChange();
    }
    setPayment(payment: TPayment): void {
        this.setField('payment', payment);
    }
    setEmail(email: string): void {
        this.setField('email', email);
    }
    setPhone(phone: string): void {
        this.setField('phone', phone);
    }
    setAddress(address: string): void {
        this.setField('address', address);
    }
    clear(): void {
        const oldData = { ...this.data };
        this.data = {
            payment: 'card',
            email: '',
            phone: '',
            address: ''
        };
        this.events.emit('buyer:clear', { oldData });
        this.emitBuyerChange();
    }
    validate(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};
        
        if (!this.data.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.data.email || !this.data.email.includes('@')) {
            errors.email = 'Укажите корректный email';
        }
        if (!this.data.phone || this.data.phone.length < 10) {
            errors.phone = 'Укажите корректный телефон';
        }
        if (!this.data.address || this.data.address.trim() === '') {
            errors.address = 'Укажите адрес доставки';
        }
        
        this.events.emit('buyer:validate', { errors, isValid: Object.keys(errors).length === 0 });
        return errors;
    }
    isComplete(): boolean {
        const isValid = this.data.email !== '' && 
                        this.data.phone !== '' && 
                        this.data.address !== '' && 
                        this.data.payment !== null;
        this.events.emit('buyer:complete', { isComplete: isValid });
        return isValid;
    }
    private emitBuyerChange(): void {
        this.events.emit('buyer:changed', {
            data: { ...this.data },
            isValid: this.validate()
        });
    }
}