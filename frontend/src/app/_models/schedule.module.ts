import { RouteModule } from "./route.module";
import { Train } from "./train.module";

export interface schedule {
  id: number;
  startDate: Date;
  endDate: Date;
  deleted:boolean;
  price:number;
  route: RouteModule;
  train: Train;

  paidSeatsCount?: number; 
  totalSeats?: number; 
}



