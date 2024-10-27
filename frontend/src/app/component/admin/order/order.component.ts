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
 
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private orderService:OrderService,
  ) {}

  ngOnInit(): void {
    this.loadCarriages();
    
    }

  loadCarriages() {
    this.orderService.getAllOrders().subscribe(
      (response: any) => {
        this.orders = response.data;   
        // this.checkVoucherValidity();
      },
      (error) => {
        console.log('error load orders', error);
      }
    );
  }


  
  get filteredOrders() {
    if (!this.searchQuery) {
      return this.orders; 
    }
    return this.orders.filter(order =>
      // carriage.routeName?.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
      order.fullname?.toLowerCase().includes(this.searchQuery.toLowerCase()) 
      
    );
  }


}
