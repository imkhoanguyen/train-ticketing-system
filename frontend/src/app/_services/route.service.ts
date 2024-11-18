import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { RouteModule } from '../_models/route.module';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // getAllRoutes() {
  //   return this.http.get<RouteModule[]>(this.baseUrl + '/route/list');
  // }

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

    return this.http.get<any>(`${this.baseUrl}/route/list`, {
      observe: 'response',
      params,
    });
  }

  getRouteById(id: number) {
    return this.http.get<{ status: number; message: string; data: RouteModule }>(`${this.baseUrl}/route/${id}`);
  }


  AddRoute(data: any) {
    return this.http.post(`${this.baseUrl}/route/add`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
 

  UpdateRoute(id: number,data: any) {
    return this.http.put(`${this.baseUrl}/route/update/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  DeleteRoute(id: number) {
    return this.http.delete(`${this.baseUrl}/route/delete/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  RestoreRoute(id: number) {
    return this.http.put(`${this.baseUrl}/route/restore/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
