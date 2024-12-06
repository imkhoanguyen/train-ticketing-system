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

  carriages: any[] = [];
  selectedSchedule: schedule = {} as schedule;
  selectedCarriageId!: number;
  selectedSeatIds: number[] = [];
  seats: any[] = [];
  schedules!: schedule[];
  trains!: Train[];
  selectedTrain!: Train;
  currentUser!: User;
  paidSeats: number[] = [];
  paidCarriages: number[] = [];
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

    // this.seatService.getExpiredStream().subscribe(
    //   (data) => {
    //     this.expiredSeats = data.split(',');
    //     //console.log('Ghế hết hạn:', this.expiredSeats);

    //     this.expiredSeats.forEach((expiredSeat) => {
    //       const seatId = parseInt(expiredSeat.split(':')[2], 10);

    //       const seatItem = localStorage.getItem('seat' + seatId);
    //       //console.log('seatItem:', seatItem);
    //       if (seatItem) {
    //           this.removeSeat(seatId);
    //           console.log('Xóa ghe:', seatId);

    //       }
    //     });

    //     this.cdr.detectChanges();
    //   },
    //   (error) => console.error('Error:', error)
    // );
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

  toggleSeatSelection(seat: Seat, schedule: any): void {
    const seatData = {
      userId: this.currentUser.id,
      scheduleId: schedule.id,
      id: seat.id,
      name: seat.name,
      price: seat.price,
      schedulePrice: schedule.price,
      time: new Date().getTime()
    };

    if ( this.selectedSeatIds.includes(seat.id) ) {
      // Hủy ghế
      this.selectedSeatIds = this.selectedSeatIds.filter(id => id !== seat.id);
      localStorage.removeItem('seat' + seat.id);
      this.seatService.cancelSeatSelection(seatData).subscribe();
    } else {
      // Lưu ghế
      this.selectedSeatIds.push(seat.id);
      localStorage.setItem('seat' + seat.id, JSON.stringify(seatData));
      this.seatService.saveSeatSelection(seatData).subscribe();
    }

  }



  removeSeat(seatId: number): void {
    this.selectedSeatIds = this.selectedSeatIds.filter((id) => id !== seatId);
    localStorage.removeItem('seat' + seatId);
    this.cdr.detectChanges();
  }

  removeSeatAll(): void {
    this.selectedSeatIds.forEach((seatId) => {
      this.selectedSeatIds = this.selectedSeatIds.filter((id) => id !== seatId);
      localStorage.removeItem('seat' + seatId);
    });
    this.selectedSeatIds = [];
    this.cdr.detectChanges();
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
    this.scheduleService.getScheduleById(scheduleId).subscribe({
      next: (response) => {
        const currentSchedule = response.data;
        console.log('Schedule hiện tại:', currentSchedule);

        this.getTrainById(trainId);

        this.carriageService.getAllCarriagesByTrainId(trainId).subscribe({
          next: (response: ApiResponse<Carriage[]>) => {

            this.carriages = response.data;

            this.carriages = this.carriages.map(carriage => ({
              ...carriage,
              schedule: currentSchedule,
            }));
            this.carriages.forEach(carriage => {
              this.seatService.getAllSeatsByCarriageId(carriage.id).subscribe({
                next: (seatResponse: ApiResponse<Seat[]>) => {
                  // Kiểm tra tất cả ghế trong toa
                  const allPaid = seatResponse.data.every(seat => this.paidSeats.includes(seat.id));
                  if (allPaid) {
                    // Nếu tất cả ghế đã thanh toán, thêm toa vào paidCarriages
                    this.paidCarriages.push(carriage.id);
                  }
                },
                error: (err) => {
                  console.log('Lỗi khi tải ghế:', err);
                }
              });
            });
          },
          error: (err) => {
            console.log('Lỗi khi tải carriages', err);
          },
        });
      },
      error: (err) => {
        console.log('Lỗi khi tải schedule', err);
      },
    });
  }




  selectCarriage(carriageId: number, schedule: any): void {
    this.selectedCarriageId = carriageId;
    this.seatService.getAllSeatsByCarriageId(carriageId).subscribe({
      next: (response: ApiResponse<Seat[]>) => {


        this.seats = response.data.map(seat => ({
          ...seat,
          schedule,
        }));
        console.log('Danh sách ghế với schedule:', this.seats);
      },
      error: (err) => {
        console.log('Lỗi khi tải ghế:', err);
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
