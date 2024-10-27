import { IEvents } from "../base/events";
import { Form } from "../common/form";

// Интерфейс описывает структуру контактов
export interface IContacts {
  phone: string;
  email: string;
}

export class Contacts extends Form<IContacts> {
  private phoneInput: HTMLInputElement | null;
  private emailInput: HTMLInputElement | null;
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.phoneInput = this.container.querySelector<HTMLInputElement>(
      'input[name="phone"]'
    );
    this.emailInput = this.container.querySelector<HTMLInputElement>(
      'input[name="email"]'
    );
  }

  //Сеттер для телефона
  set phone(value: string) {
    if (this.phoneInput) {
      this.phoneInput.value = value;
    }
  }

  //Сеттер для email
  set email(value: string) {
    if (this.emailInput) {
      this.emailInput.value = value;
    }
  }
}
