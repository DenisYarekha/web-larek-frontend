
export type CategoryMapping = {
    [key: string]: string
}

export interface ICard {
    id: string;
    title: string;
    description: string;
    tags: string[];
    image: string;
    price: number | null;
    productChosen: boolean;
}

export type CategoryType =
  | 'другое'
  | 'софт-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';
