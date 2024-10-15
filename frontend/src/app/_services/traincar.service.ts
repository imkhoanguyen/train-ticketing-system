import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TrainCar } from '../_models/traincar.module';

@Injectable({
  providedIn: 'root',
})
export class TrainCarService {
  getTrainCars(): Observable<TrainCar[]> {
    // Simulated data; replace with actual API call
    const trainCars: TrainCar[] = [
      { ToaXeStatus: 1, IsChonChoTuDong: false, IsSelected: false, number: 9 },
      { ToaXeStatus: 1, IsChonChoTuDong: false, IsSelected: false, number: 8 },
      { ToaXeStatus: 1, IsChonChoTuDong: false, IsSelected: false, number: 7 },
      { ToaXeStatus: 1, IsChonChoTuDong: false, IsSelected: false, number: 6 },
      { ToaXeStatus: 1, IsChonChoTuDong: true, IsSelected: false, number: 5 },
      { ToaXeStatus: 1, IsChonChoTuDong: true, IsSelected: false, number: 4 },
      { ToaXeStatus: 2, IsChonChoTuDong: false, IsSelected: false, number: 3 },
      { ToaXeStatus: 1, IsChonChoTuDong: false, IsSelected: false, number: 2 },
      { ToaXeStatus: 1, IsChonChoTuDong: false, IsSelected: true, number: 1 },
    ];
    return of(trainCars);
  }
}
