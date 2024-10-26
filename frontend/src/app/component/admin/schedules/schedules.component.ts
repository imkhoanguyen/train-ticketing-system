import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ScheduleService } from '../../../_services/schedule.service';
import { schedule } from '../../../_models/schedule.module';
import { Train } from '../../../_models/train.module';
import { TableModule } from 'primeng/table';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TrainService } from '../../../_services/train.service'
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RouteService } from '../../../_services/route.service';


@Component({
  selector: 'app-schedules',
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
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.css'
})
export class SchedulesComponent implements OnInit {
  routeId!: number;
  schedules: schedule[]=[];
  trains: Train[]=[];
  selectedRoute: any;
  id!:number;
  searchQuery: string = '';

  scheduleForm!: FormGroup;
  displayDialog: boolean = false;
  currentState: boolean=false;

  trainsOptions: any[] = [];
  routesOptions: any[] = [];
 
  existingSchedules: { startDate: Date, endDate: Date }[] = [];

  confirmDialogVisible: boolean = false;
  scheduleToDelete!: number;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private scheduleService:ScheduleService,
    private trainService:TrainService,
    private routeService:RouteService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.routeId = +id; 
      }
    });
    this.loadRouteName();
    this.loadSchedules();
    this.scheduleForm = this.formBuilder.group({
      routeSelect: [{ value: null, disabled: true }, Validators.required],
      trainSelect: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    });
    
    }

  loadSchedules() {
    this.loadTrains()
    this.scheduleService.getAllSchedulesByRouteId(this.routeId).subscribe(
      (response: any) => {
        this.schedules = response.data; 

        this.existingSchedules = this.schedules.map(schedule => ({
          startDate: new Date(new Date(schedule.startDate).getTime() + 7 * 60 * 60 * 1000), 
          endDate: new Date(new Date(schedule.endDate).getTime() + 7 * 60 * 60 * 1000)
        }));
        console.log(this.existingSchedules)
        

      },
      (error) => {
        console.log('error load routes', error);
      }
    );
  }

  loadTrains() {
    this.trainService.getAllTrains().subscribe(
      (response: any) => {
        this.trains = response.data; 
        // console.log(this.trains)

        this.trainsOptions = this.trains.map(train => ({
          trainId: train.id,
          trainName: train.name
        }));
        
        
      },
      (error) => {
        console.log('error load routes', error);
      }
    );
  }

  loadRouteName(){
    this.routeService.getRouteById(this.routeId).subscribe(
      (response: any)=>{
        this.selectedRoute=response.data;
        // console.log(this.selectedRoute)            
      }
    )
  }
  get filteredSchedules() {
    if (!this.searchQuery) {
      return this.schedules; 
    }
    return this.schedules.filter(schedule =>
      // schedule.routeName?.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
      schedule.trainName?.toLowerCase().includes(this.searchQuery.toLowerCase()) 
      
    );
  }


  showDialog() {
    this.displayDialog = true;
    this.scheduleForm.reset(); 
  }

  newSchedule(){
    this.currentState=false;
    this.showDialog()
    // console.log(this.selectedRoute.name)
    this.scheduleForm.get('routeSelect')?.setValue(this.selectedRoute.name); 
  }

  editSchedule(id: number) {
    this.currentState=true;
    this.showDialog()
    this.id=id
    this.scheduleService.getScheduleById(this.id).subscribe(
      (response: any) =>{
        
        const scheduleArray=response.data;
        console.log(scheduleArray)
        this.scheduleForm.patchValue({
          routeSelect: scheduleArray.routeName,
          trainSelect: scheduleArray.trainId, 
          startDate: new Date(new Date(scheduleArray.startDate).getTime() + 7 * 60 * 60 * 1000), 
          endDate: new Date(new Date(scheduleArray.endDate).getTime() + 7 * 60 * 60 * 1000)  
          
        });
      },
      (error) => {
        console.log('error load routes', error);
      }
    );
    
    
  }


  onSubmit(): void {
    if (this.scheduleForm.valid) {
      const scheduleData = {
        routeId: this.routeId,
        trainId: this.scheduleForm.get('trainSelect')?.value,
        startDate:new Date(this.scheduleForm.get('startDate')?.value).toISOString(),
        endDate:new Date(this.scheduleForm.get('endDate')?.value).toISOString()
      };

      if (scheduleData.startDate > scheduleData.endDate) {
        alert('Ngày bắt đầu không được lớn hơn ngày kết thúc.');
        return;
      }

      const newStartDate = new Date(scheduleData.startDate);
      const newEndDate = new Date(scheduleData.endDate);

      if (this.checkScheduleOverlap(newStartDate, newEndDate)) {
        alert('Lịch trình bị trùng với một lịch trình khác. Vui lòng chọn thời gian khác.');
        return;
      }

      if (!this.currentState) {
        
        
        this.scheduleService.AddSchedule(scheduleData).subscribe({
          next: (response) => {
            console.log('Schedule added successfully', response);
            this.loadSchedules()
          },
          error: (err) => {
            console.log('Failed to add station', err);
          }
        });
      } else {
        console.log(scheduleData)
        this.scheduleService.UpdateSchedule(this.id,scheduleData).subscribe({
          next: (response) => {
            console.log('Schedule updated successfully', response);
            this.loadSchedules()
          },
          error: (err) => {
            console.log('Failed to update station', err);
          }
        });
      }
      this.displayDialog = false; 
      
    }
  }

  checkScheduleOverlap(newStartDate: Date, newEndDate: Date): boolean {
    return this.existingSchedules.some(schedule => 
      (newStartDate < schedule.endDate && newEndDate > schedule.startDate)
    );
  }

  confirmDelete(id: number) {
    this.scheduleToDelete = id;
    this.confirmDialogVisible = true;
  }

  deleteSchedule(){
    this.scheduleService.DeleteSchedule(this.scheduleToDelete).subscribe({
      next: () => {
        console.log('Schedule deleted successfully');
        this.loadSchedules(); 
        this.hideConfirmDialog(); 
      },
      error: (err) => {
        console.log('Failed to delete schedule', err);
      }
    });
  }
  hideConfirmDialog = () => {
    this.confirmDialogVisible = false;
  };
}