import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getPromotionWithLimit(
    page: number = 1,
    size: number = 10,
    search: string | null,
    sortBy: string = 'id,desc'
  ) {
    let params = new HttpParams();
    params.set('pageNumber', page);
    params.set('pageSize', size);
    params.set('sortBy', sortBy);

    if (search) {
      params.set('search', search);
    }

    return this.http.get<any>(this.baseUrl + "/promotion/list", {observe: 'response', params});
  }
}
