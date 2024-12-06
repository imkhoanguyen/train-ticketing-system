import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { OrderService } from '../../../_services/order.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Order } from '../../../_models/order.module';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { OrderItem } from '../../../_models/orderItem.module';
import { Ticket } from '../../../_models/ticket.module';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-ordered-ticket',
  standalone: true,
  imports: [
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    RouterModule,
    CommonModule,
    InputTextModule,
    CalendarModule,
    DialogModule,
    DropdownModule,
    ConfirmDialogModule,
    PaginatorModule,
    InputSwitchModule,
    CheckboxModule
  ],
  templateUrl: './ordered-ticket.component.html',
  styleUrl: './ordered-ticket.component.css'
})
export class OrderedTicketComponent implements OnInit{
  userId!:number;
  orders: Order[]=[];
  tickets:Ticket[]=[];
  pageNumber = 1;
  pageSize = 5;
  total = 0;
  search: string = '';
  sortBy = 'id';
  sortOrder = 'asc';

  displayTicketsDialog: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private orderService:OrderService,
  ) {}

  ngOnInit(): void { 
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.userId=user.id;
      // console.log('Dữ liệu:', this.userId);
      this.loadOrder()
    } else {
      console.log('Không tìm thấy dữ liệu.');
    }
  }

  onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    this.loadOrder();
  }

  onSearch() {
    this.pageNumber = 1;
    this.loadOrder();
  }

  customSort(event: SortEvent) {
    this.sortBy = event.field as string;
    this.sortOrder = event.order === 1 ? 'asc' : 'desc';

    this.loadOrder();
  }
  
  loadOrder() {
    const orderBy = `${this.sortBy},${this.sortOrder}`;
    this.orderService
      .getByUserIdWithLimit(this.pageNumber, this.pageSize, this.search, orderBy,this.userId)
      .subscribe({
        next: (response) => {
          const data = response.body?.data;
          if (data) {
            this.orders = data.items;
            this.total = data.total;
            this.pageSize = data.size;
            this.pageNumber = data.page;
          }
          // this.toasrt.success(
          //   `${response.body?.status} - ${response.body?.message}`
          // );
          console.log(this.orders);
        },
        error: (er) => {
          console.log(er);
        },
      });
  }

  viewTickets(orderItems: OrderItem[]) {
    this.tickets = orderItems.map((item) => item.ticket);
    console.log(this.tickets)
    this.displayTicketsDialog = true;
  }

  closeDialog() {
    this.displayTicketsDialog = false;
  }

  exportPdf(ticket:Ticket){
    console.log(ticket)
    const doc = new jsPDF('p', 'pt', 'a5');

    // Header
    doc.setFont('Roboto-Regular');
    doc.setFontSize(20);
    const pageWidth = doc.internal.pageSize.width;
    let startY = 100;

      // Tiêu đề và thông tin cơ bản
      doc.text('VÉ TÀU HỎA', pageWidth / 2, 40, { align: 'center' });
      doc.setFontSize(12);
      const ticketId = `Mã vé: ${ticket.id ?? ''}`;
      // const dateBuy = `Ngày Mua: ${ticket.dateBuy ?? ''}`;
      const dateBuy = `Ngày Mua: ${this.formatDateTime(ticket.dateBuy?.toString() ?? '')}`;
      
      doc.text(`${ticketId}`, 40, 70);
      doc.text(`${dateBuy}`, pageWidth - 40, 70, { align: 'right' });

      // Thông tin khách hàng
      doc.text('Thông tin khách hàng:', 40, startY);
      startY += 20;
      doc.text(`Họ tên: ${ticket.fullName ?? ''}`, 60, startY);
      startY += 15;
      doc.text(`CMND: ${ticket.cmnd ?? ''}`, 60, startY);
      startY += 20;

      // Thông tin chuyến đi
      doc.text('Thông tin chuyến đi:', 40, startY);
      startY += 20;
      doc.text(`Tên chuyến: ${ticket.schedule.route.name ?? ''}`, 60, startY);
      startY += 15;
      const gaDiDen = `Ga đi - Ga đến: ${ticket.schedule.route.startStation.name ?? ''} - ${ticket.schedule.route.endStation.name ?? ''}`;
      doc.text(gaDiDen, 60, startY);
      startY += 15;
      doc.text(`Thời gian đi: ${this.formatDateTime(ticket.schedule.startDate?.toString() ?? '')}`, 60, startY);
      startY += 15;
      doc.text(`Thời gian đến (dự kiến): ${this.formatDateTime(ticket.schedule.endDate?.toString() ?? '')}`, 60, startY);
      startY += 20;

      // Thông tin chỗ ngồi
      const toaChoNgoi = `Toa: ${ticket.seat.carriage.name ?? ''}, Chỗ ngồi: ${ticket.seat.name ?? ''}`;
      doc.text(toaChoNgoi, 60, startY);
      startY += 20;

      if(ticket.returnSeat){
        doc.text('Thông tin chuyến về:', 40, startY);
        startY += 20;
        doc.text(`Tên chuyến: ${ticket.returnSchedule.route.name ?? ''}`, 60, startY);
        startY += 15;
        const gaDiDenreturn = `Ga đi - Ga đến: ${ticket.returnSchedule.route.startStation.name ?? ''} - ${ticket.returnSchedule.route.endStation.name ?? ''}`;
        doc.text(gaDiDenreturn, 60, startY);
        startY += 15;
        doc.text(`Thời gian đi: ${this.formatDateTime(ticket.returnSchedule.startDate?.toString() ?? '')}`, 60, startY);
        startY += 15;
        doc.text(`Thời gian đến (dự kiến): ${this.formatDateTime(ticket.returnSchedule.endDate?.toString() ?? '')}`, 60, startY);
        startY += 20;
        const toaChoNgoireturn = `Toa: ${ticket.returnSeat.carriage.name ?? ''}, Chỗ ngồi: ${ticket.returnSeat.name ?? ''}`;
        doc.text(toaChoNgoireturn, 60, startY);
        startY += 20; 
      }
      
      // Thông tin giá vé
      doc.text('Thông tin thanh toán:', 40, startY);
      startY += 20;
      doc.text(`Đối tượng khuyến mãi: ${ticket.objectDiscount ?? ''}`, 60, startY);
      startY += 15;
      doc.text(`Giá tiền: ${ticket.price ?? ''} VNĐ`, 60, startY);
      startY += 15;
      doc.text(`Giá tiền đã giảm: ${ticket.priceDiscount ?? ''} VNĐ`, 60, startY);

      startY += 40;

      // Footer
      doc.setFontSize(10);
      const footerY = doc.internal.pageSize.height - 40;
      doc.text('Cảm ơn quý khách đã sử dụng dịch vụ!', pageWidth / 2, footerY, { align: 'center' });

      // Xuất PDF
      doc.save('HoaDonBanVeTauHoa.pdf');
  }
  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}
