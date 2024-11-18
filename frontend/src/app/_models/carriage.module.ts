import { Train } from "./train.module";

export interface Carriage {
    id: number;
    name: string;
    train: Train;
    description:string;
    delete: boolean;

}
