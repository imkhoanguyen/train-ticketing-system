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
import { Seat } from '../../../_models/seat.module';
import { SeatService } from '../../../_services/seat.service';
import { CarriageService } from '../../../_services/carriage.service';
import { Carriage } from '../../../_models/carriage.module';
import { SortEvent } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-seat',
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
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.css'
})
export class SeatComponent implements OnInit {
  carriageId!: number;
  trainId!:number;
  seats: Seat[]=[];
  selectedCarriage: any;
  id!:number;
  searchQuery: string = '';

  seatForm!: FormGroup;
  displayDialog: boolean = false;
  currentState: boolean=false;

  // trainsOptions: any[] = [];
  number!:number;

  pageNumber = 1;
  pageSize = 5;
  total = 0;
  search: string = '';
  sortBy = 'id';
  sortOrder = 'asc';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private carriageService:CarriageService,
    private seatService:SeatService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.carriageId = +id; 
      }
      const trainid = params.get('trainid');
      if (trainid) {
        this.trainId = +trainid; 
      }
    });
    // console.log(this.trainId)
    this.loadCarriageName();
    this.loadSeats();
    this.seatForm = this.formBuilder.group({
      carriageSelect: [{ value: null, disabled: true }, Validators.required],
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      number: [''],
      is_active: [true]
    });
    
    }

  onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    this.loadSeats();
  }

  onSearch() {
    this.pageNumber = 1;
    this.loadSeats();
  }

  customSort(event: SortEvent) {
    this.sortBy = event.field as string;
    this.sortOrder = event.order === 1 ? 'asc' : 'desc';

    this.loadSeats();
  }
  
  loadSeats() {
    const orderBy = `${this.sortBy},${this.sortOrder}`;
    this.seatService
      .getWithLimit(this.pageNumber, this.pageSize, this.search, orderBy,this.carriageId)
      .subscribe({
        next: (response) => {
          const data = response.body?.data;
          if (data) {
            this.seats = data.items;
            this.total = data.total;
            this.pageSize = data.size;
            this.pageNumber = data.page;
          }
          // this.toasrt.success(
          //   `${response.body?.status} - ${response.body?.message}`
          // );
          this.checkDeleteValidity()
          console.log(this.seats);
        },
        error: (er) => {
          console.log(er);
        },
      });
  }


  loadCarriageName(){
    this.carriageService.getCarriageById(this.carriageId).subscribe(
      (response: any)=>{
        this.selectedCarriage=response.data;
        // console.log(this.selectedRoute)            
      }
    )
  }

  
  checkDeleteValidity() {
    this.seats.forEach((seat) => {
      seat.delete=!seat.delete
    });
  }

  onDelete(seat: Seat){
    this.seatService.DeleteSeat(seat.id).subscribe({
      next:(response)=>{
        console.log('cook',response)
        // this.loadSchedules()
      },
      error: (err) => {
        console.log('Failed to change to inactive station', err);
      }
    })
  }
  onRestore(seat: Seat){
    this.seatService.RestoreSeat(seat.id).subscribe({
      next:(response)=>{
        console.log('active',response)
        // this.loadSchedules()
      },
      error: (err) => {
        console.log('Failed to change to active station', err);
      }
    })
  }


  showDialog() {
    this.displayDialog = true;
    this.seatForm.reset(); 
  }

  newSeat(){
    this.currentState=false;
    this.showDialog()
    // console.log(this.selectedRoute.name)
    this.seatForm.get('carriageSelect')?.setValue(this.selectedCarriage.name); 

    this.seatForm.get('number')?.setValidators([Validators.required]);
    this.seatForm.get('number')?.updateValueAndValidity();
  }

  editSeat(id:number){
    this.currentState=true;
    this.showDialog()
    this.id=id
    this.seatForm.reset()
    this.seatForm.get('number')?.clearValidators();
    this.seatForm.get('number')?.updateValueAndValidity();

    this.seatService.getSeatById(this.id).subscribe({
      next:(response)=>{
        const seat=response.data;
        this.seatForm.patchValue({
          carriageSelect: this.selectedCarriage.name, 
          name: seat.name,
          price: seat.price,
          description: seat.description,
          is_active:!seat.delete
        });
      }
    })
  }
  onSubmit(){   
    if (this.seatForm.valid) {
      const seatData = {
        carriageId: this.carriageId,
        name: this.seatForm.get('name')?.value,
        price: this.seatForm.get('price')?.value,
        description: this.seatForm.get('description')?.value,
        isDelete: !this.seatForm.get('is_active')?.value ? 'true' : 'false'
      };
  
      if (!this.currentState) {
        this.number = this.seatForm.get('number')?.value;
        // console.log(this.seats)
        const existingSeatsCount = this.seats.filter(seat =>
          seat.name.toLowerCase().includes(seatData.name.toLowerCase())
        ).length;
        
        // console.log(`Number of existing seats with similar names: ${existingSeatsCount}`);
        const start=existingSeatsCount;
        const end=start+Number(this.number);

        for (let i = start + 1; i <= end; i++) {
          seatData.name = `${this.seatForm.get('name')?.value}${i}`;
          console.log(seatData.name)
          this.seatService.AddSeat(seatData).subscribe({
            next: (response) => {
              console.log('Seat added successfully', response)
              this.displayDialog = false;
              this.loadSeats();
            },
            error: (err) => {
              console.error('Failed to add seat', err)
            }
          });
        }
      } else {
        this.seatService.UpdateSeat(this.id, seatData).subscribe({
          next: (response) => {
            console.log('Seat updated successfully', response)
            this.displayDialog = false;
            this.loadSeats();
          },
          error: (err) => {
            console.error('Failed to update seat', err)
          }
        });
      }
  
      
    }
    
  }
}
