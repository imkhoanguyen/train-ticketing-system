import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { BookingComponent } from './component/booking/booking.component';

export const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'booking', component: BookingComponent
  }
];
