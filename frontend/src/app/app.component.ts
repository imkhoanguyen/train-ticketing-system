import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from './layout/header/header.component';
import { LoadingService } from './_services/loading.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    RouterOutlet,
    ToastModule,
    CommonModule,
    HeaderComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'frontend';
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.loadingService.loading$.subscribe((loading) => {
      Promise.resolve().then(() => {
        this.isLoading = loading;
      });
    });
  }
  isLoading = false;
  private loadingService = inject(LoadingService);

  isAdminPage(): boolean {
    return this.router.url.startsWith('/admin');
  }
}
