import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,

    imports: [RouterOutlet, ToastModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
  constructor(private router: Router) {}


  isAdminPage(): boolean {
    return this.router.url.startsWith('/admin');
  }
}
