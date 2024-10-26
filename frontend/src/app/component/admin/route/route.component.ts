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
import * as XLSX from 'xlsx';

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
  stations: RouteModule[]=[];
  searchQuery: string = '';

  routeForm!: FormGroup;
  displayDialog: boolean = false;
  currentState: boolean=false;
  id!:number;
  stationStartOptions: any[] = [];
  stationEndOptions: any[] = [];

  uploadDialog: boolean = false;
  fileData: any[] = [];

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
        console.log(this.stationStartOptions)
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
  loadRoutes() {
    
    this.routeservice.getAllRoutes().subscribe(
      (response: any) => {
        this.routes = response.data; 
        // console.log(this.routes)
       

        this.checkDeleteValidity()
      },
      (error) => {
        console.log('error load routes', error);
      }
    );
  }

  
  checkDeleteValidity() {
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
      route.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
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

  showUploadDialog() {
    this.uploadDialog = true; // Open the upload dialog
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        this.fileData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        console.log('Raw data from Excel:', this.fileData);
        // You may want to map the data into the required format
        this.fileData = this.fileData.map(row => ({
          name: row[0],
          startStationId: row[1],
          endStationId: row[2],
          isDelete: row[3] 
          
        }));
        console.log('Parsed file data:', this.fileData);
      };
      // reader.readAsBinaryString(file);
    }
  }

  uploadStations(): void {
    if (this.fileData.length > 0) {
      this.stationService.AddMultipleStations(this.fileData).subscribe({
        next: (response) => {
          console.log('Stations added successfully', response);
          this.loadStations(); // Reload the stations list
        },
        error: (err) => {
          console.log('Failed to add stations', err);
        }
      });
    } else {
      console.log('No data to upload');
    }
  }
}
