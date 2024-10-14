import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-train-results',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './train-results.component.html',
  styleUrl: './train-results.component.css'
})
export class TrainResultsComponent {
  isVisible = false;
  constructor(private router: Router) {}
  trainDetail(){
    this.isVisible = true;
  }
}
