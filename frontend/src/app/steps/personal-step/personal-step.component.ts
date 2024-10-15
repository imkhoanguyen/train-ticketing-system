import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-personal-step',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './personal-step.component.html',
  styleUrl: './personal-step.component.css'
})
export class PersonalStepComponent implements OnInit {
  submit: boolean = false;
  constructor(private router: Router) {}
  ngOnInit(){
  
  }
  nextPage() {
    this.router.navigate(['booking/payment']);
    this.submit = true;
  }

  prevPage() {
    this.router.navigate(['booking/seat']);
    this.submit = true;
  }

}
