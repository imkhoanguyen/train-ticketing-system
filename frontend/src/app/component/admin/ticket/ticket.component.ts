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
import { OrderItemService } from '../../../_services/orderItem.service';
import { OrderItem } from '../../../_models/orderItem.module';
import { forkJoin } from 'rxjs';

import jsPDF from 'jspdf';
import { SortEvent } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';

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


  // exportPdf1Ticket(id:number){
  //   // console.log(this.tickets)
  //   const doc = new jsPDF('p', 'pt', 'a4');
  //   const title = 'Vé đã mua';
  //   const startY = 60;
  //   let position = startY;
  //   doc.setFontSize(20);
  //   doc.text(title, 20, 30);  
  //   doc.setFontSize(12);
  //   console.log(this.tickets)
  //   for(let i=0;i<=this.tickets.length-1;i++){
  //     if (this.tickets[i].id==id){
  //       // console.log(this.tickets[i])       
  //       doc.text(`Mã vé: ${this.tickets[i].id ?? ''}`, 20, position); position += 15;
  //       doc.text(`Ngày Mua: ${this.tickets[i].dateBuy ?? ''}`, 20, position); position += 15;
  //       doc.text(`Tên: ${this.tickets[i].fullname ?? ''}`, 20, position); position += 15;
  //       doc.text(`Đối tượng: ${this.tickets[i].object ?? ''}`, 20, position); position += 15;
  //       doc.text(`Căn cước: ${this.tickets[i].can_cuoc ?? ''}`, 20, position); position += 15;
  //       doc.text(`Ga bắt đầu: ${this.tickets[i].startStation ?? ''}`, 20, position); position += 15;
  //       doc.text(`Ga kết thúc: ${this.tickets[i].endStation ?? ''}`, 20, position); position += 15;
  //       doc.text(`Thời gian đi: ${this.tickets[i].startDate ?? ''}`, 20, position); position += 15;
  //       doc.text(`Thời gian đến: ${this.tickets[i].endDate ?? ''}`, 20, position); position += 15;
  //       doc.text(`Khuyến mãi: ${this.tickets[i].promotionName ?? ''}`, 20, position); position += 15;
  //       doc.text(`Giá tiền: ${this.tickets[i].price ?? ''}`, 20, position); position += 15;
  //       doc.text(`Giá tiền đã giảm: ${this.tickets[i].price_reduced ?? ''}`, 20, position); position += 25;  
  //     }
  //     // console.log(this.tickets[i].id)
  //   }
  //   // doc.line(20, position - 10, 580, position - 10);
  //   doc.setFontSize(8);
  //   doc.text('Generated on: ' + new Date().toLocaleString(), 20, doc.internal.pageSize.height - 20);
  //   doc.save('VeDaMua.pdf');
  
  
  
  exportPdf() {
    const doc = new jsPDF('p', 'pt', 'a4');

  
    const title = 'Danh sách vé đã mua';
    doc.setFontSize(20);
    doc.text(title, 20, 30);

    const startY = 60;
    let position = startY;

    this.tickets.forEach(ticket => {
      doc.setFontSize(12);
      doc.text(`Mã vé: ${ticket.id ?? ''}`, 20, position); position += 15;
      doc.text(`Ngày Mua: ${ticket.dateBuy ?? ''}`, 20, position); position += 15;
      // doc.text(`Tên: ${ticket.fullname ?? ''}`, 20, position); position += 15;
      // doc.text(`Đối tượng: ${ticket.object ?? ''}`, 20, position); position += 15;
      // doc.text(`Căn cước: ${ticket.can_cuoc ?? ''}`, 20, position); position += 15;
      // doc.text(`Ga bắt đầu: ${ticket.startStation ?? ''}`, 20, position); position += 15;
      // doc.text(`Ga kết thúc: ${ticket.endStation ?? ''}`, 20, position); position += 15;
      // doc.text(`Thời gian đi: ${ticket.startDate ?? ''}`, 20, position); position += 15;
      // doc.text(`Thời gian đến: ${ticket.endDate ?? ''}`, 20, position); position += 15;
      // doc.text(`Khuyến mãi: ${ticket.promotionName ?? ''}`, 20, position); position += 15;
      // doc.text(`Giá tiền: ${ticket.price ?? ''}`, 20, position); position += 15;
      // doc.text(`Giá tiền đã giảm: ${ticket.price_reduced ?? ''}`, 20, position); position += 25;

      doc.line(20, position - 10, 580, position - 10);
    });

    doc.setFontSize(8);
    doc.text('Generated on: ' + new Date().toLocaleString(), 20, doc.internal.pageSize.height - 20);
    doc.save('DanhSachVeDaMua.pdf');
  }

  
  
}
