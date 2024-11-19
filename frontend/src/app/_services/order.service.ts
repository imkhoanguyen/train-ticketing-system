import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Order } from '../_models/order.module';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // getAllOrders() {
  //   return this.http.get<Order[]>(this.baseUrl + '/order/list');
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

    return this.http.get<any>(`${this.baseUrl}/order/list`, {
      observe: 'response',
      params,
    });
  }
  
}