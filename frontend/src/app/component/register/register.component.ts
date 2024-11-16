import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../_services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '../../_models/user-detail';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
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
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
      fullName: new FormControl<string>('', [Validators.required]),
      cmnd: new FormControl<string>('', [Validators.required]),
      phone: new FormControl<string>('', [Validators.required]),
      email: new FormControl<string>('', [Validators.required]),
    });

    this.frm.controls['password'].valueChanges.subscribe({
      next: () => this.frm.controls['confirmPassword'].updateValueAndValidity(),
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      const formGroup = control.parent as FormGroup;
      if (formGroup) {
        const matchControl = formGroup.controls[matchTo];
        if (matchControl && control.value !== matchControl.value) {
          return { notMatching: true };
        }
      }
      return null;
    };
  }

  onSubmit() {
    const registerRequest: RegisterRequest = {
      userName: this.frm.value.userName,
      password: this.frm.value.password,
      fullName: this.frm.value.fullName,
      cmnd: this.frm.value.cmnd,
      phone: this.frm.value.phone,
      email: this.frm.value.email,
    };

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigateByUrl('/login');
      },
      error: (er) => {
        console.log('day la error register', er);
        const { status, message, data } = er.error;
        this.validationErrors = data;
      },
    });
  }
}
