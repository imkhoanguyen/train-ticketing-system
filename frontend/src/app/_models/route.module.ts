import { Station } from "./station.module";
export interface RouteModule {
    id: number;
    name: string;
    startStation:Station;
    endStation:Station;
    is_delete:boolean;

    // startStationName?: string; // Nếu cần thiết
    // endStationName?: string; 
  }
  