import { Discount } from "./discount";
import { schedule } from "./schedule.module";
import { Seat } from "./seat.module";

export interface Ticket {
    discount:Discount;
    id: number;
    isDelete:boolean;
    price: number;
    priceDiscount: number;
    schedule: schedule;
    seat: Seat;
    dateBuy:Date;
    cmnd:string;
    objectDiscount: string; 
    fullName: string;
    seatname: string; 
    status: string; 
     
  }
  