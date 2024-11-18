import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { UserService } from '../../../_services/user.service';
import { User } from '../../../_models/user-detail';
import { ToastrService } from '../../../_services/toastr.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmPopupModule,
    PaginatorModule,
    TableModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  providers: [ConfirmationService],
})
export class UserComponent {
  private userService = inject(UserService);
  users: User[] = [];
  private fb = inject(FormBuilder);
  frm: FormGroup = new FormGroup({});
  visible: boolean = false;
  pageNumber = 1;
  pageSize = 5;
  total = 0;
  search: string = '';
  sortBy = 'id';
  sortOrder = 'desc';
  private userId: number = 0;
  private toasrt = inject(ToastrService);

  constructor(private confirmationService: ConfirmationService) {}
  validationErrors: string[] = [];

  ngOnInit(): void {
    this.loadUsers();
    this.initForm();
  }

  initForm() {
    this.frm = this.fb.group({
      price: new FormControl<number>(1, [Validators.required]),
      object: new FormControl<string>('', [Validators.required]),
      description: new FormControl<string>('', [Validators.required]),
    });
  }

  onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    this.loadUsers();
  }

  onSearch() {
    // reset pageNumber
    this.pageNumber = 1;
    this.loadUsers();
  }

  customSort(event: SortEvent) {
    // Set the sorting field and order
    this.sortBy = event.field as string;
    this.sortOrder = event.order === 1 ? 'asc' : 'desc';

    // Call the API to load promotions
    this.loadUsers();
  }

  loadUsers() {
    const orderBy = `${this.sortBy},${this.sortOrder}`;
    this.userService
      .getWithLimit(this.pageNumber, this.pageSize, this.search, orderBy)
      .subscribe({
        next: (response) => {
          const data = response.body?.data;
          if (data) {
            this.users = data.items;
            this.total = data.total;
            this.pageSize = data.size;
            this.pageNumber = data.page;
          }
          // this.toasrt.success(
          //   `${response.body?.status} - ${response.body?.message}`
          // );
          console.log(this.users);
        },
        error: (er) => {
          console.log(er);
        },
      });
  }

  onSubmit() {
    const user: User = {
      id: this.userId,
      userName: this.frm.value.userName,
      fullName: this.frm.value.fullName,
      email: this.frm.value.email,
      phone: this.frm.value.phone,
      cmnd: this.frm.value.cmnd,
      role: 'Customer',
    };
    if (this.userId) {
      // this.discountService.update(this.discountId, discount).subscribe({
      //   next: (response) => {
      //     const { status, message, data } = response;
      //     const index: number = this.discounts.findIndex(
      //       (d) => d.id === this.discountId
      //     );
      //     this.discounts[index] = data;
      //     this.toasrt.success(`${status} - ${message}`);
      //     this.closeDialog();
      //   },
      //   error: (er) => {
      //     console.log('day la error update', er);
      //     const { status, message, data } = er.error;
      //     this.validationErrors = data;
      //   },
      // });
    }
  }

  deleteConfirmPopup(event: Event, discountId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn muốn xóa dòng này?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        if (!discountId) {
          this.toasrt.error('Không tìm thấy userId');
          return;
        }

        // this.discountService.delete(discountId).subscribe({
        //   next: (response) => {
        //     const index: number = this.discounts.findIndex(
        //       (p) => p.id === discountId
        //     );
        //     this.discounts.splice(index, 1);
        //     const { status, message, data } = response;
        //     this.toasrt.success(`${status} - ${message}`);
        //   },
        //   error: (error) => console.log(error),
        // });
      },
      reject: () => {
        this.toasrt.info('Bạn đã hủy xóa');
      },
    });
  }

  showDialog(userId: number = 0) {
    // edit
    if (userId != 0) {
      this.userId = userId;
      const userEdit = this.users.find((u) => u.id === userId);
      if (userEdit == null) {
        this.toasrt.error('Không path được value');
        return;
      }
      this.frm.patchValue({
        userName: userEdit.userName,
        fullName: userEdit.fullName,
        email: userEdit.email,
        phone: userEdit.phone,
        cmnd: userEdit.cmnd,
        role: userEdit.role,
      });
      this.visible = true;
    }
  }

  closeDialog() {
    this.frm.reset();
    this.visible = false;
    this.userId = 0;
    this.validationErrors = [];
  }
}
