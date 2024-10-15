import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-seat-step',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './seat-step.component.html',
  styleUrl: './seat-step.component.css'
})
export class SeatStepComponent implements OnInit {
  submit: boolean = false;
  constructor(private router: Router) {}

  ngOnInit(){

  }
  nextPage(){
    this.router.navigate(['/booking/personal']);
    this.submit = true;
  }

}
