import { afterNextRender, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { TrainCar } from '../../_models/traincar.module';
import { TrainCarService } from '../../_services/traincar.service';
import { TooltipModule } from 'primeng/tooltip';
import { ScheduleService } from '../../_services/schedule.service';
import { Train } from '../../_models/train.module';
import {  schedule } from '../../_models/schedule.module';
import { DropdownModule } from 'primeng/dropdown';
import { CarriageService } from '../../_services/carriage.service';
import { Carriage } from '../../_models/carriage.module';
import { SeatService } from '../../_services/seat.service';
import { Seat } from '../../_models/seat.module';
import { ApiResponse } from '../../_models/api-response.module';
@Component({
  selector: 'app-train-results',
  standalone: true,
  imports: [DialogModule, CommonModule, TooltipModule, DropdownModule],
  templateUrl: './train-results.component.html',
  styleUrl: './train-results.component.css'
})
export class TrainResultsComponent implements OnInit {
  isVisible = false;

  selectedSeats: number[] = [];
  trainCars: TrainCar[] = [];
  countdownTimes: { [key: number]: number } = {};

  carriages: Carriage[] = [];
  selectedCarriageId!: number;
  selectedSeatIds: number[] = [];
  seats: Seat[] = [];
  schedules: any[] = [];
  trains!: Train[];
  private trainCarService = inject(TrainCarService);
  private scheduleService = inject(ScheduleService);
  private carriageService = inject(CarriageService);
  private seatService = inject(SeatService);
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const storedSchedules = localStorage.getItem('schedules');
    if (storedSchedules) {
      this.schedules = JSON.parse(storedSchedules);
      this.trains = this.schedules.map((schedule) => schedule.train);
    } else {
      this.scheduleService.getSchedules().subscribe({
        next: (data: schedule[]) => {
          this.schedules = data;
          console.log("schedulesss", this.schedules);
          this.trains = this.schedules.map((schedule) => schedule.train);
          // Lưu vào localStorage
          localStorage.setItem('schedules', JSON.stringify(this.schedules));
        },
        error: (err) => {
          console.error('Error fetching schedules:', err);
        },
      });
    }
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
      const expiryTime = parsedData.time + 30000; // 1 phút (60 giây)
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

  trainDetail(trainId: number): void {
    this.isVisible = true;
    this.carriageService.getAllCarriagesByTrainId(trainId).subscribe({
      next: (response: ApiResponse<Carriage[]>) => {
        console.log('carriages', response.data);
        this.carriages = response.data;
      },
      error: (err) => {
        console.log('error load carriages', err);
      },
    });
  }
  selectCarriage(carriageId: number): void {
    this.selectedCarriageId = carriageId;
    this.seatService.getAllSeatsByCarriageId(carriageId).subscribe({
      next: (response: ApiResponse<Seat[]>) => {
        console.log('seats', response.data);
        this.seats = response.data;
      },
      error: (err) => {
        console.log('error load seats', err);
      }
    });
  }

  checkSeatExpiry(): void {
    const dateNow = new Date().getTime();

    this.selectedSeatIds.forEach((seatId) => {
      const seatData = localStorage.getItem('seat' + seatId);

      if (seatData) {
        const parsedData = JSON.parse(seatData);
        // Nếu ghế đã hết hạn
        if (dateNow - parsedData.time > 60000) {
          localStorage.removeItem('seat' + seatId);
          this.selectedSeatIds = this.selectedSeatIds.filter((id) => id !== seatId);
        }
      }
    });
  }

  toggleSeatSelection(seatId: number): void {
    const dateNow = new Date().getTime();

    if (this.selectedSeatIds.includes(seatId)) {
      this.selectedSeatIds = this.selectedSeatIds.filter((id) => id !== seatId);
      localStorage.removeItem('seat' + seatId);
    } else {
      this.selectedSeatIds.push(seatId);
      const seatData = { time: dateNow };
      localStorage.setItem('seat' + seatId, JSON.stringify(seatData));
      this.startCountdown(seatId);
    }

    this.seatService.setSeats(
      this.seats.filter((seat) => this.selectedSeatIds.includes(seat.id))
    );

    console.log('Selected seats:', this.selectedSeatIds);
  }



  removeSeat(seatId: number): void {
    this.selectedSeatIds = this.selectedSeatIds.filter((id) => id !== seatId);
    localStorage.removeItem('seat' + seatId);
  }
  removeSeatAll(): void {
    this.selectedSeatIds.forEach((seatId) => {
      this.selectedSeatIds.filter((id) => id !== seatId);

      localStorage.removeItem('seat' + seatId);
    });

    this.selectedSeatIds = [];
  }

  onSubmit(): void {
    this.router.navigate(['/booking/seat']);
  }
  closeDialog(): void {
    this.isVisible = false;
  }
}

