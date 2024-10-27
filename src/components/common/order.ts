import { IEvents } from "../base/events";
import { Form } from "../common/form";

// Интерфейс, описывающий форму заказа
export interface IOrder {
  address: string;
  payment: string;
}

// Класс для выбора способа оплаты и ввода данных о заказе
export class Order extends Form<IOrder> {
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;

  toggleCard(state: boolean = true) {
    this.toggleClass(this._card, "button_alt-active", state);
  }

  toggleCash(state: boolean = true) {
    this.toggleClass(this._cash, "button_alt-active", state);
  }

  constructor(
    protected blockName: string,
    container: HTMLFormElement,
    protected events: IEvents
  ) {
    super(container, events);

    this._card = container.elements.namedItem("card") as HTMLButtonElement;
    this._cash = container.elements.namedItem("cash") as HTMLButtonElement;

    if (this._cash) {
      this._cash.addEventListener("click", () => {
        this.toggleCard(false);
        this.toggleCash();
        this.onInputChange("payment", "cash");
      });
    }
    if (this._card) {
      this._card.addEventListener("click", () => {
        this.toggleCard();
        this.toggleCash(false);
        this.onInputChange("payment", "card");
      });
    }
  }

  disableButtons() {
    this.toggleCard(false);
    this.toggleCash(false);
  }
}
