import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TrainCar } from '../../_models/traincar.module';
import { TrainCarService } from '../../_services/traincar.service';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent implements OnInit {
  trainCars: TrainCar[] = [];

  constructor(private trainCarService: TrainCarService) {}

  ngOnInit() {
    this.trainCarService.getTrainCars().subscribe((data) => {
      this.trainCars = data;
    });
  }

  doiToaMoi(toa: TrainCar, isAuto: boolean) {
    // Handle the logic for changing the selected train car
    this.trainCars.forEach((car) => (car.IsSelected = false)); // Deselect all
    toa.IsSelected = true; // Select the clicked train car
  }
}
