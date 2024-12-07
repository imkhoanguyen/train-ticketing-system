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
import { OrderService } from '../../_services/order.service';

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
  isButtonDisabled: boolean = false;
  discountCode: string = '';
  orderData: any;
  currentUser: any;
  private authService = inject(AuthService);
  private promotionService = inject(PromotionService);
  private paymentService = inject(PaymentService);
  private orderItemService = inject(OrderItemService);
  private orderService = inject(OrderService);
  private toastrService = inject(ToastrService);
  constructor(private router: Router) {}
  ngOnInit(): void {
    const ticketObj = this.orderItemService.getTicketData();
    this.ticketData = JSON.parse(ticketObj);
    console.log('ticketData', this.ticketData);
    this.orderData = JSON.parse(this.orderItemService.getOrderData());

    if(this.orderData == null && this.ticketData ==null){
      this.router.navigate(['/booking/ticket']);
    }
    this.currentUser = this.authService.getCurrentUser();

    this.subTotalPrice = this.ticketData.reduce((total, ticket) => total + ticket.price, 0);
  }
  applyPromotion(code: string): void {


    this.promotionService.getPromotionByCode(code).subscribe({
      next: (response: ApiResponse<Promotion>) => {
        if (response.data) {
          this.promotionPrice = response.data.price;
          if (response.data.id !== undefined) {
            this.updatePromotion(response.data.id, response.data);
          } else {
            this.handlePromotionError('Mã khuyến mãi không hợp lệ!');
          }
        } else {
          this.handlePromotionError('Không tìm thấy mã!');
        }
      },
      error: (err) => {
        this.handlePromotionError('Có lỗi xảy ra khi áp dụng mã!');
      },
    });
  }

  private updatePromotion(promotionId: number, promotion: Promotion): void {

    if (promotion.count <= 0) {
      this.toastrService.error('Mã khuyến mãi đã hết số lần sử dụng!');
      return;
    }
    const date = new Date().getTime();

    if(new Date(promotion.startDate).getTime() > date || new Date(promotion.endDate).getTime() < date){
      this.toastrService.error('Mã khuyến mãi đã hết hạn!');
      return;
    }
    this.orderService.updateOrderPromotion(this.orderData.id, promotionId).subscribe({
      next: () => {
        this.toastrService.success('Mã đã được áp dụng!');
        console.log("totallllllllllllll", this.totalPrice);
        this.orderService.updateOrderSubtotal(this.orderData.id, this.totalPrice).subscribe({
          next: () =>{
            console.log('cap nhat thanh cong');
          },
          error: (err) => {
            console.log("loi");
          }
        });


        this.isButtonDisabled = true;
        promotion.count = promotion.count - 1;
        if (promotion.count > 0) {
          this.promotionService.updatePromotionCount(promotionId, promotion.count).subscribe({
            next: () => {
              console.log('Cập nhật  mã khuyến mãi thành công!');
            },
            error: (err) => {
              console.error('Lỗi khi cập nhật  mã khuyến mãi:', err);
            }
          });
        } else {
          console.log('Mã khuyến mãi đã hết số lần sử dụng, không cần cập nhật!');
        }
      },
      error: (err) => {
        console.log(err);
        this.handlePromotionError('Có lỗi xảy ra khi áp dụng mã!');
      },
    });
  }



  private handlePromotionError(message: string): void {
    this.promotionPrice = 0;
    this.toastrService.error(message);
  }

  get totalPrice(): number {

    return  this.subTotalPrice - this.promotionPrice;
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
