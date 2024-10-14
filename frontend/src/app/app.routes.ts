import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { BookingComponent } from './component/booking/booking.component';
import { RoleComponent } from './component/admin/role/role.component';
import { StationComponent } from './component/admin/station/station.component';
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'booking',
    component: BookingComponent,
  },
  {
    path: 'role',
    component: RoleComponent,
  },
  {
    path: 'admin/station',
    component: StationComponent,
  },

];
