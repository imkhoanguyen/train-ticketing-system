import { Carriage } from "./carriage.module";

export interface Seat {
    id: number;
    name: string;
    carriage: Carriage;
    price:number;
    description:string;
    delete: boolean;
    isSelected?: boolean;
}
