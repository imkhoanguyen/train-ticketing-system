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

  refundTicket(ticketDate: string) {
    console.log(ticketDate)
    const targetDate = new Date(ticketDate);

    // Lấy ngày và giờ hiện tại
    const currentDate = new Date();

    // So sánh
    if (targetDate > currentDate) {
      console.log('Có thể trả vé');
    } else if (targetDate < currentDate) {
      console.log('Không thể trả vé');
    } else {
      console.log('Ngày mục tiêu và ngày hiện tại là giống nhau');
    }
  }


  exportPdf(ticket:Ticket){
    console.log(ticket)
  }
}
