import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isLogin = false;
  private authService = inject(AuthService);
  currentUser: any;
  userId = 0;
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.isLogin = true;
      this.userId = this.currentUser.id;
    } else {
      this.isLogin = false;
    }
  }
  onLogout() {
    this.authService.logout();
    window.location.reload();
  }

  goToChangeInfo(): void {
    this.router.navigate(['/change-info', this.userId]);
  }
}
