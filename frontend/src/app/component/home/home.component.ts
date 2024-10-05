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
  stations: Station[] | undefined;

  selectedStation: Station | undefined;
  type!: string;

  date1: Date | undefined;

  date2: Date | undefined;
  loading: boolean = false;

  load() {
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
}
