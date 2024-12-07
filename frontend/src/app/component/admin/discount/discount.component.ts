import { Component, inject } from '@angular/core';
import { DiscountService } from '../../../_services/discount.service';
import { Discount } from '../../../_models/discount';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from '../../../_services/toastr.service';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-discount',
  standalone: true,
  imports: [
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmPopupModule,
    PaginatorModule,
    TableModule,
    CommonModule,
  ],
  templateUrl: './discount.component.html',
  styleUrl: './discount.component.css',
  providers: [ConfirmationService],
})
export class DiscountComponent {
  private discountService = inject(DiscountService);
  discounts: Discount[] = [];
  private fb = inject(FormBuilder);
  frm: FormGroup = new FormGroup({});
  visible: boolean = false;
  edit = false;
  pageNumber = 1;
  pageSize = 5;
  total = 0;
  search: string = '';
  sortBy = 'id';
  sortOrder = 'desc';
  private discountId: number = 0;
  private toasrt = inject(ToastrService);

  constructor(private confirmationService: ConfirmationService) {}
  validationErrors: string[] = [];

  ngOnInit(): void {
    this.loadDiscounts();
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
    this.loadDiscounts();
  }

  onSearch() {
    // reset pageNumber
    this.pageNumber = 1;
    this.loadDiscounts();
  }

  customSort(event: SortEvent) {
    // Set the sorting field and order
    this.sortBy = event.field as string;
    this.sortOrder = event.order === 1 ? 'asc' : 'desc';

    // Call the API to load promotions
    this.loadDiscounts();
  }

  loadDiscounts() {
    const orderBy = `${this.sortBy},${this.sortOrder}`;
    this.discountService
      .getWithLimit(this.pageNumber, this.pageSize, this.search, orderBy)
      .subscribe({
        next: (response) => {
          const data = response.body?.data;
          if (data) {
            this.discounts = data.items;
            this.total = data.total;
            this.pageSize = data.size;
            this.pageNumber = data.page;
          }
          // this.toasrt.success(
          //   `${response.body?.status} - ${response.body?.message}`
          // );
          console.log(this.discounts);
        },
        error: (er) => {
          console.log(er);
        },
      });
  }

  onSubmit() {
    const discount: Discount = {
      price: this.frm.value.price,
      description: this.frm.value.description,
      object: this.frm.value.object,
    };
    // edit
    if (this.edit === true && this.discountId) {
      this.discountService.update(this.discountId, discount).subscribe({
        next: (response) => {
          const { status, message, data } = response;
          const index: number = this.discounts.findIndex(
            (d) => d.id === this.discountId
          );
          this.discounts[index] = data;
          this.toasrt.success(`${status} - ${message}`);
          this.closeDialog();
        },
        error: (er) => {
          console.log('day la error update', er);
          const { status, message, data } = er.error;
          this.validationErrors = data;
        },
      });
    } else {
      // add
      this.discountService.add(discount).subscribe({
        next: (response) => {
          const { status, message, data } = response;

          if (data) {
            this.discounts.unshift(data);
          }
          this.toasrt.success(`${status} - ${message}`);
          this.closeDialog();
        },
        error: (er) => {
          console.log('day la error add', er);
          const { status, message, data } = er.error;
          this.validationErrors = data;
        },
      });
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
          this.toasrt.error('Không tìm thấy discountId');
          return;
        }

        this.discountService.delete(discountId).subscribe({
          next: (response) => {
            const index: number = this.discounts.findIndex(
              (p) => p.id === discountId
            );
            this.discounts.splice(index, 1);
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

  showDialog(discountId: number = 0) {
    // edit
    if (discountId != 0) {
      this.discountId = discountId;
      this.edit = true;
      const discountEdit = this.discounts.find((d) => d.id === discountId);
      if (discountEdit == null) {
        this.toasrt.error('Không path được value');
        return;
      }
      this.frm.patchValue({
        object: discountEdit.object,
        price: discountEdit.price,
        description: discountEdit.description,
      });
      this.visible = true;
    } else {
      // add
      this.visible = true;
    }
  }

  closeDialog() {
    this.frm.reset();
    this.visible = false;
    this.edit = false;
    this.discountId = 0;
    this.validationErrors = [];
  }
}
