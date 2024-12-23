import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Seat } from '../_models/seat.module';
import { ApiResponse } from '../_models/api-response.module';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeatService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private seats: any[] = [];


  getSeats(): Observable<any[]> {
    const selectedSeats = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('seat')) {
        const seatData = localStorage.getItem(key);
        if (seatData) {
          selectedSeats.push(JSON.parse(seatData));
        }
      }
    }
    return of(selectedSeats);
  }

  getAllSeatsByCarriageId(id:number) {
    return this.http.get<ApiResponse<Seat[]>>(`${this.baseUrl}/seat/carriageId/${id}`);
  }

  getAllSeatsByTrainId(id:number) {
    return this.http.get<ApiResponse<Seat[]>>(`${this.baseUrl}/seat/trainId/${id}`);
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

    return this.http.get<any>(`${this.baseUrl}/seat/list/${id}`, {
      observe: 'response',
      params,
    });
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

  saveSeatSelection(seatData: any): Observable<any> {
    console.log('Sending seat data:', seatData);
    return this.http.post(`${this.baseUrl}/seat/save`, seatData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  cancelSeatSelection(seatData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/seat/cancel`, seatData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getRemainingTime(userId: number, seatId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/seat/remaining-time/${userId}/${seatId}`);
  }

  getExpiredStream(): Observable<string> {
    return new Observable((observer) => {
      const eventSource = new EventSource(`${this.baseUrl}/seat/expired-stream`);
      eventSource.onmessage = (event) => {
        observer.next(event.data);
      };

      eventSource.onerror = (error) => {
        observer.error(error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    });
  }

}
