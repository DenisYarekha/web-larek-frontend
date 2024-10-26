import { Model } from "../base/model";

export type CategoryType =
  | "другое"
  | "софт-скил"
  | "дополнительное"
  | "кнопка"
  | "хард-скил";

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

//Интерфейс описывающий струтуру товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: CategoryType;
  price: number | null;
  selected: boolean;
}

// Интерфейс состояния приложения
export interface IAppState {
  // Корзина с товарами
  basket: Product[];
  // Массив карточек товара
  store: Product[];
  // Информация о заказе при покупке товара
  order: IOrder;
  // Ошибки при заполнении форм
  formErrors: FormErrors;
  // Метод для добавления товара в корзину
  addToBasket(value: Product): void;
  // Метод для удаления товара из корзины
  deleteFromBasket(id: string): void;
  // Метод для полной очистки корзины
  clearBasket(): void;
  // Метод для получения количества товаров в корзине
  getBasketAmount(): number;
  // Метод для получения суммы цены всех товаров в корзине
  getTotalBasketPrice(): number;
  // Метод для добавления ID товаров в корзине в поле items для order
  setItems(): void;
  // Метод для заполнения полей email, phone, address, payment в order
  setOrderField(field: keyof IOrderForm, value: string): void;
  // Валидация форм для окошка "контакты"
  validateContacts(): boolean;
  // Валидация форм для окошка "заказ"
  validateOrder(): boolean;
  // Очистить order после покупки товаров
  refreshOrder(): boolean;
  // Метод для превращения данных, полученых с сервера в тип данных приложения
  setStore(items: IProduct[]): void;
  // Метод для обновления поля selected во всех товарах после совершения покупки
  resetSelected(): void;
}

//Интерфейс, хранит информацию о заказе
export interface IOrder {
  items: string[];
  payment: string;
  total: number;
  address: string;
  email: string;
  phone: string;
}
// Интрфейс, представляет поля формы заказа
export interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

export class Product extends Model<IProduct> {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean;
}

// Управляет основным состоянием приложения
export class AppState extends Model<IAppState> {
  basket: Product[] = [];
  store: Product[];
  order: IOrder = {
    items: [],
    payment: "",
    total: null,
    address: "",
    email: "",
    phone: "",
  };

  formErrors: FormErrors = {};

  addToBasket(value: Product) {
    this.basket.push(value);
  }

  deleteFromBasket(id: string) {
    this.basket = this.basket.filter((item) => item.id !== id);
  }

  clearBasket() {
    this.basket.length = 0;
  }

  getBasketAmount() {
    return this.basket.length;
  }

  setItems() {
    this.order.items = this.basket.map((item) => item.id);
  }

  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    if (this.validateContacts()) {
      this.events.emit("contacts:ready", this.order);
    }
    if (this.validateOrder()) {
      this.events.emit("order:ready", this.order);
    }
  }

  validateContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
      errors.email = "Необходимо указать email";
    } else if (
      !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(this.order.email)
    ) {
      errors.email = "Укажите корректный email";
    }
    if (!this.order.phone) {
      errors.phone = "Необходимо указать телефон";
    } else if (
      !/^\+?\d{1,3}?[-. (]*\d{1,4}?[-. )]*\d{1,4}[-. ]*\d{1,9}$/.test(
        this.order.phone
      )
    ) {
      errors.phone = "Укажите корректный телефон";
    }
    this.formErrors = errors;
    this.events.emit("contactsFormErrors:change", this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = "Необходимо указать адрес";
    }
    if (!this.order.payment) {
      errors.payment = "Необходимо указать способ оплаты";
    }
    this.formErrors = errors;
    this.events.emit("orderFormErrors:change", this.formErrors);
    return Object.keys(errors).length === 0;
  }

  refreshOrder() {
    this.order = {
      items: [],
      total: null,
      address: "",
      email: "",
      phone: "",
      payment: "",
    };
  }

  getTotalBasketPrice() {
    return this.basket.reduce((sum, next) => sum + next.price, 0);
  }

  setStore(items: IProduct[]) {
    this.store = items.map(
      (item) => new Product({ ...item, selected: false }, this.events)
    );
    this.emitChanges("items:changed", { store: this.store });
  }

  resetSelected() {
    this.store.forEach((item) => (item.selected = false));
  }
}
