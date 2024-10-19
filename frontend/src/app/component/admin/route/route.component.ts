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
    DropdownModule 
  ],
  templateUrl: './route.component.html',
  styleUrl: './route.component.css'
})
export class RouteComponent implements OnInit{
  routes: RouteModule[]=[];
  searchQuery: string = '';

  routeForm!: FormGroup;
  displayDialog: boolean = false;
  currentState: boolean=false;
  id!:number;
  stationStartOptions: any[] = [];
  stationEndOptions: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private routeservice:RouteService,
  ){
    
  }
  ngOnInit(): void {
    this.loadRoutes();
    this.routeForm = this.formBuilder.group({
      name: ['', Validators.required],
      stationStart: [null, Validators.required],
      stationEnd: [null, Validators.required],
      is_active: [false]
    });
  }

  loadRoutes() {
    this.routeservice.getAllRoutes().subscribe(
      (response: any) => {
        this.routes = response.data; 
        // console.log(this.routes)
        const uniqueStartStations = new Map<number, string>();
        const uniqueEndStations = new Map<number, string>();

        this.routes.forEach((route: any) => {
          if (!uniqueStartStations.has(route.startStationId)|| !uniqueEndStations.has(route.endStationId)) {
            uniqueStartStations.set(route.startStationId, route.startStationName);
            uniqueEndStations.set(route.endStationId, route.endStationName);
          }
        });

        // Chuyển Map thành mảng đối tượng
        this.stationStartOptions = Array.from(uniqueStartStations.entries()).map(([id, name]) => ({
          startStationId: id,
          startStationName: name,
        }));

        this.stationEndOptions = Array.from(uniqueEndStations.entries()).map(([id, name]) => ({
          endStationId: id,
          endStationName: name,
        }));

        this.checkVoucherValidity()
      },
      (error) => {
        console.log('error load routes', error);
      }
    );
  }

  
  checkVoucherValidity() {
    this.routes.forEach((route) => {
      route.is_delete=!route.is_delete
    });
  }

  onStatusChange(route: RouteModule) {
    
    if (!route.is_delete){
      this.routeservice.RestoreRoute(route.id).subscribe({
        next:(response)=>{
          console.log('active',response)
        },
        error: (err) => {
          console.log('Failed to change to active station', err);
        }
      })
    }
    else{
      this.routeservice. DeleteRoute(route.id).subscribe({
        next:(response)=>{
          console.log('cook',response)
        },
        error: (err) => {
          console.log('Failed to change to inactive station', err);
        }
      })
    }
  }

  get filteredRoutes() {
    if (!this.searchQuery) {
      return this.routes; // If no search query, return all stations
    }
    return this.routes.filter(route =>
      // route.name.toLowerCase().includes(this.searchQuery.toLowerCase()) 
      route.startStationName?.toLowerCase().includes(this.searchQuery.toLowerCase()) 
      || route.endStationName?.toLowerCase().includes(this.searchQuery.toLowerCase()) 
    );
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
        this.routeForm.patchValue({
          name: routeArray.name,
          stationStart: routeArray.startStationId, // Use the correct ID for matching
          stationEnd: routeArray.endStationId, 
          is_active: !routeArray.is_delete 
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
