import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { RoleComponent } from './component/admin/role/role.component';
import { StationComponent } from './component/admin/station/station.component';
import { TrainResultsComponent } from './component/train-results/train-results.component';
import { BookingStepsComponent } from './component/booking-steps/booking-steps.component';
import { SeatStepComponent } from './steps/seat-step/seat-step.component';
import { PersonalStepComponent } from './steps/personal-step/personal-step.component';
import { ConfirmationStepComponent } from './steps/confirmation-step/confirmation-step.component';
import { PaymentStepComponent } from './steps/payment-step/payment-step.component';
import { RouteComponent } from './component/admin/route/route.component';
import { SchedulesComponent } from './component/admin/schedules/schedules.component';
import { TrainComponent } from './component/admin/train/train.component';
import { CarriageComponent } from './component/admin/carriage/carriage.component';
import { SeatComponent } from './component/admin/seat/seat.component';

export const routes: Routes = [
  { path: '', component: HomeComponent,},
  { path: 'train-results', component: TrainResultsComponent,},
  {
    path: 'booking', component: BookingStepsComponent,
    children: [
      { path: 'seat', component: SeatStepComponent},
      { path: 'personal', component: PersonalStepComponent},
      { path: 'payment', component: PaymentStepComponent},
      { path: 'confirmation', component: ConfirmationStepComponent},
      { path: '', redirectTo: 'seat', pathMatch: 'full' }
    ]
  },
  { path: 'role', component: RoleComponent,},
  { path: 'admin/station', component: StationComponent,},
  { path: 'admin/route', component: RouteComponent,},
  { path: 'admin/route/schedule/:id', component: SchedulesComponent,},
  { path: 'admin/train', component: TrainComponent,},
  { path: 'admin/train/carriage/:trainid', component:CarriageComponent ,},
  { path: 'admin/train/carriage/:trainid/seat/:id', component:SeatComponent ,},
];
