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
    this.stationService.getAllStations().subscribe(
      (response: any) => {
        this.stations = response.data;
      },
      (error) => {
        console.log('error load stations', error);
      }
    );
  }
  search() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    this.router.navigate(['/train-results']);
  }

  onLogout() {
    this.authService.logout();
    window.location.reload();
  }
}
