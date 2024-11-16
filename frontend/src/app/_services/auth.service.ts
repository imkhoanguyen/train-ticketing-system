import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest, UserDetail } from '../_models/user-detail';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  login(login: LoginRequest) {
    return this.http.post<any>(this.baseUrl + '/auth/login', login).pipe(
      map((response) => {
        if (response) {
          if (response.status === 200) this.setCurrentUser(response.data);
        }
        return response;
      })
    );
  }

  logout() {
    if (localStorage.getItem('user')) localStorage.removeItem('user');
  }

  setCurrentUser(user: UserDetail) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser() {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      return user;
    }
  }
}
