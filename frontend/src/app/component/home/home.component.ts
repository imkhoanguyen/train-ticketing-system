import { Component } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { Station } from '../../_models/station.module';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DropdownModule, FormsModule, RadioButtonModule, CalendarModule,ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  stations: any[] = []; // Populate with station data
  selectedStation: any;
  selectedDestination: any;
  tripType: string = 'motchieu'; // Default trip type
  departureDate!: Date;
  returnDate!: null;
  loading: boolean = false;

  constructor() {}

  load() {
    // Add your search functionality here
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      // Perform search
    }, 1000);
  }

  onTripTypeChange() {
    // If 'motchieu' is selected, disable the return date field
    if (this.tripType === 'motchieu') {
      this.returnDate = null;
    }
  }
}
