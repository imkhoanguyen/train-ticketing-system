export interface Seat {
    id: number;
    name: string;
    carriage_id: number;
    price:number;
    description:string;
    _delete: boolean;

    carriageName?: string; 
}