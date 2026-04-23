import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Catalog } from "./components/Models/Catalog";
import { ShoppingCart } from "./components/Models/ShoppingCart";
import { Buyer } from "./components/Models/Buyer";
import { apiProducts } from "./utils/data";
import { API_URL, CDN_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { ApiService } from "./components/Models/ApiService";
import { CardCatalog } from "./components/View/CardCatalog";
import { CardBasket } from "./components/View/CardBasket";
import { Gallery } from "./components/View/Gallery";
import { Header } from "./components/View/Header";
import { Modal } from "./components/View/Modal";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Basket } from "./components/View/Basket";
import { OrderForm } from "./components/View/OrderForm";
import { ContactsForm } from "./components/View/ContactsForm";
import { CardPreview } from "./components/View/CardPreview";

//инициализация
const events = new EventEmitter();
const catalogModel = new Catalog(events);
const cartModel = new ShoppingCart(events);
const buyerModel = new Buyer(events);
const api = new Api(API_URL);
const apiService = new ApiService(api);

// дом элементы
const galleryContainer = ensureElement<HTMLElement>(".gallery");
const headerContainer = ensureElement<HTMLElement>(".header");
const modalContainer = ensureElement<HTMLElement>("#modal-container");

// шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");

// компоненты
const gallery = new Gallery(galleryContainer);
const header = new Header(headerContainer, events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

// функции
const updateCartCounter = (): void => {
  header.counter = cartModel.getItemCount();
};

const renderCatalog = (): void => {
  const products = catalogModel.getProducts();
  const cards = products.map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: (id) => {
        events.emit("card:select", { id });
      },
    });
    return card.render(item);
  });
  gallery.catalog = cards;
};

const renderBasket = (): void => {
  const items = cartModel.getItems();
  const basketCards = items.map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), events);
    return card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });
  basket.items = basketCards;
  basket.total = cartModel.getTotalPrice();
};

// загружаем товары
const loadProducts = (): void => {
  apiService
    .getProducts()
    .then((products) => {
      const productsWithImages = products.map((item: any) => ({
        ...item,
        image: CDN_URL + item.image,
      }));
      catalogModel.setProducts(productsWithImages);
      events.emit("catalog:changed");
    })
    .catch(() => {
      const testProducts = apiProducts.items.map((item: any) => ({
        ...item,
        image: CDN_URL + item.image,
      }));
      catalogModel.setProducts(testProducts);
      events.emit("catalog:changed");
    });
};

events.on("catalog:changed", renderCatalog);
events.on("cart:changed", () => {
  updateCartCounter();
  renderBasket();
});

events.on("card:select", (data: { id: string }) => {
  const product = catalogModel.getProductById(data.id);
  if (product) {
    const inBasket = cartModel.containsItem(product.id);
    const previewCard = new CardPreview(cloneTemplate(cardPreviewTemplate), {
      onButtonClick: (id) => {
        events.emit("card:button-click", { id });
      },
    });

    const cardElement = previewCard.render({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      description: product.description,
      inBasket,
    });

    modal.setContent(cardElement);
    modal.open();
  }
});

events.on("card:button-click", (data: { id: string }) => {
  const product = catalogModel.getProductById(data.id);
  if (product) {
    if (cartModel.containsItem(data.id)) {
      cartModel.removeItem(data.id);
    } else {
      if (product.price !== null) {
        cartModel.addItem(product);
      }
    }
  }
  modal.close();
});

events.on("header:basket-open", () => {
  renderBasket();
  modal.setContent(basket.render());
  modal.open();
});

events.on("basket:remove", (data: { id: string }) => {
  cartModel.removeItem(data.id);
});

events.on("basket:order", () => {
  if (cartModel.getItemCount() === 0) {
    return;
  }

  buyerModel.clear();
  orderForm.setActivePaymentButton(null);
  orderForm.render({
    payment: null,
    address: "",
  });
  modal.setContent(orderForm.render());
  modal.open();
});

events.on("order:field-change", (data: { field: string; value: string }) => {
  if (data.field === "payment") {
    buyerModel.setField("payment", data.value as "card" | "cash");
    orderForm.setActivePaymentButton(data.value as "card" | "cash");
  } else if (data.field === "address") {
    buyerModel.setField("address", data.value);
  }
});

events.on("order:submit", (data: { payment: string; address: string }) => {
  buyerModel.setField("payment", data.payment as "card" | "cash");
  buyerModel.setField("address", data.address);

  contactsForm.render({
    email: buyerModel.getData().email,
    phone: buyerModel.getData().phone,
  });
  modal.setContent(contactsForm.render());
  modal.open();
});

events.on("contacts:field-change", (data: { field: string; value: string }) => {
  if (data.field === "email") {
    buyerModel.setField("email", data.value);
  } else if (data.field === "phone") {
    buyerModel.setField("phone", data.value);
  }
});

events.on("contacts:submit", () => {
  const errors = buyerModel.validate();
  const hasEmailError = errors.email;
  const hasPhoneError = errors.phone;

  if (!hasEmailError && !hasPhoneError) {
    const order = {
      items: cartModel.getItems().map((item) => item.id),
      total: cartModel.getTotalPrice(),
      payment: buyerModel.getData().payment,
      address: buyerModel.getData().address,
      email: buyerModel.getData().email,
      phone: buyerModel.getData().phone,
    };

    apiService
      .sendOrder(order)
      .then((result) => {
        cartModel.clear();
        events.emit("order:success", { total: result.total });
      })
      .catch(console.error);
  }
});

events.on("order:success", (data: { total: number }) => {
  const successContainer = cloneTemplate(successTemplate);
  const successDescription = successContainer.querySelector(
    ".order-success__description",
  ) as HTMLElement;
  const closeButton = successContainer.querySelector(
    ".order-success__close",
  ) as HTMLButtonElement;

  if (successDescription) {
    successDescription.textContent = `Списано ${data.total} синапсов`;
  }
  closeButton.addEventListener("click", () => {
    modal.close();
  });
  modal.setContent(successContainer);
  modal.open();
});
loadProducts();
