import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Promotion } from '../_models/promotion';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getPromotionWithLimit(
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

    return this.http.get<any>(this.baseUrl + '/promotion/list', {
      observe: 'response',
      params,
    });
  }

  add(promotion: Promotion) {
    return this.http.post<any>(this.baseUrl + '/promotion/create', promotion);
  }

  update(id: number, promotion: Promotion) {
    return this.http.put<any>(
      this.baseUrl + `/promotion/update/${id}`,
      promotion
    );
  }

  delete(id: number) {
    return this.http.delete<any>(this.baseUrl + `/promotion/delete/${id}`);
  }
}
