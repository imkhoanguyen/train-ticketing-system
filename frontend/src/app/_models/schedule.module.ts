export interface schedule {
    id: number;
    train_id: number;
    route_id: number;
    startDate:Date;
    endDate: Date;

    routeName?: string; 
    trainName?: string; 
  }
  