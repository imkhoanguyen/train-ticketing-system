import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Discount } from '../_models/discount';
import { ApiResponse } from '../_models/api-response.module';

@Injectable({
  providedIn: 'root',
})
export class DiscountService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getWithLimit(
    page: number = 1,
    size: number = 10,
    search: string = '',
    sortBy: string = 'id,desc'
  ) {
    let params = new HttpParams();
    params = params.set('pageNumber', page.toString());
    params = params.set('pageSize', size.toString());
    params = params.set('sortBy', sortBy);

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(this.baseUrl + '/discount/list', {
      observe: 'response',
      params,
    });
  }
  getAllDiscounts(){
    return this.http.get<ApiResponse<Discount[]>>(this.baseUrl + '/discount/list-all');
  }
  getDiscountById(id: number) {
    return this.http.get<ApiResponse<Discount>>(this.baseUrl + `/discount/${id}`);
  }

  add(discount: Discount) {
    return this.http.post<any>(this.baseUrl + '/discount/create', discount);
  }

  update(id: number, discount: Discount) {
    return this.http.put<any>(
      this.baseUrl + `/discount/update/${id}`,
      discount
    );
  }

  delete(id: number) {
    return this.http.delete<any>(this.baseUrl + `/discount/delete/${id}`);
  }
}
