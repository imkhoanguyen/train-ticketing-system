import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Order, OrderStatus } from '../_models/order.module';
import { Observable } from 'rxjs';

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
  getByUserIdWithLimit(
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

    return this.http.get<any>(`${this.baseUrl}/order/list/${id}`, {
      observe: 'response',
      params,
    });
  }

  addOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/order/add`, order);
  }

  getOrderByUserId(id: number): Observable<any> {
    return this.http.get<{ status: number; message: string; data: Order }>(`${this.baseUrl}/order/get/${id}`);
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<any> {
    return this.http.put(`${this.baseUrl}/order/updateStatus/${id}/${status}`, {});
  }

  updateOrderPromotion(id: number, promotion: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/order/updatePromotion/${id}/${promotion}`, {});
  }

}
