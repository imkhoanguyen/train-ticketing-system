import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
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
import { OrderComponent } from './component/admin/order/order.component';
import { TicketComponent } from './component/admin/ticket/ticket.component';
import { PromotionComponent } from './component/admin/promotion/promotion.component';
import { DiscountComponent } from './component/admin/discount/discount.component';
import { AdminComponent } from './component/admin/admin.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'train-results', component: TrainResultsComponent },
  {
    path: 'booking',
    component: BookingStepsComponent,
    children: [
      { path: 'seat', component: SeatStepComponent },
      { path: 'personal', component: PersonalStepComponent },
      { path: 'payment', component: PaymentStepComponent },
      { path: 'confirmation', component: ConfirmationStepComponent },
      { path: '', redirectTo: 'seat', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'station', component: StationComponent },
      { path: 'route', component: RouteComponent },
      { path: 'route/schedule/:id', component: SchedulesComponent },
      { path: 'train', component: TrainComponent },
      { path: 'train/carriage/:trainid', component: CarriageComponent },
      { path: 'train/carriage/:trainid/seat/:id', component: SeatComponent },
      { path: 'order', component: OrderComponent },
      { path: 'order/ticket/:id', component: TicketComponent },
      { path: 'promotion', component: PromotionComponent },
      { path: 'discount', component: DiscountComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
