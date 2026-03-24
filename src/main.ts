import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { Catalog } from './components/Models/Catalog';
import { ShoppingCart } from './components/Models/ShoppingCart';
import { Buyer } from './components/Models/Buyer';
import { IProduct } from './types';

// Импортируем тестовые данные
import { apiProducts } from './utils/data';

// Создаем экземпляр брокера событий
const events = new EventEmitter();

// Подписываемся на события для отслеживания работы моделей
events.on('catalog:changed', (data) => {
    console.log('Каталог обновлен:', data);
});

events.on('product:selected', (data) => {
    console.log('Выбран товар:', data);
});

events.on('cart:changed', (data) => {
    console.log('Корзина изменена:', data);
});

events.on('buyer:changed', (data) => {
    console.log('Данные покупателя изменены:', data);
});

console.log('=== НАЧАЛО ТЕСТИРОВАНИЯ МОДЕЛЕЙ ДАННЫХ ===\n');

// ========== ТЕСТИРОВАНИЕ МОДЕЛИ CATALOG ==========
console.log('1. ТЕСТИРОВАНИЕ МОДЕЛИ CATALOG');
console.log('----------------------------------------');

const catalog = new Catalog(events);

// Тест 1: Установка продуктов
console.log('✓ Тест 1: Установка продуктов в каталог');
catalog.setProducts(apiProducts.items);
console.log('Продукты установлены. Количество продуктов:', catalog.getProducts().length);

// Тест 2: Получение всех продуктов
console.log('\n✓ Тест 2: Получение всех продуктов');
const allProducts = catalog.getProducts();
console.log('Все продукты:', allProducts.map(p => ({ id: p.id, title: p.title, price: p.price })));

// Тест 3: Поиск продукта по ID
console.log('\n✓ Тест 3: Поиск продукта по ID');
const productId = apiProducts.items[0].id;
const foundProduct = catalog.getProductById(productId);
console.log(`Продукт с ID ${productId}:`, foundProduct);

// Тест 4: Поиск несуществующего продукта
console.log('\n✓ Тест 4: Поиск несуществующего продукта');
const nonExistentProduct = catalog.getProductById('non-existent-id');
console.log('Результат поиска несуществующего продукта:', nonExistentProduct);

// Тест 5: Выбор продукта
console.log('\n✓ Тест 5: Выбор продукта для детального просмотра');
const productToSelect = apiProducts.items[1];
catalog.setSelectedProduct(productToSelect);
const selectedProduct = catalog.getSelectedProduct();
console.log('Выбранный продукт:', selectedProduct);

console.log('\n✅ Тестирование модели CATALOG завершено\n');

// ========== ТЕСТИРОВАНИЕ МОДЕЛИ SHOPPING CART ==========
console.log('2. ТЕСТИРОВАНИЕ МОДЕЛИ SHOPPING CART');
console.log('----------------------------------------');

const cart = new ShoppingCart(events);

// Тест 1: Добавление товаров в корзину
console.log('✓ Тест 1: Добавление товаров в корзину');
cart.addItem(apiProducts.items[0]);
cart.addItem(apiProducts.items[1]);
cart.addItem(apiProducts.items[2]); // Товар с price = null
console.log('Товары в корзине:', cart.getItems().map(p => ({ title: p.title, price: p.price })));
console.log('Количество товаров:', cart.getItemCount());

// Тест 2: Проверка дублирования
console.log('\n✓ Тест 2: Проверка предотвращения дублирования');
cart.addItem(apiProducts.items[0]); // Попытка добавить уже существующий товар
console.log('После попытки добавить дубликат, количество товаров:', cart.getItemCount());

// Тест 3: Расчет общей стоимости
console.log('\n✓ Тест 3: Расчет общей стоимости');
const totalPrice = cart.getTotalPrice();
console.log('Общая стоимость корзины:', totalPrice);

// Тест 4: Проверка наличия товара в корзине
console.log('\n✓ Тест 4: Проверка наличия товара в корзине');
const containsFirst = cart.containsItem(apiProducts.items[0].id);
const containsThird = cart.containsItem(apiProducts.items[3].id);
console.log(`Товар "${apiProducts.items[0].title}" в корзине:`, containsFirst);
console.log(`Товар "${apiProducts.items[3].title}" в корзине:`, containsThird);

// Тест 5: Удаление товара из корзины
console.log('\n✓ Тест 5: Удаление товара из корзины');
cart.removeItem(apiProducts.items[0].id);
console.log('После удаления товара, количество товаров:', cart.getItemCount());
console.log('Оставшиеся товары:', cart.getItems().map(p => p.title));

// Тест 6: Очистка корзины
console.log('\n✓ Тест 6: Очистка корзины');
cart.clear();
console.log('После очистки, количество товаров:', cart.getItemCount());

console.log('\n✅ Тестирование модели SHOPPING CART завершено\n');

// ========== ТЕСТИРОВАНИЕ МОДЕЛИ BUYER ==========
console.log('3. ТЕСТИРОВАНИЕ МОДЕЛИ BUYER');
console.log('----------------------------------------');

const buyer = new Buyer(events);

// Тест 1: Получение начальных данных
console.log('✓ Тест 1: Получение начальных данных');
console.log('Начальные данные покупателя:', buyer.getData());

// Тест 2: Установка отдельных полей
console.log('\n✓ Тест 2: Установка отдельных полей');
buyer.setField('email', 'test@example.com');
buyer.setField('phone', '+7 999 123-45-67');
buyer.setField('address', 'г. Москва, ул. Тестовая, д. 1');
console.log('Данные после установки полей:', buyer.getData());

// Тест 3: Групповое обновление данных
console.log('\n✓ Тест 3: Групповое обновление данных');
buyer.setData({ 
    payment: 'cash',
    address: 'г. Санкт-Петербург, Невский пр., д. 10'
});
console.log('Данные после группового обновления:', buyer.getData());

// Тест 4: Валидация корректных данных
console.log('\n✓ Тест 4: Валидация корректных данных');
const validationErrors = buyer.validate();
console.log('Ошибки валидации (должны быть пустыми):', validationErrors);

// Тест 5: Валидация некорректных данных
console.log('\n✓ Тест 5: Валидация некорректных данных');
buyer.setData({
    email: 'invalid-email',
    phone: '123',
    address: ''
});
const invalidErrors = buyer.validate();
console.log('Ошибки валидации для некорректных данных:', invalidErrors);

// Тест 6: Очистка данных покупателя
console.log('\n✓ Тест 6: Очистка данных покупателя');
buyer.clear();
console.log('Данные после очистки:', buyer.getData());

console.log('\n✅ Тестирование модели BUYER завершено\n');

// ========== ДОПОЛНИТЕЛЬНЫЕ ТЕСТЫ ВЗАИМОДЕЙСТВИЯ МОДЕЛЕЙ ==========
console.log('4. ДОПОЛНИТЕЛЬНЫЕ ТЕСТЫ ВЗАИМОДЕЙСТВИЯ МОДЕЛЕЙ');
console.log('----------------------------------------');

// Тест: Добавление выбранного товара в корзину
console.log('✓ Тест: Добавление выбранного товара в корзину');
const productToAdd = catalog.getProducts()[0];
if (productToAdd) {
    console.log(`Выбран товар: ${productToAdd.title}`);
    catalog.setSelectedProduct(productToAdd);
    cart.addItem(productToAdd);
    console.log(`Товар добавлен в корзину. В корзине теперь ${cart.getItemCount()} товаров`);
    console.log('Общая стоимость:', cart.getTotalPrice());
}

console.log('\n=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===');
