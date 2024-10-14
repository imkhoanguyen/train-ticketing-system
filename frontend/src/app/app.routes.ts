import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { BookingComponent } from './component/booking/booking.component';
import { RoleComponent } from './component/admin/role/role.component';
import { StationComponent } from './component/admin/station/station.component';
import { TrainResultsComponent } from './component/train-results/train-results.component';
import { TrainDetailsComponent } from './component/train-details/train-details.component';
import { TrainSelectionComponent } from './component/train-selection/train-selection.component';
import { TrainCartComponent } from './component/train-cart/train-cart.component';
import { PaymentComponent } from './component/payment/payment.component';
export const routes: Routes = [
  { path: '', component: HomeComponent,},
  { path: 'booking', component: BookingComponent,},
  { path: 'train-results', component: TrainResultsComponent,},
  { path: 'train-details', component: TrainDetailsComponent,},
  { path: 'train-selection', component: TrainSelectionComponent,},
  { path: 'train-cart', component: TrainCartComponent,},
  { path: 'payment', component: PaymentComponent,},
  { path: 'role', component: RoleComponent,},
  { path: 'admin/station', component: StationComponent,},
];
