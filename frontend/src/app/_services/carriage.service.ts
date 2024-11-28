import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Carriage } from '../_models/carriage.module';
import { ApiResponse } from '../_models/api-response.module';

@Injectable({
  providedIn: 'root',
})
export class CarriageService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getAllCarriagesByTrainId(id:number) {
    return this.http.get<ApiResponse<Carriage[]>>(`${this.baseUrl}/carriage/trainId/${id}`);
  }

  getWithLimit(
    page: number = 1,
    size: number = 10,
    search: string = '',
    sortBy: string = 'id,desc',
    id:number
  ) {
    let params = new HttpParams();
    params = params.set('pageNumber', page.toString());
    params = params.set('pageSize', size.toString());
    params = params.set('sortBy', sortBy);

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(`${this.baseUrl}/carriage/list/${id}`, {
      observe: 'response',
      params,
    });
  }

  getCarriageById(id: number) {
    return this.http.get<{ status: number; message: string; data: Carriage }>(`${this.baseUrl}/carriage/${id}`);
  }

  AddCarriage(data: any) {
    return this.http.post(`${this.baseUrl}/carriage/add`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  UpdateCarriage(id: number,data: any) {
    return this.http.put(`${this.baseUrl}/carriage/update/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  DeleteCarriage(id: number) {
    return this.http.delete(`${this.baseUrl}/carriage/delete/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  RestoreCarriage(id: number) {
    return this.http.put(`${this.baseUrl}/carriage/restore/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
