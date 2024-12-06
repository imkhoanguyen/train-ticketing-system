import { OrderItem } from "./orderItem.module";
import { Promotion } from "./promotion";

export interface OrderList {
  id: number;
  cmnd: string;
  created: string;
  status: string;
  subTotal: number;
  fullName: string;
  phone: string;
  promotion: Promotion;
  orderItems: OrderItem[];
  total: number;
}
