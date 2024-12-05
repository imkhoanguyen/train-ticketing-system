import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ScheduleService } from '../../_services/schedule.service';
import { Train } from '../../_models/train.module';
import { schedule } from '../../_models/schedule.module';
import { DropdownModule } from 'primeng/dropdown';
import { CarriageService } from '../../_services/carriage.service';
import { Carriage } from '../../_models/carriage.module';
import { SeatService } from '../../_services/seat.service';
import { Seat } from '../../_models/seat.module';
import { ApiResponse } from '../../_models/api-response.module';
import { TrainService } from '../../_services/train.service';
import { AuthService } from '../../_services/auth.service';
import { User } from '../../_models/user-detail';
import * as Stomp from 'stompjs';
import  SockJS from 'sockjs-client';
import { TicketService } from '../../_services/ticket.service';
@Component({
  selector: 'app-train-results',
  standalone: true,
  imports: [DialogModule, CommonModule, TooltipModule, DropdownModule],
  templateUrl: './train-results.component.html',
  styleUrl: './train-results.component.css',
})
export class TrainResultsComponent implements OnInit {
  isVisible = false;
  selectedSeats: number[] = [];

  carriages: Carriage[] = [];
  selectedSchedule: schedule = {} as schedule;
  selectedCarriageId!: number;
  selectedSeatIds: number[] = [];
  seats: Seat[] = [];
  schedules!: schedule[];
  trains!: Train[];
  selectedTrain!: Train;
  currentUser!: User;
  paidSeats: number[] = [];
  expiredSeats: string[] = [];

  private trainService = inject(TrainService);
  private scheduleService = inject(ScheduleService);
  private carriageService = inject(CarriageService);
  private seatService = inject(SeatService);
  private authService = inject(AuthService);
  private ticketService = inject(TicketService);
  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getPaidSeats();
    this.schedules = this.scheduleService.getSchedules();
    console.log('Schedules in TrainResultsComponent:', this.schedules);
    const savedSeats = localStorage.getItem('selectedSeats');
    if (savedSeats) {
      this.selectedSeatIds = JSON.parse(savedSeats).map((seat: any) => seat.seatId);  // Giả sử mỗi ghế có thuộc tính seatId
    }

    this.currentUser = this.authService.getCurrentUser();

    this.seatService.getExpiredStream().subscribe(
      (data) => {
        this.expiredSeats = data.split(',');
        //console.log('Ghế hết hạn:', this.expiredSeats);

        this.expiredSeats.forEach((expiredSeat) => {
          const seatId = parseInt(expiredSeat.split(':')[2], 10);

          const seatItem = localStorage.getItem('seat' + seatId);
          //console.log('seatItem:', seatItem);
          if (seatItem) {
              this.removeSeat(seatId);
              console.log('Xóa ghe:', seatId);

          }
        });

        this.cdr.detectChanges();
      },
      (error) => console.error('Error:', error)
    );
  }

  getPaidSeats(): void {
    this.ticketService.getPaidSeats().subscribe({
      next: (response: ApiResponse<any>) => {
        this.paidSeats = response.data;
        console.log('Ghế đã đặt:', this.paidSeats);
      },
      error: (err) => {
        console.error('Error getting paid seats:', err);
      },
    });
  }

  toggleSeatSelection(seatId: number): void {
    const dateNow = new Date().getTime();
    const userId = this.currentUser.id;
    const schedulePrice = this.selectedSchedule.price;
    const seatData = {
      userId: userId,
      scheduleId: this.selectedSchedule.id,
      seatId: seatId,
      schedulePrice: schedulePrice,
      time: dateNow };

    if (this.selectedSeatIds.includes(seatId)) {
      // Hủy ghế
      this.selectedSeatIds = this.selectedSeatIds.filter((id) => id !== seatId);
      this.seatService.cancelSeatSelection(seatData).subscribe();
      this.removeSeat(seatId);
    } else {
      // Lưu ghế
      this.selectedSeatIds.push(seatId);
      localStorage.setItem('seat' + seatId, JSON.stringify(seatData));
      this.seatService.saveSeatSelection(seatData).subscribe();
    }

    this.updateSeatsInLocalStorage();
  }

  removeSeat(seatId: number): void {
    this.selectedSeatIds = this.selectedSeatIds.filter((id) => id !== seatId);
    localStorage.removeItem('seat' + seatId);
    this.updateSeatsInLocalStorage();

    this.cdr.detectChanges();
  }

  removeSeatAll(): void {
    this.selectedSeatIds.forEach((seatId) => {
      this.selectedSeatIds = this.selectedSeatIds.filter((id) => id !== seatId);
      localStorage.removeItem('seat' + seatId);
    });
    this.selectedSeatIds = [];
    this.updateSeatsInLocalStorage();

    this.cdr.detectChanges();
  }

  updateSeatsInLocalStorage(): void {
    const seatsWithPrices = this.seats
      .filter((seat) => this.selectedSeatIds.includes(seat.id))
      .map((seat) => ({
        ...seat,
        scheduleId: this.selectedSchedule.id,
        schedulePrice: this.selectedSchedule.price,
      }));

    localStorage.setItem('selectedSeats', JSON.stringify(seatsWithPrices));
    console.log('Updated selected seats in localStorage:', seatsWithPrices);
  }
  getTrainById(trainId: number) {
    this.trainService.getTrainById(trainId).subscribe({
      next: (response) => {
        this.selectedTrain = response.data;
      },
      error: (err) => {
        console.log('error load train', err);
      },
    });
  }

  getScheduleById(scheduleId: number) {
    this.scheduleService.getScheduleById(scheduleId).subscribe({
      next: (response) => {
        this.selectedSchedule = response.data;
      },
      error: (err) => {
        console.log('error load schedule', err);
      },
    });
  }

  trainDetail(scheduleId: number, trainId: number): void {

    this.isVisible = true;
    this.getScheduleById(scheduleId);
    this.getTrainById(trainId);
    this.carriageService.getAllCarriagesByTrainId(trainId).subscribe({
      next: (response: ApiResponse<Carriage[]>) => {
        console.log('carriages', response.data);
        this.carriages = response.data;
        console.log("scheduleId", scheduleId);
      },
      error: (err) => {
        console.log('error load carriages', err);
      },
    });
  }
  selectCarriage(carriageId: number): void {
    this.seatService.getAllSeatsByCarriageId(carriageId).subscribe({
      next: (response: ApiResponse<Seat[]>) => {
        this.seats = response.data;
        console.log('seats', this.seats);
      },
      error: (err) => {
        console.log('error load seats', err);
      },
    });
  }

  onSubmit(): void {
    this.router.navigate(['/booking/ticket']);
  }
  closeDialog(): void {
    this.isVisible = false;
    this.seats = [];
  }
}
