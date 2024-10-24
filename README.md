# Проектная работа "Веб-ларек"

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание проекта

Проект "Веб-ларек" реализует пример работы интернет-магазина. Приложение загружает список товаров с сервера, отображает их в каталоге, позволяет добавлять товары в корзину, оформлять заказ и отправлять информацию о заказе на сервер.

## Описание интерфейса

Интерфейс включает несколько ключевых компонентов:

1. Каталог товаров — отображает доступные товары. Каждый товар представлен в виде карточки с информацией о цене, названии, описании и изображении.
2. Карточка товара — отображает информацию о товаре при выборе карточки. Пользователь может добавить товар в корзину.
3. Корзина — отображает список товаров, добавленных пользователем. Пользователь может удалить товары из корзины или оформить заказ.
4. Форма заказа — позволяет пользователю указать адрес доставки и выбрать способ оплаты.
5. Окно успешной покупки — отображается после успешного оформления заказа.

## Структура проекта

├── src/
│ ├── components/ [Реализация]
│ │ ├── base/ [Базовый код]
│ │ ├── common/ [Общие компоненты (страницы, карточки, корзина, модальные окна)]
│ ├── scss/ [Стили проекта]
│ ├── utils/ [Утилитарные функции и константы]
├── index.html [Основной шаблон страницы]
├── package.json [Зависимости проекта]
└── README.md [Описание проекта]

## Архитектура проекта (MVC)

Архитектура построена вокруг компонентов и системы событий.

Реализована единая модель данных приложения в файле `src/index.ts`, содержащая всю логику работы с данными и возможные действия над ними. Все изменения данных происходят через методы модели, а она в свою очередь уведомляет об изменениях через метод настроек `src/components/common/appData` чтобы не зависеть от конкретного способа коммуникации между компонентами. Подключение модели к системе событий производится через обертку `src/components/base/events.ts`.

Компоненты — представляют различные части пользовательского интерфейса (например, корзина, карточка товара, модальное окно). Каждый компонент наследуется от базового класса Component, который управляет элементами DOM и их состоянием. EventEmitter — система управления событиями, которая используется для взаимодействия между компонентами. Она позволяет слушать и реагировать на различные пользовательские действия (например, нажатие на кнопку "добавить в корзину", оформление заказа и т.д.). AppState — состояние приложения, которое хранит информацию о товарах в магазине, корзине, заказе и обрабатывает изменения этих данных.

## Документация

### Типы данных

```TypeScript

//Интерфейс описывающий струтуру товара

interface IProduct {
  // уникальный ID
  id: string;

  // описание товара
  description: string;

  // ссылка на картинку
  image: string;

  // название
  title: string;

  // категория товара
  category: CategoryType;

  // цена товара, может быть null
  price: number | null;

  // был данный товар добавлен в корзину или нет
  selected: boolean;
}

// Интерфейс состояния приложения
    Используется для хранения карточек, корзины, заказа пользователя, ошибок в формах
interface IAppState {
  // Корзина с товарами
  basket: Product[];

  // Массив карточек товара
  store: Product[];

  // Информация о заказе
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
  // Массив ID купленных товаров
  items: string[];

  // Способ оплаты
  payment: string;

  // Сумма заказа
  total: number;

  // Адрес доставки
  address: string;

  // Электронная почта
  email: string;

  // Телефон
  phone: string;
}

//Интерфейс, описывающий карточку товара

interface ICard {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number | null;
  selected: boolean;
}

//Интерфейс описывающий страницу

interface IPage {
  // Счётчик товаров в корзине
  counter: number;

  // Массив карточек с товарвми
  store: HTMLElement[];

  // Переключатель для блокировки
  // Отключает прокрутку страницы
  locked: boolean;
}

//Интерфейс, описывающий корзину товаров

export interface IBasket {
  // Массив элементов li с товаром
  list: HTMLElement[];

  // Общая цена товаров
  price: number;
}

//Интерфейс, описывающий окошко заказа товара

export interface IOrder {
  // Адрес
  address: string;

  // Способ оплаты
  payment: string;
}

// Интерфейс, описывающий окошко контакты

export interface IContacts {
  // Телефон
  phone: string;

  // Электронная почта
  email: string;
}
```

### Классы представления

```TypeScript
//Базовый компонент

abstract class Component<T> {
  // Конструктор принимает родительский элемент
  protected constructor(protected readonly container: HTMLElement);

  // Переключить класс
  toggleClass(element: HTMLElement, className: string, force?: boolean): void;

  // Установить текстовое содержимое
  protected setText(element: HTMLElement, value: string): void;

  // Сменить статус блокировки
  setDisabled(element: HTMLElement, state: boolean): void;

  // Скрыть
  protected setHidden(element: HTMLElement): void;

  // Показать
  protected setVisible(element: HTMLElement): void;

  // Установить изображение с алтернативным текстом
  protected setImage(el: HTMLImageElement, src: string, alt?: string): void;

  // Вернуть корневой DOM-элемент
  render(data?: Partial<T>): HTMLElement;
}

//Класс, описывающий главную страницу

class Page extends Component<IPage> {
  // Ссылки на внутренние элементы
  protected _counter: HTMLElement;
  protected _store: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  // Конструктор принимает родительский элемент и обработчик событий
  constructor(container: HTMLElement, protected events: IEvents);

  // Сеттер для счётчика товаров в корзине
  set counter(value: number);

  // Сеттер для карточек товаров на странице
  set store(items: HTMLElement[]);

  // Сеттер для блока прокрутки
  set locked(value: boolean);
}

//Класс, описывающий карточку товара

class Card extends Component<ICard> {
  // Ссылки на внутренние элементы карточки
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  // Конструктор принимает имя блока, родительский контейнер
  // и объект с колбэк функциями
  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions);

  // Сеттер и геттер для уникального ID
  set id(value: string);
  get id(): string;

  // Сеттер и гетер для названия
  set title(value: string);
  get title(): string;

  // Сеттер для кратинки
  set image(value: string);

  // Сеттер для определения выбрали товар или нет
  set selected(value: boolean);

  // Сеттер для цены
  set price(value: number | null);

  // Сеттер для категории
  set category(value: CategoryType);
}

//Класс, описывающий корзину товаров

export class Basket extends Component<IBasket> {
  // Ссылки на внутренние элементы
  protected _list: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  // Конструктор принимает имя блока, родительский элемент и обработчик событий
  constructor(protected blockName: string, container: HTMLElement, protected events: IEvents);

  // Сеттер для общей цены
  set price(price: number);

  // Сеттер для списка товаров
  set list(items: HTMLElement[]);

  // Метод отключающий кнопку "Оформить"
  disableButton(): void;

  // Метод для обновления индексов таблички при удалении товара из корзины
  refreshIndices(): void;
}

//Класс, описывающий форму заказа товара

export class Order extends Form<IOrder> {
  // Сссылки на внутренние элементы
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;

  // Конструктор принимает имя блока, родительский элемент и обработчик событий
  constructor(protected blockName: string, container: HTMLFormElement, protected events: IEvents);

  // Метод, отключающий подсвечивание кнопок
  disableButtons(): void;
}

//Класс, описывающий форму контактов

export class Contacts extends Form<IContacts> {
  // Конструктор принимает родительский элемент и обработчик событий
  constructor(container: HTMLFormElement, events: IEvents);
}
```

### Описание событий

```TypeScript

'items:changed'
//Обновляет отображение списка товаров на странице, перерисовывая карточки товаров

'card:select'
//Открывает модальное окно с подробной информацией о выбранном товаре.

'card:toBasket'
//Обновляет модель данных, добавляя выбранный товар в корзину, обновляет счетчик товаров в корзине, закрывает модальное окно.

'basket:open'
//Открывает модальное окно с корзиной товаров, рендерит список товаров в корзине и общую сумму.

'basket:delete'
//Удаляет выбранный товар из корзины, обновляет цену и количество товаров в корзине, перерисовывает список товаров, если корзина пуста — деактивирует кнопку заказа.

'basket:order'
//Открывает модальное окно с формой для ввода данных заказа (адреса доставки и способа оплаты).

'orderFormErrors:change'
//Проверяет корректность заполнения полей формы заказа, отображает ошибки, если они есть, и активирует/деактивирует кнопку для отправки формы.

'contactsFormErrors:change'
//Проверяет корректность заполнения полей контактной информации, отображает ошибки, если они есть, и активирует/деактивирует кнопку отправки данных.

'orderInput:change'
//Обновляет модель данных заказа при изменении полей формы заказа (адреса, способа оплаты и др.).

'order:submit'
//Собирает данные из формы заказа, вычисляет общую сумму заказа, и отображает следующую форму для ввода контактной информации.

'contacts:submit'
//Отправляет данные заказа на сервер. При успешной отправке очищает корзину, сбрасывает выбранные товары, отображает сообщение об успешной покупке.

'order:success'
//Показывает сообщение о том, что заказ успешно оформлен, и очищает данные корзины и заказа.

'modal:close'
//Закрывает текущее модальное окно, обновляет состояние приложения, например, сбрасывает введенные данные заказа.

```
