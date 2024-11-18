import { Component, OnInit } from '@angular/core';
import { Station } from '../../../_models/station.module';
import { StationService } from '../../../_services/station.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import * as XLSX from 'xlsx';
import { SortEvent } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-station',
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
    PaginatorModule
  ],
  templateUrl: './station.component.html',
  styleUrl: './station.component.css',
  
})
export class StationComponent implements OnInit{
  stations: Station[]=[];
  searchQuery: string = '';

  stationForm!: FormGroup;
  displayDialog: boolean = false;
  currentState: boolean=false;
   uploadDialog: boolean = false;
  id!:number;

  fileData: any[] = [];

  pageNumber = 1;
  pageSize = 5;
  total = 0;
  search: string = '';
  sortBy = 'id';
  sortOrder = 'asc';
  
  constructor(
    private formBuilder: FormBuilder,
    private stationService:StationService,
    // private router:Router,
  ){
    this.stationForm = this.formBuilder.group({
      name: ['', Validators.required],
      is_active: [true]
    });
  }
  ngOnInit(): void {
    this.loadStations();
  }

  onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    this.loadStations();
  }

  onSearch() {
    this.pageNumber = 1;
    this.loadStations();
  }

  customSort(event: SortEvent) {
    this.sortBy = event.field as string;
    this.sortOrder = event.order === 1 ? 'asc' : 'desc';

    this.loadStations();
  }
  
  loadStations() {
    const orderBy = `${this.sortBy},${this.sortOrder}`;
    this.stationService
      .getWithLimit(this.pageNumber, this.pageSize, this.search, orderBy)
      .subscribe({
        next: (response) => {
          const data = response.body?.data;
          if (data) {
            this.stations = data.items;
            this.total = data.total;
            this.pageSize = data.size;
            this.pageNumber = data.page;
          }
          this.checkDeleteValidity()
          console.log(this.stations);
        },
        error: (er) => {
          console.log(er);
        },
      });
  }



  checkDeleteValidity() {
    console.log('Before update:', this.stations);
    this.stations.forEach((station) => {
      if (station.hasOwnProperty('_delete')) {
        station._delete = !station._delete;
      } else {
        console.error('isDeleted property missing in schedule:', station);
      }
    });
    console.log('After update:', this.stations);
  }

  onDelete(station: Station){
    this.stationService.DeleteStation(station.id).subscribe({
      next:(response)=>{
        console.log('cook',response)
      },
      error: (err) => {
        console.log('Failed to change to inactive station', err);
      }
    })
  }
  onRestore(station: Station){
    this.stationService.RestoreStation(station.id).subscribe({
      next:(response)=>{
        console.log('active',response)
      },
      error: (err) => {
        console.log('Failed to change to active station', err);
      }
    })
  }


  showDialog() {
    this.displayDialog = true;
    this.stationForm.reset(); 
  }

  newStation(){
    this.currentState=false;
    this.showDialog()
  }
  editStation(id: number) {
    this.currentState=true;
    this.showDialog()
    this.id=id
    this.stationService.getStationById(this.id).subscribe({
      next:(response)=>{
        const station=response.data;
        console.log(station)
        console.log(station.name)
        console.log(station._delete)
        this.stationForm.patchValue({
          name: station.name,
          is_active: !station._delete 
        });
      }
    })
    
  }

  onSubmit(): void {
    if (this.stationForm.valid) {
      const stationData = {
        name: this.stationForm.get('name')?.value,
        isDelete: !this.stationForm.get('is_active')?.value ? 'true' : 'false'
      };
      
      if (!this.currentState) {
        this.stationService.AddStation(stationData).subscribe({
          next: (response) => {
            console.log('Station added successfully', response);
            this.loadStations()
          },
          error: (err) => {
            console.log('Failed to add station', err);
          }
        });
      } else {
        this.stationService.UpdateStation(this.id,stationData).subscribe({
          next: (response) => {
            console.log('Station updated successfully', response);
            this.loadStations()
          },
          error: (err) => {
            console.log('Failed to update station', err);
          }
        });
      }
      this.displayDialog = false; // Đóng dialog
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

        // console.log('Raw data from Excel:', this.fileData);
        // You may want to map the data into the required format
        this.fileData = this.fileData.map(row => ({
          name: row[0], 
          isDelete: row[1]  
          
        }));
        // console.log('Parsed file data:', this.fileData);
      };
      reader.readAsBinaryString(file);
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
