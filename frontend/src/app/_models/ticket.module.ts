export interface Ticket {
    id: number;
    schedules_id: number;
    seat_id: number;
    dateBuy:Date;
    status: string; 
    object: string; 
    fullname: string;
    can_cuoc: string; 
    promotion_id: number;
    price: number; 
    price_reduced: number;

    seatName?: string;
    startDate?: Date;
    endDate?: Date;
    promotionName?:string;
    startStation?:string;
    endStation?:string;
     
  }
  