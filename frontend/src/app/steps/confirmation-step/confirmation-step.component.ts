import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../_services/payment.service';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../_models/api-response.module';
import { ToastrService } from '../../_services/toastr.service';
import { TicketService } from '../../_services/ticket.service';
import { OrderItemService } from '../../_services/orderItem.service';
import { Ticket, TicketStatus } from '../../_models/ticket.module';
import { OrderService } from '../../_services/order.service';
import { OrderStatus } from '../../_models/order.module';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-confirmation-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-step.component.html',
  styleUrl: './confirmation-step.component.css'
})
export class ConfirmationStepComponent {
  paymentData: any;
  status: string = '';
  ticketData: Ticket[] = [];
  orderData: any;

  private toastrService = inject(ToastrService);
  private ticketService = inject(TicketService);
  private orderService = inject(OrderService);
  private orderItemService = inject(OrderItemService);
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const ticketObj = this.orderItemService.getTicketData();
    this.ticketData = JSON.parse(ticketObj);
    this.orderData = JSON.parse(this.orderItemService.getOrderData());
    console.log("orderData", this.orderData);

    this.route.queryParams.subscribe((params) => {
      this.paymentData = params;
      console.log('Payment data:', this.paymentData);
      this.status = this.paymentData.status;
      if (this.status === 'success') {
        this.updateStatus(true);
      } else {
        this.updateStatus(false);
      }
    });
  }

  updateStatus(success: boolean): void {
    if (success) {
      this.updateTicketStatus(TicketStatus.PAID);
      this.updateOrderStatus(OrderStatus.SUCCESS);
    } else {
      this.updateTicketStatus(TicketStatus.CANCELLED);
      this.updateOrderStatus(OrderStatus.FAIL);
    }
  }

  updateTicketStatus(status: TicketStatus): void {
    const ticketUpdates = this.ticketData.map((ticket) => {
      return this.ticketService.updateTicketStatus(ticket.id, status);
    });

    forkJoin(ticketUpdates).subscribe({
      next: (responses) => {
        responses.forEach((response: ApiResponse<Ticket>) => {
          console.log('Ticket updated:', response.data);
        });
      },
      error: (err) => {
        console.error('Error updating tickets:', err);

      }
    });
  }

  updateOrderStatus(status: OrderStatus): void {
    console.log("ordetdata", this.orderData.id);
    this.orderService.updateOrderStatus(this.orderData.id, status).subscribe({
      next: (response: ApiResponse<any>) => {
        console.log('Order updated:', response.data);
      },
      error: (err) => {
        console.error('Error updating order:', err);
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/']);
  }
}
