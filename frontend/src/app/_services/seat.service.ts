import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Seat } from '../_models/seat.module';

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getAllSeatsByCarriageId(id:number) {
    return this.http.get<Seat[]>(`${this.baseUrl}/seat/list/${id}`);
  }
 
  getSeatById(id: number) {
    return this.http.get<{ status: number; message: string; data: Seat }>(`${this.baseUrl}/seat/${id}`);
  }

  UpdateSeat(id: number,data: any) {
    return this.http.put(`${this.baseUrl}/seat/update/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  DeleteSeat(id: number) {
    return this.http.delete(`${this.baseUrl}/seat/delete/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  RestoreSeat(id: number) {
    return this.http.put(`${this.baseUrl}/seat/restore/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  AddSeat(data: any) {
    return this.http.post(`${this.baseUrl}/seat/add`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}