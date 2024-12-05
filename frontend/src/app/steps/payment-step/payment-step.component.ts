import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../../_services/ticket.service';
import { PaymentService } from '../../_services/payment.service';
import { ApiResponse } from '../../_models/api-response.module';
import { AuthService } from '../../_services/auth.service';
import { Ticket, TicketStatus } from '../../_models/ticket.module';
import { PromotionService } from '../../_services/promotion.service';
import { OrderItemService } from '../../_services/orderItem.service';
import { Promotion } from '../../_models/promotion';
import { ToastrService } from '../../_services/toastr.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-step.component.html',
  styleUrl: './payment-step.component.css'
})
export class PaymentStepComponent implements OnInit {

  ticketData: Ticket[] = [];
  subTotalPrice: number = 0;
  promotionPrice: number = 0;

  discountCode: string = '';
  orderData: any;
  currentUser: any;
  private authService = inject(AuthService);
  private promotionService = inject(PromotionService);
  private paymentService = inject(PaymentService);
  private orderItemService = inject(OrderItemService);
  private toastrService = inject(ToastrService);
  constructor(private router: Router) {}
  ngOnInit(): void {
    const ticketObj = this.orderItemService.getTicketData();
    this.ticketData = JSON.parse(ticketObj);
    console.log('ticketData', this.ticketData);
    this.orderData = this.orderItemService.getOrderData();
    this.currentUser = this.authService.getCurrentUser();

    this.subTotalPrice = this.ticketData.reduce((total, ticket) => total + ticket.price, 0);
  }
  applyPromotion(code: string): void {
    this.promotionService.getPromotionByCode(code).subscribe({
      next: (response: ApiResponse<Promotion>) => {
        console.log(response.data);

        if (response.data) {
          this.promotionPrice = response.data.price;
          this.toastrService.success('Mã đã được áp dụng!');
        } else {
          this.promotionPrice = 0;
          this.toastrService.error('Không tìm thấy mã!');
        }
      },
      error: (err) => {
        console.error('Error applying promotion:', err);
        this.toastrService.error('Có lỗi xảy ra khi áp dụng mã!');
      },
    });
  }

  get totalPrice(): number {
    return this.subTotalPrice - this.promotionPrice;
  }


  getPayment(): void {
    const amount = this.totalPrice;
    if (!amount) {
      alert('Số tiền không hợp lệ.');
      return;
    }
    const bankCode = 'NCB';
    this.paymentService.getPayment(amount, bankCode).subscribe({
      next: (response: ApiResponse<any>) => {
        console.log("response", response.data);
        if (response?.data) {
          window.location.href = response.data.paymentUrl;
        } else {
          alert('Không thể lấy URL thanh toán.');
        }
      },
      error: (err) => {
        console.error('Lỗi khi tạo URL thanh toán:', err);
        alert('Thanh toán thất bại. Vui lòng thử lại.');
      }
    });
  }


}
