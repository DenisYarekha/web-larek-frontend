import { Component } from "../../components/base/comp";
import { CDN_URL } from "../../utils/constants";
import { categoryMapping } from "../../utils/constants";
import { ensureElement, handlePrice } from "../../utils/utils";
import { CategoryType } from "../../types";

// Структура данных карточки
interface ICard {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number | null;
  selected: boolean;
}

// Действия для карточки
interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

// Класс, представлющий карточку товара и взаимодействия с DOM
export class Card extends Component<ICard> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _id: string;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ICardActions
  ) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = ensureElement<HTMLImageElement>(
      `.${blockName}__image`,
      container
    );
    this._button = container.querySelector(`.${blockName}__button`);
    this._category = container.querySelector(`.${blockName}__category`);
    this._price = container.querySelector(`.${blockName}__price`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener("click", actions.onClick);
      } else {
        container.addEventListener("click", actions.onClick);
      }
    }
  }
  // Сеттер и геттер для ID
  set id(value: string) {
    this.container.dataset.id = value;
  }
  get id(): string {
    return this.container.dataset.id || "";
  }

  // Сеттер и геттер для названия
  set title(value: string) {
    this.setText(this._title, value);
  }
  get title(): string {
    return this._title.textContent || "";
  }

  // Сеттер для картинки
  set image(value: string) {
    this._image.src = CDN_URL + value;
  }

  // Сеттер для определения выбрали товар или нет
  set selected(value: boolean) {
    if (!this._button.disabled) {
      this.setDisabled(this._button, value);
    }
  }

  // Сеттер для цены
  set price(value: number | null) {
    this.setText(
      this._price,
      value ? handlePrice(value) + " синапсов" : "Бесценно"
    );
    if (this._button && !value) {
      this.setDisabled(this._button, true);
    }
  }

  // Сеттер для категории
  set category(value: CategoryType) {
    this.setText(this._category, value);
    this.toggleClass(this._category, categoryMapping[value], true);
  }
}

// Инициализирует карточку с базовыми CSS-классами и обработчиками событий
export class StoreItem extends Card {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super("card", container, actions);
  }
}

// Отображает описание товара
export class StoreItemPreview extends Card {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super("card", container, actions);

    this._description = container.querySelector(`.${this.blockName}__text`);
  }

  set description(value: string) {
    this.setText(this._description, value);
  }
}
