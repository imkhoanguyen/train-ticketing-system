import { OrderItem } from './orderItem.module';
import { Promotion } from './promotion';
import { UserDetail } from './user-detail';

export interface Order {
  id: number;
  user: UserDetail;
  promotion: Promotion;
  status: string;
  subTotal: number;
  timeCreated: Date;
  // fullname?:string;
  // phone?:string;
  orderItems: OrderItem[];
}

export enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}
