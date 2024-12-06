import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TicketService } from '../../../_services/ticket.service';
import { Ticket } from '../../../_models/ticket.module';
import jsPDF from 'jspdf';
import { SortEvent } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import '../../../../assets/fonts/Roboto-Regular-normal.js'
@Component({
  selector: 'app-ticket',
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
    PaginatorModule
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent implements OnInit {
  id!: number;
  tickets: Ticket[]=[];

  scheduleForm!: FormGroup;

  pageNumber = 1;
  pageSize = 5;
  total = 0;
  search: string = '';
  sortBy = 'id';
  sortOrder = 'asc';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private ticketService:TicketService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.id = +id; 
      }
    });
    this.loadTickets();
    this.scheduleForm = this.formBuilder.group({
      routeSelect: [{ value: null, disabled: true }, Validators.required],
      trainSelect: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    });
    
  }

  onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    this.loadTickets();
  }

  onSearch() {
    this.pageNumber = 1;
    this.loadTickets();
  }

  customSort(event: SortEvent) {
    this.sortBy = event.field as string;
    this.sortOrder = event.order === 1 ? 'asc' : 'desc';

    this.loadTickets();
  }
  
  loadTickets() {
    const orderBy = `${this.sortBy},${this.sortOrder}`;
    this.ticketService
      .getWithLimit(this.pageNumber, this.pageSize, this.search, orderBy,this.id)
      .subscribe({
        next: (response) => {
          const data = response.body?.data;
          if (data) {
            this.tickets = data.items;
            this.total = data.total;
            this.pageSize = data.size;
            this.pageNumber = data.page;
          }
          // this.toasrt.success(
          //   `${response.body?.status} - ${response.body?.message}`
          // );
          // this.checkDeleteValidity()
          console.log(this.tickets);
        },
        error: (er) => {
          console.log(er);
        },
      });
  }

  exportPdf() {
    const doc = new jsPDF('p', 'pt', 'a5');

    // Header
    doc.setFont('Roboto-Regular');
    doc.setFontSize(20);
    const pageWidth = doc.internal.pageSize.width;

    this.tickets.forEach((ticket, index) => {
      let startY = 100;

      // Tiêu đề và thông tin cơ bản
      doc.text('VÉ TÀU HỎA', pageWidth / 2, 40, { align: 'center' });
      doc.setFontSize(12);
      const ticketId = `Mã vé: ${ticket.id ?? ''}`;
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

      // Thông tin giá vé
      doc.text('Thông tin thanh toán:', 40, startY);
      startY += 20;
      doc.text(`Đối tượng khuyến mãi: ${ticket.objectDiscount ?? ''}`, 60, startY);
      startY += 15;
      doc.text(`Giá tiền: ${ticket.price ?? ''} VNĐ`, 60, startY);
      startY += 15;
      doc.text(`Giá tiền đã giảm: ${ticket.priceDiscount ?? ''} VNĐ`, 60, startY);

      startY += 40;

      // Thêm trang nếu còn vé
      if (index < this.tickets.length - 1) {
        doc.addPage();
      }
    });

    // Footer
    doc.setFontSize(10);
    const footerY = doc.internal.pageSize.height - 40;
    doc.text('Cảm ơn quý khách đã sử dụng dịch vụ!', pageWidth / 2, footerY, { align: 'center' });

    // Xuất PDF
    doc.save('HoaDonBanVeTauHoa.pdf');
  }

  exportPdfEach(ticket:Ticket){
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
