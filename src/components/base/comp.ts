export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {}

  // toggle Модального окна
  toggleClass(el: HTMLElement, className: string, force?: boolean): void {
    el.classList.toggle(className, force);
  }

  // Установить текст
  protected setText(el: HTMLElement, value: string): void {
    el.textContent = String(value);
  }

  // Блокировка элемента
  setDisabled(el: HTMLElement, state: boolean): void {
    if (state) el.setAttribute("disabled", "disabled");
    else el.removeAttribute("disabled");
  }

  // Скрытие элемента
  protected setHidden(el: HTMLElement): void {
    el.style.display = "none";
  }

  // Показ элемента
  protected setVisible(el: HTMLElement): void {
    el.style.removeProperty("display");
  }

  // Источник изображения
  protected setImage(el: HTMLImageElement, src: string, alt?: string): void {
    el.src = src;
    if (alt) {
      el.alt = alt;
    }
  }

  // Рендер содержимого
  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.container;
  }
}
