import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import * as XLSX from 'xlsx';
import { Train } from '../../../_models/train.module';
import { TrainService } from '../../../_services/train.service';

@Component({
  selector: 'app-train',
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
  templateUrl: './train.component.html',
  styleUrl: './train.component.css'
})
export class TrainComponent implements OnInit{
  trains: Train[]=[];
  searchQuery: string = '';

  trainForm!: FormGroup;
  displayDialog: boolean = false;
  currentState: boolean=false;
   uploadDialog: boolean = false;
  id!:number;

  fileData: any[] = [];
  imagePreviewUrl: string | null = null;
  imageName: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private trainService:TrainService,
    // private router:Router,
  ){
    this.trainForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      pictureUrl: ['', Validators.required],
      is_active: [true]
    });
  }
  ngOnInit(): void {
    this.loadTrains();
  }

  loadTrains(){
    this.trainService.getAllTrains().subscribe(
      (response: any) => {
        this.trains = response.data; 
        // console.log(this.trains) 
        this.checkVoucherValidity();
      },
      (error) => {
        console.log('error load trains', error);
      }
    );
  }


  checkVoucherValidity() {
    this.trains.forEach((train) => {
      // console.log(train._delete)
      train._delete=!train._delete
    });
  }

  onStatusChange(train: Train) {  
    if (train._delete){
      this.trainService.RestoreTrain(train.id).subscribe({
        next:(response)=>{
          console.log('active',response)
        },
        error: (err) => {
          console.log('Failed to change to active train', err);
        }
      })
    }
    else{

      this.trainService.DeleteTrain(train.id).subscribe({
        next:(response)=>{
          console.log('cook',response)
        },
        error: (err) => {
          console.log('Failed to change to inactive train', err);
        }
      })
    }
  }
  get filteredTrains() {
    if (!this.searchQuery) {
      return this.trains; // If no search query, return all stations
    }
   
    return this.trains.filter(train =>
      train.name.toLowerCase().includes(this.searchQuery.toLowerCase()) 
    );
  }

  

  showDialog() {
    this.displayDialog = true;
    this.trainForm.reset(); 
  }

  newTrain(){
    this.currentState=false;
    this.trainForm.reset()
    this.imagePreviewUrl = null;
    this.showDialog()
    
  }
  editTrain(id: number) {
    this.currentState=true;
    this.showDialog()
    this.id=id
    this.trainForm.reset()
    this.trainService.getTrainById(this.id).subscribe({
      next:(response)=>{
        const train=response.data;
        
        console.log(train.pictureUrl)
        // console.log(this.imagePreviewUrl)
        // console.log(train.name)
        // console.log(train.is_delete)
        this.trainForm.patchValue({
          name: train.name,
          description: train.description,
          pictureUrl: train.pictureUrl,
          is_active: !train._delete 
        });
        this.imagePreviewUrl = train.pictureUrl;
      }
    })
    
  }

  onSubmit(): void {
    if (this.trainForm.valid) {
      const trainData = {
        name: this.trainForm.get('name')?.value,
        description: this.trainForm.get('description')?.value,
        pictureUrl: this.trainForm.get('pictureUrl')?.value,
        isDelete: !this.trainForm.get('is_active')?.value ? 'true' : 'false'
      };
      console.log(trainData.pictureUrl)
      if (!this.currentState) {
        this.trainService.AddTrain(trainData).subscribe({
          next: (response) => {
            console.log('Train added successfully', response);
            this.loadTrains()
          },
          error: (err) => {
            console.log('Failed to add train', err);
          }
        });
      } else {
        this.trainService.UpdateTrain(this.id,trainData).subscribe({
          next: (response) => {
            console.log('Train updated successfully', response);
            this.loadTrains()
          },
          error: (err) => {
            console.log('Failed to update train', err);
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

        console.log('Raw data from Excel:', this.fileData);
        this.fileData = this.fileData.map(row => ({
          name: row[0], 
          description: row[1],
          pictureUrl: row[2],
          is_delete: row[3]  
          
        }));
        console.log('Parsed file data:', this.fileData);
      };
      reader.readAsBinaryString(file);
    }
  }

  uploadTrains(): void {
    if (this.fileData.length > 0) {
      this.trainService.AddMultipleTrains(this.fileData).subscribe({
        next: (response) => {
          console.log('Trains added successfully', response);
          this.loadTrains(); // Reload the stations list
        },
        error: (err) => {
          console.log('Failed to add trains', err);
        }
      });
    } else {
      console.log('No data to upload');
    }
  }

  selectImage() {
    const fileInput = document.getElementById('pictureUrl') as HTMLInputElement;
    fileInput.click();
  }

  // Handle image selection and preview
  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageName = file.name; // Store the image name
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log(e.target.result)
        this.imagePreviewUrl = e.target.result; // Display preview
        const pictureUrl = `assets/${this.imageName}`; // Set pictureUrl path
        
        this.trainForm.patchValue({ pictureUrl }); // Set pictureUrl to the form
        console.log('Image preview URL:', this.imagePreviewUrl);
        console.log('Picture URL:', pictureUrl); // Debug log
      };
      reader.readAsDataURL(file);
    }
  }

  
  
}
