import { RouteModule } from "./route.module";
import { Train } from "./train.module";

export interface schedule {
    id: number;
    deleted:boolean;
    price:number;
    train: Train;
    route: RouteModule;
    startDate:Date;
    endDate: Date;

  }
  