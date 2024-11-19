import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Order } from '../../../_models/order.module';
import { OrderService } from '../../../_services/order.service';
import { SortEvent } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { TicketService } from '../../../_services/ticket.service';

@Component({
  selector: 'app-order',
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
    CheckboxModule,
    InputSwitchModule,
    PaginatorModule
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit{
  orders: Order[]=[];
  selectedTrain: any;
  id!:number;
  searchQuery: string = '';


  trainsOptions: any[] = [];
 
  pageNumber = 1;
  pageSize = 5;
  total = 0;
  search: string = '';
  sortBy = 'id';
  sortOrder = 'asc';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private orderService:OrderService,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.loadCarriages();
    
    }

  // loadCarriages() {
  //   this.orderService.getAllOrders().subscribe(
  //     (response: any) => {
  //       this.orders = response.data;   
  //       // this.checkVoucherValidity();
  //     },
  //     (error) => {
  //       console.log('error load orders', error);
  //     }
  //   );
  // }


  
  // get filteredOrders() {
  //   if (!this.searchQuery) {
  //     return this.orders; 
  //   }
  //   return this.orders.filter(order =>
  //     // carriage.routeName?.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
  //     order.fullname?.toLowerCase().includes(this.searchQuery.toLowerCase()) 
      
  //   );
  // }
  onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    this.loadCarriages();
  }

  onSearch() {
    this.pageNumber = 1;
    this.loadCarriages();
  }

  customSort(event: SortEvent) {
    this.sortBy = event.field as string;
    this.sortOrder = event.order === 1 ? 'asc' : 'desc';

    this.loadCarriages();
  }
  
  loadCarriages() {
    const orderBy = `${this.sortBy},${this.sortOrder}`;
    this.orderService
      .getWithLimit(this.pageNumber, this.pageSize, this.search, orderBy)
      .subscribe({
        next: (response) => {
          const data = response.body?.data;
          if (data) {
            this.orders = data.items;
            this.total = data.total;
            this.pageSize = data.size;
            this.pageNumber = data.page;
          }
          console.log(this.orders);
        },
        error: (er) => {
          console.log(er);
        },
      });
  }


}
