import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  isLogin = false;
  private authService = inject(AuthService);
  currentUser: any;

  constructor(private router: Router) { }
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }

  }
  onLogout() {
    this.authService.logout();
    window.location.reload();
  }
}
