import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Station } from '../_models/station.module';

@Injectable({
  providedIn: 'root',
})
export class StationService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getAllStations() {
    return this.http.get<Station[]>(this.baseUrl + '/station/list');
  }
  getStationById(id: number) {
    return this.http.get<{ status: number; message: string; data: Station }>(`${this.baseUrl}/station/${id}`);
  }


  AddStation(data: any) {
    return this.http.post(`${this.baseUrl}/station/add`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  AddMultipleStations(data: any[]) {
    return this.http.post(`${this.baseUrl}/station/add-multiple`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }  

  UpdateStation(id: number,data: any) {
    return this.http.put(`${this.baseUrl}/station/update/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  DeleteStation(id: number) {
    return this.http.delete(`${this.baseUrl}/station/delete/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  RestoreStation(id: number) {
    return this.http.put(`${this.baseUrl}/station/restore/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
