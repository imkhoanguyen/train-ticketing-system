import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SeatService } from '../../_services/seat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seat-step',
  standalone: true,
  imports: [ButtonModule, CommonModule],
  templateUrl: './seat-step.component.html',
  styleUrl: './seat-step.component.css'
})
export class SeatStepComponent implements OnInit {
  submit: boolean = false;
  selectSeats: any[] = [];
  private seatService = inject(SeatService);
  constructor(private router: Router) {}

  ngOnInit(){
  this.loadSelectedSeats();
  }
  nextPage(){
    this.router.navigate(['/booking/personal']);
    this.submit = true;
  }
  loadSelectedSeats(): void{
    this.seatService.getSeats().subscribe((seats) => {
      this.selectSeats = seats;
      console.log("selectaa", this.selectSeats);
    });
  }
}
