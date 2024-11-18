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
  visible: boolean = false;
  pageNumber = 1;
  pageSize = 5;
  total = 0;
  search: string = '';
  sortBy = 'id';
  sortOrder = 'desc';
  private toasrt = inject(ToastrService);

  constructor(private confirmationService: ConfirmationService) {}
  ngOnInit(): void {
    this.loadUsers();
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

  deleteConfirmPopup(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn muốn xóa dòng này?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        if (!id) {
          this.toasrt.error('Không tìm thấy userId');
          return;
        }

        this.userService.delete(id).subscribe({
          next: (response) => {
            const index: number = this.users.findIndex((p) => p.id === id);
            this.users.splice(index, 1);
            const { status, message, data } = response;
            this.toasrt.success(`${status} - ${message}`);
          },
          error: (error) => console.log(error),
        });
      },
      reject: () => {
        this.toasrt.info('Bạn đã hủy xóa');
      },
    });
  }
}
