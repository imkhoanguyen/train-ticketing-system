import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-seat-step',
  standalone: true,
  imports: [ButtonModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './seat-step.component.html',
  styleUrl: './seat-step.component.css'
})
export class SeatStepComponent implements OnInit {
  ticketForm!: FormGroup;

  selectSeats: any[] = [];
  discountObjects: any[] = [];
  promotionValue = 0;

  private seatService = inject(SeatService);
  private discountService = inject(DiscountService);
  private toastrService = inject(ToastrService);
  private promotionService = inject(PromotionService);  

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadSelectedSeats();
    this.loadDiscounts();
  }

  initializeForm(): void {
    this.ticketForm = this.fb.group({
      tickets: this.fb.array([]), 
      promotion: [''],
    });
  }

  get tickets(): FormArray {
    return this.ticketForm.get('tickets') as FormArray;
  }

  addTicket(seat: any): void {
    this.tickets.push(
      this.fb.group({
        fullName: ['', Validators.required],
        cmnd: ['', Validators.required],
        price: [seat.price, Validators.required],
        priceDiscount: [0],
        seatId: [seat.id, Validators.required],
        scheduleId: [0, Validators.required],
        discountId: [null],
        dateBuy: [new Date(), Validators.required],
        status: [0, Validators.required],
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
      next: (discounts) => (this.discountObjects = discounts.data),
      error: (err) => console.error('Error loading discounts:', err),
    });
  }

  getDiscountById(index: number): void {
    const discountId = this.tickets.at(index).get('discountId')?.value;
    if (discountId) {
      this.discountService.getDiscountById(discountId).subscribe({
        next: (discount) => {
          this.tickets.at(index).patchValue({
            priceDiscount: discount.data.price,
          });
        },
        error: (err) => console.error('Error fetching discount:', err),
      });
    }
  }

  calculateFinalPrice(index: number): number {
    const ticket = this.tickets.at(index);
    const price = ticket.get('price')?.value || 0;
    const discount = ticket.get('priceDiscount')?.value || 0;
    return price - discount;
  }

  calculateTotalPrice(): number {
    const total = this.tickets.controls.reduce((total, ticket) => {
      const price = ticket.get('price')?.value || 0;
      const discount = ticket.get('priceDiscount')?.value || 0;
      return total + (price - discount);
    }, 0);

    // Áp dụng giảm giá mã promotion
    return total - this.promotionValue;
  }
  removeTicket(index: number): void {
    this.tickets.removeAt(index);
  }

  clearTickets(): void {
    this.tickets.clear();
  }


  applyPromotion(): void {
    const promoCode = this.ticketForm.get('promotion')?.value;
    this.promotionService.getPromotionByCode(promoCode).subscribe({
      next: (response : ApiResponse<Promotion>) => {
        console.log(response.data);
        if (response.data) {
          this.promotionValue = response.data.price;
          this.tickets.controls.forEach((control) => {
            control.patchValue({
              discountId: response.data.id,
            });
          });
          this.toastrService.success('Mã đã được áp dụng!');
        } else {
          this.toastrService.error('Không tìm thấy mã!');
        }
      },
      error: (err) => console.error('Error applying promotion:', err),
    });
    
  }

  nextPage(): void {
    if (this.ticketForm.valid) {
      this.router.navigate(['/booking/personal']);
    }
    else{
      this.toastrService.error("Vui lòng điền đầy đủ thông tin")
    }
  }
}
