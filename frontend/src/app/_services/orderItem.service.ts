import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { OrderItem } from '../_models/orderItem.module';

@Injectable({
  providedIn: 'root',
})
export class OrderItemService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  private ticketData: any;
  private orderData: any;


  // getAllOrderItemsByOrderId(id:number) {
  //   return this.http.get<OrderItem[]>(`${this.baseUrl}/orderItem/list/${id}`);
  // }

  // getWithLimit(
  //   page: number = 1,
  //   size: number = 10,
  //   search: string = '',
  //   sortBy: string = 'id,desc',
  //   id:number
  // ) {
  //   let params = new HttpParams();
  //   params = params.set('pageNumber', page.toString());
  //   params = params.set('pageSize', size.toString());
  //   params = params.set('sortBy', sortBy);

  //   if (search) {
  //     params = params.set('search', search);
  //   }

  //   return this.http.get<any>(`${this.baseUrl}/orderItem/list/${id}`, {
  //     observe: 'response',
  //     params,
  //   });
  // }

  addOrderItem(orderItem: any) {
    return this.http.post(`${this.baseUrl}/orderItem/add`, orderItem, {});
  }

  setTicketData(data: any): void {
    this.ticketData = data;
    localStorage.setItem('ticketData', JSON.stringify(this.ticketData));
  }
  getTicketData(): any {
    return localStorage.getItem('ticketData');
  }

  setOrderData(data: any): void {
    this.orderData = data;
    localStorage.setItem('orderData', JSON.stringify(this.orderData));
  }
  getOrderData(): any {
    return localStorage.getItem('orderData');
  }
}
