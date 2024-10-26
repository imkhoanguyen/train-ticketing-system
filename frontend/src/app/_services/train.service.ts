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

  getTrainById(id: number) {
    return this.http.get<{ status: number; message: string; data: Train }>(`${this.baseUrl}/train/${id}`);
  }

  AddTrain(data: any) {
    return this.http.post(`${this.baseUrl}/train/add`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  AddMultipleTrains(data: any[]) {
    return this.http.post(`${this.baseUrl}/train/add-multiple`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }  

  UpdateTrain(id: number,data: any) {
    return this.http.put(`${this.baseUrl}/train/update/${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  DeleteTrain(id: number) {
    return this.http.delete(`${this.baseUrl}/train/delete/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  RestoreTrain(id: number) {
    return this.http.put(`${this.baseUrl}/train/restore/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
