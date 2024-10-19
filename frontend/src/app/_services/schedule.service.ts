import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { schedule } from '../_models/schedule.module';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getAllSchedulesByRouteId(id:number) {
    return this.http.get<schedule[]>(`${this.baseUrl}/schedule/list/${id}`);
  }
  getScheduleById(id: number) {
    return this.http.get<{ status: number; message: string; data: schedule }>(`${this.baseUrl}/schedule/${id}`);
  }

  AddSchedule(data: any) {
    return this.http.post(`${this.baseUrl}/schedule/add`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  UpdateSchedule(id: number,data: any) {
    return this.http.put(`${this.baseUrl}/schedule/update/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  DeleteSchedule(id: number) {
    return this.http.delete(`${this.baseUrl}/schedule/delete/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}