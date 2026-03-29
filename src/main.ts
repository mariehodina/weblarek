import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Catalog } from './components/Models/Catalog';
import { ShoppingCart } from './components/Models/ShoppingCart';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';
import { ApiService } from './components/Models/ApiService';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
const events = new EventEmitter();
events.on('Каталог обновлен', (data) => {
    console.log('Каталог обновлен:', data);
});
events.on('Выбран товар', (data) => {
    console.log('Выбран товар:', data);
});
events.on('Ворзина изменена', (data) => {
    console.log('Корзина изменена:', data);
});
events.on('Ванные покупателя изменены', (data) => {
    console.log('Данные покупателя изменены:', data);
});


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

const api = new Api(API_URL);
const apiService = new ApiService(api);
apiService.getProducts()
.then((products) => {
    console.log('данные получены', products);
})
.catch ((error) => {
    console.error('ошибка. данные не получены', error);
})

