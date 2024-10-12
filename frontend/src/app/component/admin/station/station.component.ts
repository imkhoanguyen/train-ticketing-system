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
    DialogModule 
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

  loadStations(){
    this.stationService.getAllStations().subscribe(
      (response: any) => {
        this.stations = response.data;  
        this.checkVoucherValidity();
      },
      (error) => {
        console.log('error load stations', error);
      }
    );
  }


  checkVoucherValidity() {
    this.stations.forEach((station) => {
      station.is_delete=!station.is_delete
    });
  }

  onStatusChange(station: Station) {
    
    if (station.is_delete){
      this.stationService.RestoreStation(station.id).subscribe({
        next:(response)=>{
          console.log('active',response)
        },
        error: (err) => {
          console.log('Failed to change to active station', err);
        }
      })
    }
    else{
      this.stationService.DeleteStation(station.id).subscribe({
        next:(response)=>{
          console.log('cook',response)
        },
        error: (err) => {
          console.log('Failed to change to inactive station', err);
        }
      })
    }
  }
  get filteredStations() {
    if (!this.searchQuery) {
      return this.stations; // If no search query, return all stations
    }
    return this.stations.filter(station =>
      station.name.toLowerCase().includes(this.searchQuery.toLowerCase()) 
    );
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
        console.log(station.name)
        console.log(station.is_delete)
        this.stationForm.patchValue({
          name: station.name,
          is_active: !station.is_delete 
        });
      }
    })
    
  }

  onSubmit(): void {
    if (this.stationForm.valid) {
      const stationData = {
        name: this.stationForm.get('name')?.value,
        isDelete: this.stationForm.get('is_active')?.value ? 'true' : 'false'
      };
      
      if (!this.currentState) {
        this.stationService.AddStation(stationData).subscribe({
          next: (response) => {
            console.log('Station added successfully', response);
            this.displayDialog = false; // Đóng dialog
          },
          error: (err) => {
            console.log('Failed to add station', err);
          }
        });
      } else {
        this.stationService.UpdateStation(this.id,stationData).subscribe({
          next: (response) => {
            console.log('Station updated successfully', response);
            this.displayDialog = false; // Đóng dialog
          },
          error: (err) => {
            console.log('Failed to update station', err);
          }
        });
      }
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
