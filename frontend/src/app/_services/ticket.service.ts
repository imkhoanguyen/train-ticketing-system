import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Ticket } from '../_models/ticket.module';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private tickets: any[] = [];

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

    return this.http.get<any>(`${this.baseUrl}/ticket/list/${id}`, {
      observe: 'response',
      params,
    });
  }
  getTicketById(id: number) {
    return this.http.get<{ status: number; message: string; data: Ticket }>(`${this.baseUrl}/ticket/${id}`);
  }

  DeleteTicket(id: number) {
    return this.http.delete(`${this.baseUrl}/ticket/delete/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}