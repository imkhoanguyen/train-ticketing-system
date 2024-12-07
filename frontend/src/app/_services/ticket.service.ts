import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Ticket, TicketStatus } from '../_models/ticket.module';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private ticketData: any;
  private personalData: any;

  setPersonalData(data: any): void{
    this.personalData = data;
    localStorage.setItem('personalData', JSON.stringify(this.personalData));
  }
  getPersonalData(): any{
    return localStorage.getItem('personalData');
  }
  setTicketData(data: any): void {
    this.ticketData = data;
    localStorage.setItem('ticketData', JSON.stringify(this.ticketData));

  }

  getTicketData(): any {
    return localStorage.getItem('ticketData');
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

    return this.http.get<any>(`${this.baseUrl}/ticket/list/${id}`, {
      observe: 'response',
      params,
    });
  }
  getTicketById(id: number) {
    return this.http.get<{ status: number; message: string; data: Ticket }>(`${this.baseUrl}/ticket/${id}`);
  }

  addTickets(tickets: Ticket[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/ticket/add`, tickets);
  }

  deleteTicket(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/ticket/delete/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  updateTicketStatus(id: number, status: TicketStatus): Observable<any> {
    console.log(status);
    return this.http.put(`${this.baseUrl}/ticket/updateStatus/${id}/${status}`, {}  );
  }

  getTicketsByUserId(id: number, status: TicketStatus) {
    return this.http.get<any>(`${this.baseUrl}/ticket/list/${id}/${status}`);
  }

  getPaidSeats(){
    return this.http.get<any>(`${this.baseUrl}/ticket/paidSeats`);
  }
}
