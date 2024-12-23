import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserUpdate } from '../_models/user-detail';

@Injectable({
  providedIn: 'root',
})
export class UserService {
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

    return this.http.get<any>(this.baseUrl + '/user/list', {
      observe: 'response',
      params,
    });
  }

  delete(id: number) {
    return this.http.delete<any>(this.baseUrl + `/user/delete/${id}`);
  }

  update(id: number, userUpdate: UserUpdate) {
    return this.http.put<any>(this.baseUrl + `/user/update/${id}`, userUpdate);
  }
}
