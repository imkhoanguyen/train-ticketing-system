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
    status: TicketStatus;


    // seatName?: string;
    // startDate?: Date;
    // endDate?: Date;
    // promotionName?:string;
    // startStation?:string;
    // endStation?:string;

  }

export enum TicketStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
}

