import './scss/styles.scss';
import { Catalog } from './components/Models/Catalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { ApiServise } from './components/Models/ApiService';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, TPayment } from './types';
import { apiProducts } from './utils/data';

import { ShoppingCart } from './components/View/ShoppingCart';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { CardBasket } from './components/View/CardBasket';
import { ContactsForm } from './components/View/ContactsForm';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { OrderForm } from './components/View/OrderForm';
import { Success } from './components/View/orderSuccess';

const events = new EventEmitter();
const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);
const api = new Api(API_URL);
const apiService = new ApiServise(api);

const header = new Header(ensureElement('.header'), events);
const modal = new Modal(ensureElement('#modal-container'));
const gallery = ensureElement<HTMLElement>('.gallery');

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const shoppingCartView = new ShoppingCart(cloneTemplate(basketTemplate), events);
shoppingCartView.render({ items: [], total: 0, valid: false });
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate) as HTMLFormElement, events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate) as HTMLFormElement, events);
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit('preview:buttonClick')
});

function renderBasket() {
    const items = basket.getItems();
    const cards = items.map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('card:remove', item)
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });
    shoppingCartView.render({
        items: cards,
        total: basket.getTotal(),
        valid: items.length > 0
    });
}

function renderCatalog() {
    const products = catalog.getProducts();
    const cards = products.map((product) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', product),
        });
        return card.render({
            price: product.price,
            title: product.title,
            image: { src: CDN_URL + product.image, alt: product.title },
            category: product.category,
        });
    });
    gallery.replaceChildren(...cards);
}

events.on('item:changed', renderCatalog);

events.on('card:select', (product: IProduct) => {
    catalog.setSelectedProduct(product);
});

events.on('preview:changed', () => {
    const product = catalog.getSelectedProduct();
    if (!product) return;
    const inBasket = basket.contains(product.id);
    const content = cardPreview.render({
        title: product.title,
        image: { src: CDN_URL + product.image, alt: product.title },
        category: product.category,
        description: product.description,
        price: product.price,
        buttonText: product.price === null ? 'Недоступно' : inBasket ? 'Удалить из корзины' : 'Купить',
        buttonNone: product.price === null
    });
    modal.render({ content });
    modal.open();
});

events.on('preview:buttonClick', () => {
    const product = catalog.getSelectedProduct();
    if (!product) return;
    if (basket.contains(product.id)) {
        basket.removeItem(product.id);
    } else {
        if (product.price !== null) {
            basket.addItem(product);
        }
    }
    modal.close();
});

events.on('card:remove', (product: IProduct) => {
    basket.removeItem(product.id);
});

events.on('basket:changed', () => {
    header.counter = basket.getCount();
    renderBasket();
});

events.on('basket:open', () => {
    renderBasket();
    modal.render({ content: shoppingCartView.render() });
    modal.open();
});

events.on('order:open', () => {
    const data = buyer.getData();
    orderForm.payment = data.payment;
    orderForm.address = data.address;
    modal.render({
        content: orderForm.render({ valid: false, errors: [] })
    });
    modal.open();
});

events.on('order.payment:change', (data: { target: string }) => {
    buyer.setField('payment', data.target as TPayment);
    events.emit('buyer:changed');
});

events.on('order.address:change', (data: { field: string; value: string }) => {
    buyer.setField('address', data.value);
    events.emit('buyer:changed');
});

events.on('order:submit', () => {
    const data = buyer.getData();
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    modal.render({
        content: contactsForm.render({ valid: false, errors: [] })
    });
    modal.open();
});

events.on('contacts.email:change', (data: { field: string; value: string }) => {
    buyer.setField('email', data.value);
    events.emit('buyer:changed');
});

events.on('contacts.phone:change', (data: { field: string; value: string }) => {
    buyer.setField('phone', data.value);
    events.emit('buyer:changed');
});

events.on('contacts:submit', () => {
    const buyerData = buyer.getData();
    const order = {
        items: basket.getItems().map((item) => item.id),
        total: basket.getTotal(),
        payment: buyerData.payment,
        address: buyerData.address,
        email: buyerData.email,
        phone: buyerData.phone
    };
    apiService.createOrder(order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    basket.clear();
                    buyer.clear();
                }
            });
            modal.render({
                content: success.render({
                    total: result.total
                })
            });
            modal.open();
        });
});

events.on('buyer:changed', () => {
    const errors = buyer.validate();
    const data = buyer.getData();
    const orderErrors: string[] = [];
    if (errors.payment) orderErrors.push(errors.payment);
    if (errors.address) orderErrors.push(errors.address);
    orderForm.payment = data.payment;
    orderForm.address = data.address;
    orderForm.render({ valid: orderErrors.length === 0, errors: orderErrors });
    const contactsErrors: string[] = [];
    if (errors.email) contactsErrors.push(errors.email);
    if (errors.phone) contactsErrors.push(errors.phone);
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    contactsForm.render({ valid: contactsErrors.length === 0, errors: contactsErrors });
});

apiService.getProducts()
    .then((data) => {
        catalog.setProducts(data.items);
    })
    .catch(() => {
        catalog.setProducts(apiProducts.items);
    });