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
  orderItemData: any;
  dateNow = new Date().getDate();

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
    this.orderItemData = JSON.parse(this.orderItemService.getOrderItemData());
    console.log("orderItemData", this.orderItemData);


    if(this.orderData == null && this.ticketData ==null){
      this.router.navigate(['/booking/ticket']);
    }
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
    this.getOrderById(this.orderData.id);


  }

  getOrderById(id: number){
    this.orderService.getOrderById(id).subscribe({
      next: (response: ApiResponse<any>) => {
        this.orderData = response.data;
        console.log('Order:', this.orderData);
      },
      error: (err) => {
        console.error('Error getting order:', err);
      }
    });
  }

  updateStatus(success: boolean): void {
    if (success) {
      this.updateTicketStatus(TicketStatus.PAID);
      this.updateOrderStatus(OrderStatus.SUCCESS);
    } else {
      this.orderItemData.map((orderItem: any) => {
        return this.orderItemService.deleteOrderItem(orderItem.id).subscribe({
          next: (response: ApiResponse<any>) => {
            this.ticketData.map((ticket) => {
              this.orderService.deleteOrder(this.orderData.id).subscribe({
                next: (response: ApiResponse<any>) => {
                  console.log('Order deleted:', response.data);
                },
                error: (err) => {
                  console.error('Error deleting order:', err);
                }
              });
              return this.ticketService.deleteTicket(ticket.id).subscribe({
                next: (response: ApiResponse<any>) => {
                  console.log('Ticket deleted:', response.data);
                },
                error: (err) => {
                  console.error('Error deleting ticket:', err);
                }
              });
            });
            console.log('Order item deleted:', response.data);
          },
          error: (err) => {
            console.error('Error deleting order item:', err);
          }
        });
      });

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
