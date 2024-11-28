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
    const doc = new jsPDF('p', 'pt', 'a4');
  
    // Sử dụng font Roboto-Regular
    doc.setFont('Roboto-Regular'); 
    doc.setFontSize(20);
    doc.text('Danh sách vé đã mua ắ', 20, 30);
  
    const startY = 60;
    let position = startY;
  
    this.tickets.forEach(ticket => {
      doc.setFontSize(12);
      doc.text(`Mã vé: ${ticket.id ?? ''}`, 20, position); position += 15;
      doc.text(`Ngày Mua: ${ticket.dateBuy ?? ''}`, 20, position); position += 15;
      doc.line(20, position - 10, 580, position - 10);
    });
  
    // Footer
    doc.setFontSize(8);
    doc.text('Generated on: ' + new Date().toLocaleString(), 20, doc.internal.pageSize.height - 20);
  
    doc.save('DanhSachVeDaMua.pdf');
  }
  
  
}
