import { Component, OnInit } from '@angular/core';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-booking-steps',
  standalone: true,
  imports: [StepsModule, ToastModule],
  templateUrl: './booking-steps.component.html',
  styleUrl: './booking-steps.component.css',
  providers: [MessageService]
})
export class BookingStepsComponent implements OnInit {
  items: MenuItem[] | undefined;
  subscription: Subscription | undefined;

  constructor(private messageService: MessageService) {}
  ngOnInit() {
    this.items = [
      {
        label: 'Đặt vé',
        routerLink: 'ticket'
      },
      {
        label: 'Thanh toán',
        routerLink: 'payment'
      },
      {
        label: 'Xác nhận thanh toán',
        routerLink: 'confirmation'
      }
    ];
  }
  ngOnDestroy() {
    if (this.subscription) {
        this.subscription.unsubscribe();
    }
  }

}
