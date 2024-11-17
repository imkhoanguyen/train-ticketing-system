import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { RouteService } from '../../../_services/route.service';
import {RouteModule} from '../../../_models/route.module'
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { StationService } from '../../../_services/station.service';
import { SortEvent } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [
    TableModule,
    InputSwitchModule,
    FormsModule,  
    ReactiveFormsModule,
    ButtonModule,
    RouterModule,
    CommonModule,
    CheckboxModule,
    InputTextModule,
    DialogModule,
    DropdownModule ,
    PaginatorModule
  ],
  templateUrl: './route.component.html',
  styleUrl: './route.component.css'
})
export class RouteComponent implements OnInit{
  routes: RouteModule[]=[];
  stations: RouteModule[]=[];
  searchQuery: string = '';

  routeForm!: FormGroup;
  displayDialog: boolean = false;
  currentState: boolean=false;
  id!:number;
  stationStartOptions: any[] = [];
  stationEndOptions: any[] = [];

  // uploadDialog: boolean = false;
  // fileData: any[] = [];

  pageNumber = 1;
  pageSize = 5;
  total = 0;
  search: string = '';
  sortBy = 'id';
  sortOrder = 'asc';

  constructor(
    private formBuilder: FormBuilder,
    private routeservice:RouteService,
    private stationService:StationService
  ){
    
  }
  ngOnInit(): void {
    this.loadRoutes();
    this.loadStations();
    this.routeForm = this.formBuilder.group({
      name: ['', Validators.required],
      stationStart: [null, Validators.required],
      stationEnd: [null, Validators.required],
      is_active: [false]
    });
  }

  loadStations(){
    this.stationService.getAllStations().subscribe(
      (response: any) => {
        this.stations = response.data; 
        // console.log(this.stations)
        const uniqueStartStations = new Map<number, string>();
        const uniqueEndStations = new Map<number, string>();

        this.stations.forEach((station: any) => {
          if (!uniqueStartStations.has(station.id)|| !uniqueEndStations.has(station.id)) {
            uniqueStartStations.set(station.id, station.name);
            uniqueEndStations.set(station.id, station.name);
          }
        });

        this.stationStartOptions = Array.from(uniqueStartStations.entries()).map(([id, name]) => ({
          startStationId: id,
          startStationName: name,
        }));
        // console.log(this.stationStartOptions)
        this.stationEndOptions = Array.from(uniqueEndStations.entries()).map(([id, name]) => ({
          endStationId: id,
          endStationName: name,
        }));
      },
      (error) => {
        console.log('error load routes', error);
      }
    );
  }

  onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    this.loadRoutes();
  }

  onSearch() {
    this.pageNumber = 1;
    this.loadRoutes();
  }

  customSort(event: SortEvent) {
    this.sortBy = event.field as string;
    this.sortOrder = event.order === 1 ? 'asc' : 'desc';

    this.loadRoutes();
  }
  
  loadRoutes() {
    const orderBy = `${this.sortBy},${this.sortOrder}`;
    this.routeservice
      .getWithLimit(this.pageNumber, this.pageSize, this.search, orderBy)
      .subscribe({
        next: (response) => {
          const data = response.body?.data;
          if (data) {
            this.routes = data.items;
            this.total = data.total;
            this.pageSize = data.size;
            this.pageNumber = data.page;
          }
          this.checkDeleteValidity()
          console.log(this.routes);
        },
        error: (er) => {
          console.log(er);
        },
      });
  }

  checkDeleteValidity() {
    console.log('Before update:', this.stations);
    this.routes.forEach((route) => {
      if (route.hasOwnProperty('delete')) {
        route.delete = !route.delete;
      } else {
        console.error('isDeleted property missing in schedule:', route);
      }
    });
    console.log('After update:', this.routes);
  }

  onDelete(route: RouteModule){
    this.routeservice.DeleteRoute(route.id).subscribe({
      next:(response)=>{
        console.log('cook',response)
      },
      error: (err) => {
        console.log('Failed to change to inactive station', err);
      }
    })
  }
  onRestore(route: RouteModule){
    this.routeservice.RestoreRoute(route.id).subscribe({
      next:(response)=>{
        console.log('active',response)
      },
      error: (err) => {
        console.log('Failed to change to active route', err);
      }
    })
  }

  showDialog() {
    this.displayDialog = true;
    this.routeForm.reset(); 
  }

  newRoute(){
    this.currentState=false;
    this.showDialog()
  }
  editRoute(id: number) {
    this.currentState=true;
    this.showDialog()
    this.id=id
    this.routeservice.getRouteById(this.id).subscribe({
      next:(response)=>{
        const routeArray=response.data;
        console.log(routeArray)
        this.routeForm.patchValue({
          name: routeArray.name,
          stationStart: routeArray.startStation.id, // Use the correct ID for matching
          stationEnd: routeArray.endStation.id, 
          is_active: !routeArray.delete 
        });
      }
    })
    
  }


  onSubmit(): void {
    if (this.routeForm.valid) {
      const routeData = {
        name: this.routeForm.get('name')?.value,
        startStationId: this.routeForm.get('stationStart')?.value,
        endStationId: this.routeForm.get('stationEnd')?.value,
        isDelete: !this.routeForm.get('is_active')?.value ? 'true' : 'false'
      };
      if (routeData.startStationId == routeData.endStationId){
        alert('Ga khởi hành và kết thúc không được giống nhau');
        return;
      }
      // console.log(routeData.startStationId)
      // console.log(routeData.endStationId)
      if (!this.currentState) {
        // console.log(routeData)
        this.routeservice.AddRoute(routeData).subscribe({
          next: (response) => {
            console.log('Station added successfully', response);
            this.loadRoutes()
          },
          error: (err) => {
            console.log('Failed to add station', err);
          }
        });
      } else {
        // console.log(routeData)
        this.routeservice.UpdateRoute(this.id,routeData).subscribe({
          next: (response) => {
            console.log('Station updated successfully', response);
            this.loadRoutes()
          },
          error: (err) => {
            console.log('Failed to update station', err);
          }
        });
      }
      this.displayDialog = false; 
      
    }
  }
}
