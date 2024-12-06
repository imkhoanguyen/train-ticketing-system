import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ScheduleService } from '../../../_services/schedule.service';
import { schedule } from '../../../_models/schedule.module';
import { Train } from '../../../_models/train.module';
import { TableModule } from 'primeng/table';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TrainService } from '../../../_services/train.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RouteService } from '../../../_services/route.service';
import { SortEvent } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';


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
    ConfirmDialogModule,
    PaginatorModule,
    InputSwitchModule,
    CheckboxModule
  ],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.css',
})
export class SchedulesComponent implements OnInit {
  routeId!: number;
  schedules: schedule[] = [];
  trains: Train[] = [];
  selectedRoute: any;
  id!: number;
  searchQuery: string = '';

  scheduleForm!: FormGroup;
  displayDialog: boolean = false;
  currentState: boolean = false;

  trainsOptions: any[] = [];
  routesOptions: any[] = [];

  existingSchedules: any[] = [];

  confirmDialogVisible: boolean = false;
  scheduleToDelete!: number;

  pageNumber = 1;
  pageSize = 5;
  total = 0;
  search: string = '';
  sortBy = 'id';
  sortOrder = 'asc';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private trainService: TrainService,
    private routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
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
      priceSelect: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      is_active: [false]
    });

    }
  //
  onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    this.loadSchedules();
  }

  onSearch() {
    this.pageNumber = 1;
    this.loadSchedules();
  }

  customSort(event: SortEvent) {
    this.sortBy = event.field as string;
    this.sortOrder = event.order === 1 ? 'asc' : 'desc';

    this.loadSchedules();
  }

  loadSchedules() {
    this.loadTrains()

    const orderBy = `${this.sortBy},${this.sortOrder}`;
    this.scheduleService
      .getWithLimit(this.pageNumber, this.pageSize, this.search, orderBy,this.routeId)
      .subscribe({
        next: (response) => {
          const data = response.body?.data;
          if (data) {
            this.schedules = data.items;
            this.total = data.total;
            this.pageSize = data.size;
            this.pageNumber = data.page;
          }
          // this.toasrt.success(
          //   `${response.body?.status} - ${response.body?.message}`
          // );
          this.checkDeleteValidity()
          console.log(this.schedules);
        },
        error: (er) => {
          console.log(er);
        },
      });
  }


  loadTrains() {
    this.trainService.getAllTrains().subscribe(
      (response: any) => {
        this.trains = response.data;
        // console.log(this.trains)

        this.trainsOptions = this.trains.map((train) => ({
          trainId: train.id,
          trainName: train.name,
        }));
      },
      (error) => {
        console.log('error load routes', error);
      }
    );
  }

  loadRouteName() {
    this.routeService.getRouteById(this.routeId).subscribe((response: any) => {
      this.selectedRoute = response.data;
      // console.log(this.selectedRoute)
    });
  }

  checkDeleteValidity() {
    this.schedules.forEach((schedule) => {
      schedule.deleted=!schedule.deleted
    });
  }

  onDelete(schedule: schedule){
    this.scheduleService.DeleteSchedule(schedule.id).subscribe({
      next:(response)=>{
        console.log('cook',response)
        // this.loadSchedules()
      },
      error: (err) => {
        console.log('Failed to change to inactive station', err);
      }
    })
  }
  onRestore(schedule: schedule){
    this.scheduleService.RestoreSchedule(schedule.id).subscribe({
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
    this.scheduleForm.reset();
  }

  newSchedule() {
    this.currentState = false;
    this.showDialog();
    // console.log(this.selectedRoute.name)
    this.scheduleForm.get('routeSelect')?.setValue(this.selectedRoute.name);
  }

  editSchedule(id: number) {
    this.currentState = true;
    this.showDialog();
    this.id = id;
    this.scheduleService.getScheduleById(this.id).subscribe(
      (response: any) => {
        const scheduleArray = response.data;
        console.log(scheduleArray);
        this.scheduleForm.patchValue({
          routeSelect: scheduleArray.route.name,
          trainSelect: scheduleArray.train.id,
          startDate: new Date(new Date(scheduleArray.startDate).getTime() + 7 * 60 * 60 * 1000),
          endDate: new Date(new Date(scheduleArray.endDate).getTime() + 7 * 60 * 60 * 1000),
          priceSelect: scheduleArray.price,
          is_active: scheduleArray.deleted
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
        price:this.scheduleForm.get('priceSelect')?.value,
        startDate:new Date(this.scheduleForm.get('startDate')?.value).toISOString(),
        endDate:new Date(this.scheduleForm.get('endDate')?.value).toISOString(),
        isDeleted:this.scheduleForm.get('is_active')?.value ? 'true' : 'false'
      };

      if (scheduleData.startDate > scheduleData.endDate) {
        alert('Ngày bắt đầu không được lớn hơn ngày kết thúc.');
        return;
      }

      const newStartDate = new Date(scheduleData.startDate);
      const newEndDate = new Date(scheduleData.endDate);

      if (this.checkScheduleOverlap(newStartDate, newEndDate)) {
        alert(
          'Lịch trình bị trùng với một lịch trình khác. Vui lòng chọn thời gian khác.'
        );
        return;
      }

      if (!this.currentState) {


        this.scheduleService.AddSchedule(scheduleData).subscribe({
          next: (response) => {
            console.log('Schedule added successfully', response);
            this.loadSchedules();
          },
          error: (err) => {
            console.log('Failed to add station', err);
          },
        });
      } else {
        console.log(scheduleData);
        this.scheduleService.UpdateSchedule(this.id, scheduleData).subscribe({
          next: (response) => {
            console.log('Schedule updated successfully', response);
            this.loadSchedules();
          },
          error: (err) => {
            console.log('Failed to update station', err);
          },
        });
      }
      this.displayDialog = false;
    }
  }

  checkScheduleOverlap(newStartDate: Date, newEndDate: Date): boolean {
    return this.existingSchedules.some(
      (schedule) =>
        newStartDate < schedule.endDate && newEndDate > schedule.startDate
    );
  }

}
