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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    DropdownModule,
    FormsModule,
    RadioButtonModule,
    CalendarModule,
    ButtonModule,
    RouterLink,
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
  returnDate!: null;
  loading: boolean = false;
  isLogin = false;
  private authService = inject(AuthService);
  private routeService = inject(RouteService);
  private scheduleService = inject(ScheduleService);
  currentUser: any;

  stationForm!: FormGroup;
  constructor(private stationService: StationService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
    this.loadStations();
  }
  load() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    this.router.navigate(['/booking']);
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
    if (!this.selectedStation || !this.selectedDestination) {
      alert('Vui lòng chọn ga đi và ga đến');
      return;
    }
    if (!this.departureDate) {
      alert('Vui lòng chọn ngày đi');
      return;
    }
    if (this.tripType === 'khuhoi' && !this.returnDate) {
      alert('Vui lòng chọn ngày về');
      return;
    }
    this.routeService.getRoutesByStationId(this.selectedStation.id, this.selectedDestination.id).subscribe({
      next: (response : RouteModule[]) => {
        console.log('routes', response);

        const routeId = response.map((route) => route.id);
        this.scheduleService.getAllSchedulesByRouteId(routeId[0]).subscribe({
          next: (response : ApiResponse<schedule[]>) => {
            console.log('schedules', response.data);

            this.scheduleService.setSchedules(response.data);

            this.router.navigate(['/train-results']);

          },
          error: (error) => {
            console.log('error load schedules', error);
          },

        });

      }
    });

  }


}
