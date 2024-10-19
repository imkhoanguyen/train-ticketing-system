export interface RouteModule {
    id: number;
    name: string;
    startStationId:number;
    endStationId:number;
    is_delete:boolean;

    startStationName?: string; // Nếu cần thiết
    endStationName?: string; 
  }
  