import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { catchError, forkJoin, of } from 'rxjs';

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

  roundTripPairs: any[][] = [];

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

  constructor(private router: Router, private fb: FormBuilder, private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.initializeTicketForm();

    this.loadDiscounts();
    if(this.authService.getCurrentUser()){
      this.currentUser = this.authService.getCurrentUser();
      this.initializeOrderForm();
    }

    this.loadSelectedSeats();
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

  addTicket(pair: any): void {
    this.tickets.push(
      this.fb.group({
        schedules_id: [pair.scheduleId, Validators.required],
        returnSchedules_id: [pair.returnScheduleId],
        seat_id: [pair.seatId, Validators.required],
        returnSeat_id: [pair.returnSeatId],
        dateBuy: [new Date(), Validators.required],
        status: [TicketStatus.PENDING, Validators.required],
        object: [null, Validators.required],
        promotion_id: [null],
        fullname: ['', Validators.required],
        can_cuoc: ['', [Validators.required, Validators.pattern(/^\d{9}|\d{12}$/)]],
        price: [pair.price, Validators.required],
        price_reduced: [null, Validators.required],
        schedulePrice: [pair.schedulePrice, Validators.required],

      })
    );
  }

  loadSelectedSeats(): void {
    const usedSeatIds = new Set<number>();
    if (this.roundTripPairs) {
      this.roundTripPairs.forEach((pair: any) => {
        usedSeatIds.add(pair[0].seatId);
        usedSeatIds.add(pair[1].seatId);
      });
    }

    this.seatService.getSeats().subscribe({
      next: (seats) => {
        this.selectSeats = seats;
        console.log("seat", seats);
        seats.forEach((seat) => this.addTicket(seat));
          // if (!usedSeatIds.has(seat.id)) {
          //   this.addTicket({
          //     schedules_id: seat.scheduleId,
          //     seat_Id: seat.seatId,
          //     price: seat.price,
          //     schedulePrice: seat.schedulePrice,
          //   });
          // }

      },
      error: (err) => console.error('Error loading seats:', err),
    });
  }

  isRoundTripPair(index: number): boolean {
    return this.roundTripPairs && !!this.roundTripPairs[index];
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

  removeTicket(seatId: number): void {
    console.log('Removing ticket:', seatId);
    localStorage.removeItem('seat' + seatId);
    this.tickets.removeAt(this.tickets.controls.findIndex((ticket) => ticket.get('seat_id')?.value === seatId));
    this.cdr.detectChanges();
  }

  removeTicketAll(): void {
    for (let i = 0; i < this.tickets.length; i++) {
      const seatId = this.tickets.at(i).get('seat_id')?.value;
      if (seatId !== undefined) {
        localStorage.removeItem('seat' + seatId);
      }
    }
    this.tickets.clear();
    this.cdr.detectChanges();
  }





  nextPage(): void {
    const order = this.orderForm.value;

    // Thêm Order
    this.orderService.addOrder(order).subscribe({
      next: (orderResponse) => {
        this.orderData = orderResponse.data;
        //this.toastrService.success('Order added successfully!');
        console.log("Order:", orderResponse.data);
        this.orderItemService.setOrderData(orderResponse.data);

        const tickets: Ticket[] = this.ticketForm.value.tickets.map((ticket: any) => {
          const { schedulePrice, ...rest } = ticket;
          return rest;
        });
        console.log('Tickets:', tickets);
        if (!this.ticketForm.valid) {
          this.toastrService.error('Vui lòng nhập đúng thông tin');
          return;
        }

        this.ticketService.addTickets(tickets).subscribe({
          next: (ticketResponses) => {
            console.log('Ticket Responses:', ticketResponses);
            //this.toastrService.success('Tickets added successfully!');

            this.orderItemService.setTicketData(ticketResponses.data);

            // Tạo OrderItem cho từng Ticket
            const orderItems = ticketResponses.data.map((ticket: any) => ({
              id: null,
              order_id: this.orderData.id,
              ticket_id: ticket.id
            }));


            // Thêm OrderItems
            this.addOrderItems(orderItems);
          },
          error: (error) => {
            console.error('Error adding tickets:', error);
            // this.toastrService.error('Failed to add tickets. Please try again.');
          }
        });
      },
      error: (err) => {
        console.error('Error adding order:', err);
        // this.toastrService.error('Failed to add order. Please try again.');
      }
    });
  }

  // Hàm thêm OrderItems
  private async addOrderItems(orderItems: any[]): Promise<void> {
    for (const orderItem of orderItems) {
      try {
        const response = await this.orderItemService.addOrderItem(orderItem).toPromise();
        console.log('Order item added:', response);
      } catch (error) {
        console.error('Error adding order item:', error);
        this.toastrService.error('Failed to add an order item. Continuing with the next...');
      }
    }

    console.log('All order items processed.');
    this.router.navigate(['/booking/payment']);
    this.toastrService.success('Order items added successfully!');
  }



}
