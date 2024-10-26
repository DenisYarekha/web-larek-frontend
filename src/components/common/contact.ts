import { IEvents } from "../base/events";
import { Form } from "../common/form";

// Интерфейс описывает структуру контактов
export interface IContacts {
  phone: string;
  email: string;
}

export class Contacts extends Form<IContacts> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  //Сеттер для телефона
  set phone(value: string) {
    const phoneInput = this.container.querySelector<HTMLInputElement>(
      'input[name="phone"]'
    );
    if (phoneInput) {
      phoneInput.value = value;
    }
  }

  //Сеттер для email
  set email(value: string) {
    const emailInput = this.container.querySelector<HTMLInputElement>(
      'input[name="email"]'
    );
    if (emailInput) {
      emailInput.value = value;
    }
  }
}
