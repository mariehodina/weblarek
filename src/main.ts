import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Catalog } from './components/Models/Catalog';
import { ShoppingCart } from './components/Models/ShoppingCart';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';
import { LarekApi } from "./components/View/larekApi";
import { CardCatalog } from './components/View/CardCatalog';
import { CardBasket } from './components/View/CardBasket';
import { Gallery } from './components/View/Gallery';
import { Header } from './components/View/Header';
import { Modal } from './components/View/Modal';
import { cloneTemplate } from './utils/utils';
import { Basket } from './components/View/Basket'; 


const events = new EventEmitter();
const catalogModel = new Catalog(events);
const cartModel = new ShoppingCart(events);
const buyerModel = new Buyer(events);
const larekApi = new LarekApi(API_URL);


const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const headerContainer = document.querySelector('.header') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;


const gallery = new Gallery(galleryContainer);
const header = new Header(headerContainer, events);
const modal = new Modal(modalContainer, events);

const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;

const createCatalogCard = (item: any): HTMLElement => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
    card.id = item.id;
    card.title = item.title;
    card.price = item.price;
    card.category = item.category;
    card.image = item.image;
    return card.render(item);
};


const renderCatalog = (): void => {
    const products = catalogModel.getProducts();
    const cards = products.map(createCatalogCard);
    gallery.catalog = cards;
    console.log('Каталог обновлен:', cards.length, 'карточек');
};


const updateCartCounter = (): void => {
    header.counter = cartModel.getItemCount();
};

events.on('catalog:changed', renderCatalog);

events.on('card:select', (data: { id: string }) => {
    console.log('Выбран товар:', data.id);
    const product = catalogModel.getProductById(data.id);
    if (product) {
        catalogModel.setSelectedProduct(product);
        console.log('Детали:', product.title);
    }
});


events.on('card:add-to-basket', (data: { id: string }) => {
    const product = catalogModel.getProductById(data.id);
    if (product) {
        cartModel.addItem(product);
        console.log(`Добавлено в корзину: ${product.title}`);
    }
});


events.on('cart:changed', () => {
    console.log('Корзина:', cartModel.getItemCount(), 'товаров на сумму', cartModel.getTotalPrice());
    updateCartCounter();
});

events.on('header:basket-open', () => {
    console.log('Открываем корзину');
    
    const items = cartModel.getItems();
  
const basketCards = items.map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);
    card.id = item.id;        
    card.title = item.title;
    card.price = item.price;
    card.index = index + 1;
    return card.render();     
});
    
    const basket = new Basket(cloneTemplate(basketTemplate), events);
    basket.items = basketCards;
    basket.total = cartModel.getTotalPrice();
    
    modal.setContent(basket.render());
    modal.open();
});

events.on('basket:remove', (data: { id: string }) => {
    console.log('Удаление товара:', data.id);
    cartModel.removeItem(data.id);
    events.emit('header:basket-open'); 
});

events.on('modal:open', () => {
    console.log('Модальное окно открыто');
});

events.on('modal:close', () => {
    console.log('Модальное окно закрыто');
});

events.on('buyer:changed', (data) => {
    console.log('Покупатель:', data);
});




const loadProducts = async (): Promise<void> => {
    try {
        const data = await larekApi.getProducts();
        console.log('Загружено с сервера:', data.length);
        catalogModel.setProducts(data);
    } catch (err) {
        console.log('Ошибка, использую тестовые данные');
        catalogModel.setProducts(apiProducts.items);
    } finally {
        events.emit('catalog:changed');
    }
};

loadProducts();






console.log('начало тестирования модели данных');
console.log('тестирование модели Catalog');
const catalog = new Catalog();
console.log('Установка продуктов в каталог');
catalog.setProducts(apiProducts.items);
console.log('Продукты установлены. Количество продуктов:', catalog.getProducts().length);
console.log('Получение всех продуктов');
const allProducts = catalog.getProducts();
console.log('Все продукты:', allProducts.map(p => ({ id: p.id, title: p.title, price: p.price })));
console.log('Поиск продукта по ID');
const productId = apiProducts.items[0].id;
const foundProduct = catalog.getProductById(productId);
console.log(`Продукт с ID ${productId}:`, foundProduct);
console.log('Поиск несуществующего продукта');
const nonExistentProduct = catalog.getProductById('non-existent-id');
console.log('Результат поиска несуществующего продукта:', nonExistentProduct);
console.log('Выбор продукта для детального просмотра');
const productToSelect = apiProducts.items[1];
catalog.setSelectedProduct(productToSelect);
const selectedProduct = catalog.getSelectedProduct();
console.log('Выбранный продукт:', selectedProduct);
console.log('Тестирование модели каталог завершено');


console.log('тестирование модели ShoppingCart');
const cart = new ShoppingCart(events);
console.log('Добавление товаров в корзину');
cart.addItem(apiProducts.items[0]);
cart.addItem(apiProducts.items[1]);
cart.addItem(apiProducts.items[2]); 
console.log('Товары в корзине:', cart.getItems().map(p => ({ title: p.title, price: p.price })));
console.log('Количество товаров:', cart.getItemCount());
console.log('Проверка предотвращения дублирования');
cart.addItem(apiProducts.items[0]); 
console.log('После попытки добавить дубликат, количество товаров:', cart.getItemCount());
console.log('Расчет общей стоимости');
const totalPrice = cart.getTotalPrice();
console.log('Общая стоимость корзины:', totalPrice);
console.log('Проверка наличия товара в корзине');
const containsFirst = cart.containsItem(apiProducts.items[0].id);
const containsThird = cart.containsItem(apiProducts.items[3].id);
console.log(`Товар "${apiProducts.items[0].title}" в корзине:`, containsFirst);
console.log(`Товар "${apiProducts.items[3].title}" в корзине:`, containsThird);
console.log('Удаление товара из корзины');
cart.removeItem(apiProducts.items[0].id);
console.log('После удаления товара, количество товаров:', cart.getItemCount());
console.log('Оставшиеся товары:', cart.getItems().map(p => p.title));
console.log('Очистка корзины');
cart.clear();
console.log('После очистки, количество товаров:', cart.getItemCount());
console.log('Тестирование модели SHOPPING CART завершено');
console.log('тестирование модели BUYER');
const buyer = new Buyer(events);
console.log(' Получение начальных данных');
console.log('Начальные данные покупателя:', buyer.getData());
console.log('Установка отдельных полей');
buyer.setField('email', 'test@example.com');
buyer.setField('phone', '+375333215210');
buyer.setField('address', 'г. Москва, ул. Луч, д. 1');
console.log('Данные после установки полей:', buyer.getData());
console.log('Валидация корректных данных');
const validationErrors = buyer.validate();
console.log('Ошибки валидации (должны быть пустыми):', validationErrors);
console.log('Очистка данных покупателя');
buyer.clear();
console.log('Данные после очистки:', buyer.getData());
console.log('Тестирование модели BUYER завершено');
console.log('Добавление выбранного товара в корзину');
const productToAdd = catalog.getProducts()[0];
if (productToAdd) {
    console.log(`Выбран товар: ${productToAdd.title}`);
    catalog.setSelectedProduct(productToAdd);
    cart.addItem(productToAdd);
    console.log(`Товар добавлен в корзину. В корзине теперь ${cart.getItemCount()} товаров`);
    console.log('Общая стоимость:', cart.getTotalPrice());
}








