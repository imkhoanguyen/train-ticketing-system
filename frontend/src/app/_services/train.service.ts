import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Train } from '../_models/train.module';

@Injectable({
  providedIn: 'root',
})
export class TrainService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getAllTrains() {
    return this.http.get<Train[]>(this.baseUrl + '/train/list');
  }
}
