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
    ConfirmDialogModule
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent implements OnInit {
  id!: number;
  orderItems:OrderItem[]=[];
  tickets: Ticket[]=[];

  searchQuery: string = '';

  scheduleForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private ticketService:TicketService,
    private orderItemService:OrderItemService
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

  loadTickets() {
    this.orderItemService.getAllOrderItemsByOrderId(this.id).subscribe(
      (response: any) => {
        this.orderItems = response.data;
  
        // Create an array of observables
        const ticketRequests = this.orderItems.map(orderItem => 
          this.ticketService.getTicketById(orderItem.ticket_id)
        );
  
        // Use forkJoin to wait for all requests to complete
        forkJoin(ticketRequests).subscribe(
          (ticketResponses: any[]) => {
            this.tickets = ticketResponses.map(ticketResponse => ticketResponse.data);
            // console.log(this.tickets)
            this.checkValidTicket(this.tickets)
          },
          (error) => {
            console.log('error loading tickets', error);
          }
          
        );
      },
      (error) => {
        console.log('error load orderItem', error);
      }
    );
    
  }
  
  get filteredTickets() {
    if (!this.searchQuery) {
      return this.tickets; 
    }
    return this.tickets.filter(ticket =>
      // schedule.routeName?.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
      ticket.fullname?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      ticket.startStation?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      ticket.endStation?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      ticket.id?.toExponential().includes(this.searchQuery.toLowerCase()) ||
      ticket.can_cuoc?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  checkValidTicket(tickets: Ticket[]){
    const currentDate = new Date();
    console.log(currentDate);
    console.log(tickets)
    for(let i=0;i<tickets.length;i++){
      const startDateValue = tickets[i]?.startDate;

      if (startDateValue) {
        const startDate = new Date(startDateValue);
        console.log(startDate);
        console.log(currentDate)
        if (startDate<currentDate){
          this.changeStatus(tickets[i].id)
        }
      } 
    }
    
  }

  changeStatus(id:number){
    this.ticketService.DeleteTicket(id).subscribe({
      next:(response)=>{
        console.log('Đã sử dụng',response)
      },
      error: (err) => {
        console.log('Failed to change to change status', err);
      }
    })
  }
  exportPdf1Ticket(id:number){
    // console.log(this.tickets)
    const doc = new jsPDF('p', 'pt', 'a4');
    const title = 'Vé đã mua';
    const startY = 60;
    let position = startY;
    doc.setFontSize(20);
    doc.text(title, 20, 30);  
    doc.setFontSize(12);
    console.log(this.tickets)
    for(let i=0;i<=this.tickets.length-1;i++){
      if (this.tickets[i].id==id){
        // console.log(this.tickets[i])       
        doc.text(`Mã vé: ${this.tickets[i].id ?? ''}`, 20, position); position += 15;
        doc.text(`Ngày Mua: ${this.tickets[i].dateBuy ?? ''}`, 20, position); position += 15;
        doc.text(`Tên: ${this.tickets[i].fullname ?? ''}`, 20, position); position += 15;
        doc.text(`Đối tượng: ${this.tickets[i].object ?? ''}`, 20, position); position += 15;
        doc.text(`Căn cước: ${this.tickets[i].can_cuoc ?? ''}`, 20, position); position += 15;
        doc.text(`Ga bắt đầu: ${this.tickets[i].startStation ?? ''}`, 20, position); position += 15;
        doc.text(`Ga kết thúc: ${this.tickets[i].endStation ?? ''}`, 20, position); position += 15;
        doc.text(`Thời gian đi: ${this.tickets[i].startDate ?? ''}`, 20, position); position += 15;
        doc.text(`Thời gian đến: ${this.tickets[i].endDate ?? ''}`, 20, position); position += 15;
        doc.text(`Khuyến mãi: ${this.tickets[i].promotionName ?? ''}`, 20, position); position += 15;
        doc.text(`Giá tiền: ${this.tickets[i].price ?? ''}`, 20, position); position += 15;
        doc.text(`Giá tiền đã giảm: ${this.tickets[i].price_reduced ?? ''}`, 20, position); position += 25;  
      }
      // console.log(this.tickets[i].id)
    }
    // doc.line(20, position - 10, 580, position - 10);
    doc.setFontSize(8);
    doc.text('Generated on: ' + new Date().toLocaleString(), 20, doc.internal.pageSize.height - 20);
    doc.save('VeDaMua.pdf');
  }
  
  
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
      doc.text(`Tên: ${ticket.fullname ?? ''}`, 20, position); position += 15;
      doc.text(`Đối tượng: ${ticket.object ?? ''}`, 20, position); position += 15;
      doc.text(`Căn cước: ${ticket.can_cuoc ?? ''}`, 20, position); position += 15;
      doc.text(`Ga bắt đầu: ${ticket.startStation ?? ''}`, 20, position); position += 15;
      doc.text(`Ga kết thúc: ${ticket.endStation ?? ''}`, 20, position); position += 15;
      doc.text(`Thời gian đi: ${ticket.startDate ?? ''}`, 20, position); position += 15;
      doc.text(`Thời gian đến: ${ticket.endDate ?? ''}`, 20, position); position += 15;
      doc.text(`Khuyến mãi: ${ticket.promotionName ?? ''}`, 20, position); position += 15;
      doc.text(`Giá tiền: ${ticket.price ?? ''}`, 20, position); position += 15;
      doc.text(`Giá tiền đã giảm: ${ticket.price_reduced ?? ''}`, 20, position); position += 25;

      doc.line(20, position - 10, 580, position - 10);
    });

    doc.setFontSize(8);
    doc.text('Generated on: ' + new Date().toLocaleString(), 20, doc.internal.pageSize.height - 20);
    doc.save('DanhSachVeDaMua.pdf');
  }

  
  
}
