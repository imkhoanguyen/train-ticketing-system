import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { TrainCar } from '../../_models/traincar.module';
import { TrainCarService } from '../../_services/traincar.service';
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-train-results',
  standalone: true,
  imports: [DialogModule, CommonModule, TooltipModule],
  templateUrl: './train-results.component.html',
  styleUrl: './train-results.component.css'
})
export class TrainResultsComponent implements OnInit {
  isVisible = false;
  seats = [
    { isAvailable: true, isSelected: false },  // Ghế 0
    { isAvailable: false, isSelected: false }, // Ghế 1
    { isAvailable: true, isSelected: false },  // Ghế 2
  ];
  selectedSeats: number[] = [];
  trainCars: TrainCar[] = [];
  countdownTimes: { [key: number]: number } = {};

  constructor(private router: Router, private trainCarService: TrainCarService) {}

  ngOnInit() {
    setInterval(() => {
      this.checkSeatExpiry();
    }, 1000);

    this.selectedSeats.forEach((seatIndex) => {
      this.startCountdown(seatIndex);
    });

    this.trainCarService.getTrainCars().subscribe((data) => {
      this.trainCars = data;
    });
  }

  startCountdown(seatIndex: number): void {
    const seatData = localStorage.getItem('seat' + seatIndex);
    console.log('seatData', seatData);
    if (seatData) {
      const parsedData = JSON.parse(seatData);
      const now = new Date().getTime();

      // Tính toán thời gian còn lại
      const expiryTime = parsedData.time + 60000; // 1 phút (60 giây)
      this.countdownTimes[seatIndex] = Math.max(0, Math.floor((expiryTime - now) / 1000));

      // Cập nhật đếm ngược mỗi giây
      const interval = setInterval(() => {
        if (this.countdownTimes[seatIndex] > 0) {
          this.countdownTimes[seatIndex]--;
        } else {
          // Xoá ghế khi hết thời gian
          this.removeSeat(seatIndex);
          clearInterval(interval);
        }
      }, 1000);
    }
  }
  doiToaMoi(toa: TrainCar, isAuto: boolean) {

    this.trainCars.forEach((car) => (car.IsSelected = false));
    toa.IsSelected = true;
  }
  trainDetail(): void {
    this.isVisible = true;
  }
  checkSeatExpiry(): void {
    const dateNow = new Date().getTime();
    this.selectedSeats.forEach((index) => {
      const seatData = localStorage.getItem('seat' + index);
      if (seatData) {
        const parsedData = JSON.parse(seatData);
        if (dateNow - parsedData.time > 60000) {
          localStorage.removeItem('seat' + index);
          this.seats[index].isSelected = false;
          this.selectedSeats = this.selectedSeats.filter((seatIndex) => seatIndex !== index);
        }
      }
    });
  }

  toggleSeatSelection(index: number): void {
    const dateNow = new Date().getTime();
    this.seats[index].isSelected = !this.seats[index].isSelected;

    if (this.seats[index].isSelected) {
      const seatData = { time: dateNow };
      localStorage.setItem('seat' + index, JSON.stringify(seatData));
      this.selectedSeats.push(index);
      this.startCountdown(index);

    } else {
      localStorage.removeItem('seat' + index);
      this.selectedSeats = this.selectedSeats.filter((seatIndex) => seatIndex !== index);
    }
  }

  removeSeat(index: number): void {
    this.seats[index].isSelected = false;
    this.selectedSeats = this.selectedSeats.filter((seatIndex) => seatIndex !== index);
    localStorage.removeItem('seat' + index);
  }
  removeSeatAll(): void {
    this.selectedSeats.forEach((index) => {
      this.seats[index].isSelected = false;
      localStorage.removeItem('seat' + index);
    });
    this.selectedSeats = [];
  }

  onSubmit(): void {
    this.router.navigate(['/booking/seat']);
  }
}

