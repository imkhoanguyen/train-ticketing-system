import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserUpdate } from '../../_models/user-detail';
import { UserService } from '../../_services/user.service';
import { ToastrService } from '../../_services/toastr.service';

@Component({
  selector: 'app-change-info',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './change-info.component.html',
  styleUrl: './change-info.component.css',
})
export class ChangeInfoComponent {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private toastrService = inject(ToastrService);
  frm: FormGroup = new FormGroup({});
  userId = 0;

  validationErrors: string[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = +id;
    } else {
      this.toastrService.error('Không tìm thấy userId từ route');
    }
    this.initForm();
  }

  initForm() {
    this.frm = this.fb.group({
      userName: new FormControl<string>('', [Validators.required]),
      fullName: new FormControl<string>('', [Validators.required]),
      cmnd: new FormControl<string>('', [Validators.required]),
      phone: new FormControl<string>('', [Validators.required]),
      email: new FormControl<string>('', [Validators.required]),
    });
  }

  onSubmit() {
    const u: UserUpdate = {
      id: this.userId,
      userName: this.frm.value.userName,
      fullName: this.frm.value.fullName,
      cmnd: this.frm.value.cmnd,
      phone: this.frm.value.phone,
      email: this.frm.value.email,
    };

    this.userService.update(this.userId, u).subscribe({
      next: (response) => {
        console.log(response);
        this.toastrService.success(response.message);
      },
      error: (er) => {
        console.log('day la error register', er);
        const { status, message, data } = er.error;
        this.validationErrors = data;
      },
    });
  }
}
