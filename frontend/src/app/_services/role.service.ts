import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Role } from '../_models/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getRoles() {
    return this.http.get<Role[]>(this.baseUrl + '/roles');
  }
}
