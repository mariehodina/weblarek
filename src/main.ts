import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Catalog } from "./components/Models/Catalog";
import { ShoppingCart } from "./components/Models/ShoppingCart";
import { Buyer } from "./components/Models/Buyer";
import { apiProducts } from "./utils/data";
import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi } from "./components/View/larekApi";
import { CardCatalog } from "./components/View/CardCatalog";
import { CardBasket } from "./components/View/CardBasket";
import { Gallery } from "./components/View/Gallery";
import { Header } from "./components/View/Header";
import { Modal } from "./components/View/Modal";
import { cloneTemplate } from "./utils/utils";
import { Basket } from "./components/View/Basket";
import { OrderForm } from "./components/View/OrderForm";
import { ContactsForm } from "./components/View/ContactsForm";
import { CardPreview } from './components/View/CardPreview';

const events = new EventEmitter();
const catalogModel = new Catalog(events);
const cartModel = new ShoppingCart(events);
const buyerModel = new Buyer(events);
const larekApi = new LarekApi(API_URL);

const galleryContainer = document.querySelector(".gallery") as HTMLElement;
const headerContainer = document.querySelector(".header") as HTMLElement;
const modalContainer = document.querySelector("#modal-container") as HTMLElement;

const gallery = new Gallery(galleryContainer);
const header = new Header(headerContainer, events);
const modal = new Modal(modalContainer, events);

const cardCatalogTemplate = document.querySelector("#card-catalog") as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector("#card-basket") as HTMLTemplateElement;
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;
const contactsTemplate = document.querySelector("#contacts") as HTMLTemplateElement;
const successTemplate = document.querySelector("#success") as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector("#card-preview") as HTMLTemplateElement;

// Проверка наличия шаблонов
console.log('Шаблон card-catalog:', cardCatalogTemplate);
console.log('Шаблон basket:', basketTemplate);

const createCatalogCard = (item: any): HTMLElement => {
    console.log('Создаю карточку:', item.title);
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
    card.id = item.id;
    card.title = item.title;
    card.price = item.price;
    card.category = item.category;
    card.image = item.image;
    return card.render(item);
};

const renderCatalog = (): void => {
    console.log('renderCatalog вызван');
    const products = catalogModel.getProducts();
    console.log('Товаров в модели:', products.length);
    const cards = products.map(createCatalogCard);
    console.log('Создано карточек:', cards.length);
    gallery.catalog = cards;
};

const updateCartCounter = (): void => {
    header.counter = cartModel.getItemCount();
};

// Прямая загрузка без async/await
const loadProducts = (): void => {
    console.log('loadProducts вызван');
    
    // Сразу устанавливаем тестовые данные для проверки
    // const testProducts = apiProducts.items.map((item: any) => ({
    //     ...item,
    //     image: CDN_URL + item.image
    // }));
    // catalogModel.setProducts(testProducts);
    // console.log('Установлены тестовые товары:', testProducts.length);
    // events.emit('catalog:changed');
    
    // Потом пробуем загрузить с сервера
    larekApi.getProducts()
    .then((response: any) => {
        console.log('Данные с сервера получены');
        let products = response.items || response;
        products = products.map((item: any) => ({
            ...item,
            image: CDN_URL + item.image
        }));
        catalogModel.setProducts(products);
        events.emit('catalog:changed');
    });
};

events.on("catalog:changed", renderCatalog);

events.on('card:add-to-basket', (data: { id: string }) => {
    const product = catalogModel.getProductById(data.id);
    if (product && product.price !== null) {
        cartModel.addItem(product);
        updateCartCounter();
    }
});

events.on("cart:changed", () => {
    updateCartCounter();
});

events.on("header:basket-open", () => {
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


events.on('card:select', (data: { id: string }) => {
    const product = catalogModel.getProductById(data.id);
    if (product) {
        const previewCard = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
        modal.setContent(previewCard.render({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            description: product.description
        }));
        modal.open();
    }
});
events.on('card:add-to-basket', (data: { id: string }) => {
    const product = catalogModel.getProductById(data.id);
    if (product && product.price !== null) {
        cartModel.addItem(product);
        updateCartCounter();
        modal.close();
    }
});
events.on('basket:remove', (data: { id: string }) => {
    cartModel.removeItem(data.id);
    updateCartCounter();
    modal.close();
});



events.on("basket:order", () => {
    const orderFormContainer = cloneTemplate(orderTemplate);
    const orderForm = new OrderForm(orderFormContainer, events);
    modal.setContent(orderForm.render());
    modal.open();
});

events.on("order:submit", (data: { payment: "card" | "cash"; address: string }) => {
    buyerModel.setField("payment", data.payment);
    buyerModel.setField("address", data.address);
    const contactsFormContainer = cloneTemplate(contactsTemplate);
    const contactsForm = new ContactsForm(contactsFormContainer, events);
    modal.setContent(contactsForm.render());
    modal.open();
});




events.on('contacts:submit', (data: { email: string, phone: string }) => {
    buyerModel.setField('email', data.email);
    buyerModel.setField('phone', data.phone);
    
    const validItems = cartModel.getItems().filter(item => item.price !== null);
    const totalPrice = validItems.reduce((sum, item) => sum + (item.price || 0), 0);
    
    const order = {
        items: validItems.map(item => item.id),
        total: totalPrice,
        payment: buyerModel.getData().payment,
        address: buyerModel.getData().address,
        email: buyerModel.getData().email,
        phone: buyerModel.getData().phone
    };
    
    larekApi.post('/order', order)
        .then((result: any) => {
            cartModel.clear();
            updateCartCounter();
            events.emit('order:success', { total: result.total || order.total });
        });
});

events.on("order:success", (data: { total: number }) => {
    const successContainer = cloneTemplate(successTemplate);
    const successDescription = successContainer.querySelector(".order-success__description") as HTMLElement;
    const closeButton = successContainer.querySelector(".order-success__close") as HTMLButtonElement;

    if (successDescription) {
        successDescription.textContent = `Списано ${data.total} синапсов`;
    }
    closeButton.addEventListener("click", () => {
        modal.close();
    });
    modal.setContent(successContainer);
    modal.open();
});

// ЗАПУСК
loadProducts();








console.log("начало тестирования модели данных");
console.log("тестирование модели Catalog");
const catalog = new Catalog();
console.log("Установка продуктов в каталог");
catalog.setProducts(apiProducts.items);
console.log(
  "Продукты установлены. Количество продуктов:",
  catalog.getProducts().length,
);
console.log("Получение всех продуктов");
const allProducts = catalog.getProducts();
console.log(
  "Все продукты:",
  allProducts.map((p) => ({ id: p.id, title: p.title, price: p.price })),
);
console.log("Поиск продукта по ID");
const productId = apiProducts.items[0].id;
const foundProduct = catalog.getProductById(productId);
console.log(`Продукт с ID ${productId}:`, foundProduct);
console.log("Поиск несуществующего продукта");
const nonExistentProduct = catalog.getProductById("non-existent-id");
console.log("Результат поиска несуществующего продукта:", nonExistentProduct);
console.log("Выбор продукта для детального просмотра");
const productToSelect = apiProducts.items[1];
catalog.setSelectedProduct(productToSelect);
const selectedProduct = catalog.getSelectedProduct();
console.log("Выбранный продукт:", selectedProduct);
console.log("Тестирование модели каталог завершено");
console.log("тестирование модели ShoppingCart");
const cart = new ShoppingCart(events);
console.log("Добавление товаров в корзину");
cart.addItem(apiProducts.items[0]);
cart.addItem(apiProducts.items[1]);
cart.addItem(apiProducts.items[2]);
console.log(
  "Товары в корзине:",
  cart.getItems().map((p) => ({ title: p.title, price: p.price })),
);
console.log("Количество товаров:", cart.getItemCount());
console.log("Проверка предотвращения дублирования");
cart.addItem(apiProducts.items[0]);
console.log(
  "После попытки добавить дубликат, количество товаров:",
  cart.getItemCount(),
);
console.log("Расчет общей стоимости");
const totalPrice = cart.getTotalPrice();
console.log("Общая стоимость корзины:", totalPrice);
console.log("Проверка наличия товара в корзине");
const containsFirst = cart.containsItem(apiProducts.items[0].id);
const containsThird = cart.containsItem(apiProducts.items[3].id);
console.log(`Товар "${apiProducts.items[0].title}" в корзине:`, containsFirst);
console.log(`Товар "${apiProducts.items[3].title}" в корзине:`, containsThird);
console.log("Удаление товара из корзины");
cart.removeItem(apiProducts.items[0].id);
console.log("После удаления товара, количество товаров:", cart.getItemCount());
console.log(
  "Оставшиеся товары:",
  cart.getItems().map((p) => p.title),
);
console.log("Очистка корзины");
cart.clear();
console.log("После очистки, количество товаров:", cart.getItemCount());
console.log("Тестирование модели SHOPPING CART завершено");
console.log("тестирование модели BUYER");
const buyer = new Buyer(events);
console.log(" Получение начальных данных");
console.log("Начальные данные покупателя:", buyer.getData());
console.log("Установка отдельных полей");
buyer.setField("email", "test@example.com");
buyer.setField("phone", "+375333215210");
buyer.setField("address", "г. Москва, ул. Луч, д. 1");
console.log("Данные после установки полей:", buyer.getData());
console.log("Валидация корректных данных");
const validationErrors = buyer.validate();
console.log("Ошибки валидации (должны быть пустыми):", validationErrors);
console.log("Очистка данных покупателя");
buyer.clear();
console.log("Данные после очистки:", buyer.getData());
console.log("Тестирование модели BUYER завершено");
console.log("Добавление выбранного товара в корзину");
const productToAdd = catalog.getProducts()[0];
if (productToAdd) {
  console.log(`Выбран товар: ${productToAdd.title}`);
  catalog.setSelectedProduct(productToAdd);
  cart.addItem(productToAdd);
  console.log(
    `Товар добавлен в корзину. В корзине теперь ${cart.getItemCount()} товаров`,
  );
  console.log("Общая стоимость:", cart.getTotalPrice());
}
