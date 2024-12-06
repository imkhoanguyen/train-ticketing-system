import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SeatService } from '../../_services/seat.service';
import { CommonModule } from '@angular/common';
import { DiscountService } from '../../_services/discount.service';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from '../../_services/toastr.service';
import { PromotionService } from '../../_services/promotion.service';
import { ApiResponse } from '../../_models/api-response.module';
import { Promotion } from '../../_models/promotion';
import { TicketService } from '../../_services/ticket.service';
import { ScheduleService } from '../../_services/schedule.service';
import { schedule } from '../../_models/schedule.module';
import { Ticket, TicketStatus } from '../../_models/ticket.module';
import { AuthService } from '../../_services/auth.service';
import { Order, OrderStatus } from '../../_models/order.module';
import { OrderService } from '../../_services/order.service';
import { OrderItemService } from '../../_services/orderItem.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ticket-step',
  standalone: true,
  imports: [ButtonModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ticket-step.component.html',
  styleUrl: './ticket-step.component.css'
})
export class TicketStepComponent implements OnInit {
  ticketForm!: FormGroup;
  orderForm!: FormGroup;

  schedules: any ={};
  selectSeats: any[] = [];
  discountObjects: any[] = [];
  promotionValue = 0;
  ticketData: any;
  currentUser: any;

  orderData!: Order;

  private seatService = inject(SeatService);
  private discountService = inject(DiscountService);
  private toastrService = inject(ToastrService);
  private scheduleService = inject(ScheduleService);
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private orderItemService = inject(OrderItemService);

  constructor(private router: Router, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.initializeTicketForm();
    this.loadSelectedSeats();
    this.loadDiscounts();
    if(this.authService.getCurrentUser()){
      this.currentUser = this.authService.getCurrentUser();
      this.initializeOrderForm();
    }
  }

  initializeTicketForm(): void {
    this.ticketForm = this.fb.group({
      tickets: this.fb.array([]),
    });
  }
  initializeOrderForm(): void {
    this.orderForm = this.fb.group({
      user_id: [this.currentUser.id, Validators.required],
      status: [OrderStatus.PENDING, Validators.required],
    });
  }

  get tickets(): FormArray {
    return this.ticketForm.get('tickets') as FormArray;
  }

  addTicket(seat: any): void {
    this.tickets.push(
      this.fb.group({
        schedules_id: [seat.scheduleId, Validators.required],
        seat_id: [seat.id, Validators.required],
        dateBuy: [new Date(), Validators.required],
        status: [TicketStatus.PENDING, Validators.required],
        object: [null, Validators.required],
        promotion_id: [null],
        fullname: ['', Validators.required],
        can_cuoc: [''],
        price: [seat.price, Validators.required],
        price_reduced: [null, Validators.required],
        schedulePrice: [seat.schedulePrice, Validators.required],
      })
    );
  }



  loadSelectedSeats(): void {
    this.seatService.getSeats().subscribe({
      next: (seats) => {
        this.selectSeats = seats;
        seats.forEach((seat) => this.addTicket(seat));
      },
      error: (err) => console.error('Error loading seats:', err),
    });
  }

  loadDiscounts(): void {
    this.discountService.getAllDiscounts().subscribe({
      next: (discounts) => (
        console.log('Discounts:', discounts),
        this.discountObjects = discounts.data
      ),
      error: (err) => console.error('Error loading discounts:', err),
    });
  }

  getObjectById(index: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const objectId: number = +selectElement.value;
    if (!objectId) {
      console.error('Object ID is missing!');
      return;
    }

    this.discountService.getDiscountById(objectId).subscribe({
      next: (discount) => {
        console.log('Discount:', discount);


        this.tickets.at(index).patchValue({
          price_reduced: discount.data?.price || 0,
          object: discount.data.object,
        });
      },
      error: (err) => console.error('Error fetching discount:', err),
    });
  }


  calculateFinalPrice(index: number): number {
    const ticket = this.tickets.at(index);
    const schedulePrice = ticket.get('schedulePrice')?.value || 0;
    const price = ticket.get('price')?.value || 0;
    const discount = ticket.get('price_reduced')?.value || 0;
    return price + schedulePrice - discount;
  }
  calculateTotalPrice(): number {
    return this.tickets.controls.reduce((total, ticket) => {
      const schedulePrice = ticket.get('schedulePrice')?.value || 0;
      const price = ticket.get('price')?.value || 0;
      const discount = ticket.get('price_reduced')?.value || 0;
      return total + (price + (schedulePrice) - discount);
    },
    0);
  }

  removeTicket(index: number): void {
    this.tickets.removeAt(index);
  }

  clearTickets(): void {
    this.tickets.clear();
  }




  nextPage(): void {
    const order = this.orderForm.value;

    // Thêm Order
    this.orderService.addOrder(order).subscribe({
      next: (orderResponse) => {
        this.orderData = orderResponse.data;
        this.toastrService.success('Order added successfully!');

        this.orderItemService.setOrderData(orderResponse.data);

        const tickets: Ticket[] = this.ticketForm.value.tickets.map((ticket: any) => {
          const { schedulePrice, ...rest } = ticket;
          return rest;
        });

        if (!this.ticketForm.valid) {
          this.toastrService.error('Please fill in all required fields.');
          return;
        }

        this.ticketService.addTickets(tickets).subscribe({
          next: (ticketResponses) => {
            console.log('Ticket Responses:', ticketResponses);
            this.toastrService.success('Tickets added successfully!');

            this.orderItemService.setTicketData(ticketResponses.data);

            // Tạo OrderItem cho từng Ticket
            const orderItems = ticketResponses.data.map((ticket: any) => ({
              order_id: this.orderData.id,
              ticket_id: ticket.id
            }));

            // Thêm OrderItems
            this.addOrderItems(orderItems);
          },
          error: (error) => {
            console.error('Error adding tickets:', error);
            this.toastrService.error('Failed to add tickets. Please try again.');
          }
        });
      },
      error: (err) => {
        console.error('Error adding order:', err);
        this.toastrService.error('Failed to add order. Please try again.');
      }
    });
  }

  // Hàm thêm OrderItems
  private addOrderItems(orderItems: any[]): void {
    const requests = orderItems.map((orderItem) =>
      this.orderItemService.addOrderItem(orderItem)
    );

    // Gửi tất cả các yêu cầu đồng thời
    forkJoin(requests).subscribe({
      next: () => {
        this.toastrService.success('Order items added successfully!');
        this.router.navigate(['/booking/payment']);
      },
      error: (err) => {
        console.error('Error adding order items:', err);
        this.toastrService.error('Failed to add order items. Please try again.');
      }
    });
  }
}
