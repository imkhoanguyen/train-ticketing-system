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
}
