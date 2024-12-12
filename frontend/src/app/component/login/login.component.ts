import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../_services/auth.service';
import { LoginRequest } from '../../_models/user-detail';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, DividerModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  frm: FormGroup = new FormGroup({});

  validationErrors: string[] = [];

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.router.navigateByUrl('/');
    }
    this.initForm();
  }

  initForm() {
    this.frm = this.fb.group({
      userName: new FormControl<string>('', [Validators.required]),
      password: new FormControl<string>('', [Validators.required]),
    });
  }

  onSubmit() {
    const loginRequest: LoginRequest = {
      userName: this.frm.value.userName,
      password: this.frm.value.password,
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        console.log(response);
        const { status, message, data } = response;
        const user = this.authService.getCurrentUser();
        if (user) {
          const role = user.role;
          if (role === 'Admin') {
            this.router.navigateByUrl('/admin');
            return;
          }
          window.location.href = '/';
        }
      },
      error: (er) => {
        console.log('day la error login', er);
        const { status, message, data } = er.error;
        this.validationErrors = data;
      },
    });
  }
}
