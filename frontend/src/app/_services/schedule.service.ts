import { HttpClient, HttpParams } from '@angular/common/http';
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

    return this.http.get<any>(`${this.baseUrl}/schedule/list/${id}`, {
      observe: 'response',
      params,
    });
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
  RestoreSchedule(id: number) {
    return this.http.put(`${this.baseUrl}/schedule/restore/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
