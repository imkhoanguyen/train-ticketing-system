import { Component, inject, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { Station } from '../../_models/station.module';
import { FormGroup, FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { StationService } from '../../_services/station.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { RouteService } from '../../_services/route.service';
import { ScheduleService } from '../../_services/schedule.service';
import { RouteModule } from '../../_models/route.module';
import { schedule } from '../../_models/schedule.module';
import { ApiResponse } from '../../_models/api-response.module';
import { ToastrService } from '../../_services/toastr.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule,
    RadioButtonModule,
    CalendarModule,
    ButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  stations: Station[] = [];
  selectedStation: any;
  selectedDestination: any;
  tripType: string = 'motchieu';
  departureDate!: Date;
  returnDate: null | Date = null;
  loading: boolean = false;
  isLogin = false;
  currentUser: any;

  stationForm!: FormGroup;
  minDate: Date = new Date();
  private authService = inject(AuthService);
  private routeService = inject(RouteService);
  private scheduleService = inject(ScheduleService);
  private toastrService = inject(ToastrService);

  constructor(private stationService: StationService, private router: Router) {}

  ngOnInit(): void {
    this.minDate.setDate(this.minDate.getDate());
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
    this.loadStations();
  }


  onTripTypeChange() {
    if (this.tripType === 'motchieu') {
      this.returnDate = null;
    }
  }

  loadStations() {
    console.log('load stations');
    this.stationService.getAllStations().subscribe(
      (response: any) => {
        this.stations = response.data;
        console.log("stations", this.stations);
      },
      (error) => {
        console.log('error load stations', error);
      }
    );
  }
  search() {
    console.log('Starting search...');
  
    // Kiểm tra dữ liệu đầu vào
    if (!this.selectedStation || !this.selectedDestination) {
      alert('Vui lòng chọn ga đi và ga đến');
      return;
    }
  
    if (!this.departureDate) {
      alert('Vui lòng chọn ngày đi');
      return;
    }
  
    // Xử lý ngày đi
    const departureDate = this.addHoursToDate(this.departureDate, 7);
    this.getRoutesAndSchedules(this.selectedStation.id, this.selectedDestination.id, departureDate);
  
    // Xử lý khứ hồi
    if (this.tripType === 'khuhoi') {
      if (!this.returnDate) {
        alert('Vui lòng chọn ngày về');
        return;
      }
  
      const returnDate = this.addHoursToDate(this.returnDate, 7);
      this.getRoutesAndSchedules(this.selectedDestination.id, this.selectedStation.id, returnDate);
    }
  }
  
  addHoursToDate(date: Date, hours: number): Date {
    return new Date(new Date(date).getTime() + hours * 60 * 60 * 1000);
  }
  
  getRoutesAndSchedules(selectedStationId: number, selectedDestinationId: number, date: Date) {
    console.log(`Searching routes from ${selectedStationId} to ${selectedDestinationId} on ${date.toISOString()}`);
  
    this.routeService.getRoutesByStationId(selectedStationId, selectedDestinationId).subscribe({
      next: (routes: RouteModule[]) => {
        if (routes.length > 0) {
          console.log('Found routes:', routes);
          const routeId = routes[0].id;
          this.loadSchedules(routeId, date);
        } else {
          this.toastrService.error('Không tìm thấy tuyến xe phù hợp');
        }
      },
      error: (error) => {
        console.error('Error loading routes:', error);
      }
    });
  }
  
  loadSchedules(routeId: number, date: Date) {
    console.log(`Loading schedules for routeId ${routeId} on ${date.toISOString()}`);
  
    this.scheduleService.getSchedulesByRouteIdAndDate(routeId, date.toISOString()).subscribe({
      next: (response: ApiResponse<schedule[]>) => {
        if (response.data.length === 0) {
          this.toastrService.error('Không tìm thấy lịch trình phù hợp');
          return;
        }
        this.scheduleService.setSchedules(response.data);
        
        this.router.navigate(['/train-results']);
      },
      error: (error) => {
        console.error('Error loading schedules:', error);
      }
    });
  }
  


}
