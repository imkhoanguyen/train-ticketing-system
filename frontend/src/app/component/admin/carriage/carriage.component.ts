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
import { CarriageService } from '../../../_services/carriage.service';
import { TrainService } from '../../../_services/train.service';
import { Carriage } from '../../../_models/carriage.module';
import { Train } from '../../../_models/train.module';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SortEvent } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-carriage',
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
  templateUrl: './carriage.component.html',
  styleUrl: './carriage.component.css'
})
export class CarriageComponent implements OnInit {
  trainId!: number;
  carriages: Carriage[]=[];
  trains: Train[]=[];
  selectedTrain: any;
  id!:number;
  searchQuery: string = '';

  carriageForm!: FormGroup;
  displayDialog: boolean = false;
  currentState: boolean=false;

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
    private carriageService:CarriageService,
    private trainService:TrainService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('trainid');
      if (id) {
        this.trainId = +id; 
      }
    });
    // console.log(this.trainId)
    this.loadTrainName();
    this.loadCarriages();
    this.carriageForm = this.formBuilder.group({
      trainSelect: [{ value: null, disabled: true }, Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      is_active: [true]
    });
    
    }

  // loadCarriages() {
  //   // this.loadTrains()
  //   this.carriageService.getAllCarriagesByTrainId(this.trainId).subscribe(
  //     (response: any) => {
  //       this.carriages = response.data;   
  //       this.checkVoucherValidity();
  //     },
  //     (error) => {
  //       console.log('error load carriages', error);
  //     }
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
    this.carriageService
      .getWithLimit(this.pageNumber, this.pageSize, this.search, orderBy,this.trainId)
      .subscribe({
        next: (response) => {
          const data = response.body?.data;
          if (data) {
            this.carriages = data.items;
            this.total = data.total;
            this.pageSize = data.size;
            this.pageNumber = data.page;
          }
          // this.toasrt.success(
          //   `${response.body?.status} - ${response.body?.message}`
          // );
          this.checkDeleteValidity()
          console.log(this.carriages);
        },
        error: (er) => {
          console.log(er);
        },
      });
  }

  loadTrainName(){
    this.trainService.getTrainById(this.trainId).subscribe(
      (response: any)=>{
        this.selectedTrain=response.data;
        // console.log(this.selectedRoute)            
      }
    )
  }
  
  checkDeleteValidity() {
    this.carriages.forEach((carriage) => {
      carriage.delete=!carriage.delete
    });
  }

  onDelete(carriage: Carriage){
    this.carriageService.DeleteCarriage(carriage.id).subscribe({
      next:(response)=>{
        console.log('cook',response)
        // this.loadSchedules()
      },
      error: (err) => {
        console.log('Failed to change to inactive station', err);
      }
    })
  }
  onRestore(carriage: Carriage){
    this.carriageService.RestoreCarriage(carriage.id).subscribe({
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
    this.carriageForm.reset(); 
  }

  newCarriage(){
    this.currentState=false;
    this.showDialog()
    // console.log(this.selectedRoute.name)
    this.carriageForm.get('trainSelect')?.setValue(this.selectedTrain.name); 
  }

  editCarriage(id: number) {
    this.currentState=true;
    this.showDialog()
    this.id=id
    this.carriageService.getCarriageById(this.id).subscribe(
      (response: any) =>{
        
        const carriageArray=response.data;
        console.log(carriageArray)
        this.carriageForm.patchValue({
          trainSelect: carriageArray.train.name, 
          name: carriageArray.name,
          description: carriageArray.description,
          is_active:!carriageArray.delete
          
        });
      },
      (error) => {
        console.log('error load routes', error);
      }
    );
    
    
  }

  onSubmit(): void {
    if (this.carriageForm.valid) {
      const carriageData = {
        trainId: this.selectedTrain.id,
        name:this.carriageForm.get('name')?.value,
        description:this.carriageForm.get('description')?.value,
        isDelete: !this.carriageForm.get('is_active')?.value ? 'true' : 'false'
      };
      // console.log(carriageData)
      
      if (!this.currentState) {
        
        // console.log(carriageData)
      
        this.carriageService.AddCarriage(carriageData).subscribe({
          next: (response) => {
            console.log('carriage added successfully', response);
            this.loadCarriages()
          },
          error: (err) => {
            console.log('Failed to add carriage', err);
          }
        });
      } else {
        console.log(carriageData)
        this.carriageService.UpdateCarriage(this.id,carriageData).subscribe({
          next: (response) => {
            console.log('carriage updated successfully', response);
            this.loadCarriages()
          },
          error: (err) => {
            console.log('Failed to update carriage', err);
          }
        });
      }
      this.displayDialog = false; 
      
    }
  }


 
}
