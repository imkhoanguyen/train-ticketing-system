import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../_services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from '../../_services/toastr.service';

@Component({
  selector: 'app-personal-step',
  standalone: true,
  imports: [ButtonModule, ReactiveFormsModule],
  templateUrl: './personal-step.component.html',
  styleUrl: './personal-step.component.css'
})
export class PersonalStepComponent implements OnInit {
  personalForm!: FormGroup;
  submit: boolean = false;
  currentUser: any;
  private authService = inject(AuthService);
  private toastrService = inject(ToastrService);
  constructor(private router: Router, private fb: FormBuilder) {}
  ngOnInit(){
    this.initializeForm();

    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.fillUserInfo(this.currentUser);
    }
  }
  initializeForm(): void {
    this.personalForm = this.fb.group({
      fullName: ['', Validators.required],
      cmnd: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  fillUserInfo(user: any): void{
    this.personalForm.patchValue({
      fullName: user.fullName || '',
      cmnd: user.cmnd || '',
      email: user.email || '',
      phone: user.phone || ''
    });
  }

  nextPage() {
    if (this.personalForm.valid) {
      this.router.navigate(['booking/payment']);
      this.submit = true;
    } else {
      this.toastrService.error("Vui lòng nhập đầy đủ thông tin");
    }
  }

  prevPage() {
    this.router.navigate(['booking/seat']);
    this.submit = true;
  }
}
