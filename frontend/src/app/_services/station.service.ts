import { HttpClient, HttpParams } from '@angular/common/http';
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
    return this.http.get<Station[]>(this.baseUrl + '/station/list/nopage');
  }

  getWithLimit(
    page: number = 1,
    size: number = 10,
    search: string = '',
    sortBy: string = 'id,desc',
  ) {
    let params = new HttpParams();
    params = params.set('pageNumber', page.toString());
    params = params.set('pageSize', size.toString());
    params = params.set('sortBy', sortBy);

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(`${this.baseUrl}/station/list`, {
      observe: 'response',
      params,
    });
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
