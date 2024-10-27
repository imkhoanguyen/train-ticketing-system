import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { OrderItem } from '../_models/orderItem.module';

@Injectable({
  providedIn: 'root',
})
export class OrderItemService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getAllOrderItemsByOrderId(id:number) {
    return this.http.get<OrderItem[]>(`${this.baseUrl}/orderItem/list/${id}`);
  }
 
  
}