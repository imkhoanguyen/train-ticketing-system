import { Order } from "./order.module";
import { Ticket } from "./ticket.module";

export interface OrderItem {
    id: number;
    ticket: Ticket;
    order: Order;
}