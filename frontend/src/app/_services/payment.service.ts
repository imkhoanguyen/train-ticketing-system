import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getPayment(amount: number, bankCode?: string): Observable<any> {
    let params = new HttpParams().set('amount', amount.toString());
    if (bankCode) {
      params = params.set('bankCode', bankCode);
    }
    return this.http.get(`${this.baseUrl}/payments/vn-pay`, { params });
  }


  getPaymentCallback(queryParams: { [key: string]: string }): Observable<any> {
    let params = new HttpParams();
    Object.keys(queryParams).forEach((key) => {
      params = params.set(key, queryParams[key]);
    });

    return this.http.get(`${this.baseUrl}/payments/vn-pay-callback`, { params });
  }
}
