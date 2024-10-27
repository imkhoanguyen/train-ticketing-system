import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Ticket } from '../_models/ticket.module';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getTicketById(id: number) {
    return this.http.get<{ status: number; message: string; data: Ticket }>(`${this.baseUrl}/ticket/${id}`);
  }

  DeleteTicket(id: number) {
    return this.http.delete(`${this.baseUrl}/ticket/delete/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}