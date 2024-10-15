import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { Station } from '../../_models/station.module';
import {FormGroup, FormsModule} from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import {StationService} from "../../_services/station.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DropdownModule, FormsModule, RadioButtonModule, CalendarModule,ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit{
  stations: Station[] = [];
  selectedStation: any;
  selectedDestination: any;
  tripType: string = 'motchieu';
  departureDate!: Date;
  returnDate!: null;
  loading: boolean = false;

  stationForm!: FormGroup;
  constructor(private stationService: StationService,
              private router: Router
  ) {}

  ngOnInit(): void {
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
  loadStations(){
    this.stationService.getAllStations().subscribe(
      (response: any) => {
        this.stations = response.data;
      },
      (error) => {
        console.log('error load stations', error);
      }
    );
  }
  search(){
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 1000);
    this.router.navigate(['/train-results']);
  }
}
