import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Order } from '../_models/order.module';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getAllOrders() {
    return this.http.get<Order[]>(this.baseUrl + '/order/list');
  }
 
  
}