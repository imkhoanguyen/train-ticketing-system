import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class StatisticalService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  getTotalPriceToDay() {
    return this.http.get<any>(this.baseUrl + '/statistical/total-price-today');
  }

  getTotalTicketToDay() {
    return this.http.get<any>(this.baseUrl + '/statistical/total-ticket-today');
  }

  getDataChart(year: number) {
    let params = new HttpParams();
    params = params.append('year', year.toString());
    return this.http.get<any>(this.baseUrl + '/statistical/data-chart', {
      observe: 'response',
      params,
    });
  }

  getListOder(
    page: number = 1,
    size: number = 2,
    search: string = '',
    sortBy: string = 'id,desc',
    startDate: string = '',
    endDate: string = ''
  ) {
    let params = new HttpParams();
    params = params.append('pageNumber', page.toString());
    params = params.append('pageSize', size.toString());
    params = params.append('sortBy', sortBy);
    if (startDate) params = params.append('startDate', startDate);
    if (endDate) params = params.append('endDate', endDate);

    if (search) {
      params = params.append('search', search);
    }

    return this.http.get<any>(`${this.baseUrl}/statistical/list-order`, {
      observe: 'response',
      params,
    });
  }
}
