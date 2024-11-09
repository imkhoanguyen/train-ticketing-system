import { Component, inject, ViewChild } from '@angular/core';
import { PromotionService } from '../../../_services/promotion.service';
import { Promotion } from '../../../_models/promotion';
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
import { Table, TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CalendarModule } from 'primeng/calendar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmPopupModule,
    PaginatorModule,
    TableModule,
    CalendarModule,
    DatePipe,
  ],
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.css',
  providers: [ConfirmationService],
})
export class PromotionComponent {
  private promtionService = inject(PromotionService);
  promotions: Promotion[] = [];
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
  private promotionId: number = 0;
  private toasrt = inject(ToastrService);

  constructor(private confirmationService: ConfirmationService) {}
  validationErrors: string[] = [];
  rangeDates: Date[] | undefined;

  ngOnInit(): void {
    this.loadPromotions();
    this.initForm();
  }

  initForm() {
    this.frm = this.fb.group({
      price: new FormControl<number>(1, [Validators.required]),
      count: new FormControl<number>(1, [Validators.required]),
      rangeDate: new FormControl<Date[]>([], [Validators.required]),
      name: new FormControl<string>('', [Validators.required]),
      code: new FormControl<string>('', [Validators.required]),
      description: new FormControl<string>('', [Validators.required]),
    });
  }

  onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    this.loadPromotions();
  }

  onSearch() {
    // reset pageNumber
    this.pageNumber = 1;
    this.loadPromotions();
  }

  customSort(event: SortEvent) {
    // Set the sorting field and order
    this.sortBy = event.field as string;
    this.sortOrder = event.order === 1 ? 'asc' : 'desc';

    // Call the API to load promotions
    this.loadPromotions();
  }

  loadPromotions() {
    const orderBy = `${this.sortBy},${this.sortOrder}`;
    this.promtionService
      .getPromotionWithLimit(
        this.pageNumber,
        this.pageSize,
        this.search,
        orderBy
      )
      .subscribe({
        next: (response) => {
          const data = response.body?.data;
          if (data) {
            this.promotions = data.items;
            this.total = data.total;
            this.pageSize = data.size;
            this.pageNumber = data.page;
          }
          // this.toasrt.success(
          //   `${response.body?.status} - ${response.body?.message}`
          // );
          console.log(this.promotions);
        },
        error: (er) => {
          console.log(er);
        },
      });
  }

  onSubmit() {
    const promotion: Promotion = {
      name: this.frm.value.name,
      code: this.frm.value.code,
      price: this.frm.value.price,
      description: this.frm.value.description,
      count: this.frm.value.count,
      startDate: this.frm.value.rangeDate[0],
      endDate: this.frm.value.rangeDate[1],
    };
    // edit
    if (this.edit === true && this.promotionId) {
      this.promtionService.update(this.promotionId, promotion).subscribe({
        next: (response) => {
          const { status, message, data } = response;
          const index: number = this.promotions.findIndex(
            (p) => p.id === this.promotionId
          );
          this.promotions[index] = data;
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
      this.promtionService.add(promotion).subscribe({
        next: (response) => {
          const { status, message, data } = response;

          if (data) {
            this.promotions.unshift(data);
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

  deleteConfirmPopup(event: Event, promotionId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn muốn xóa dòng này?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        if (!promotionId) {
          this.toasrt.error('Không tìm thấy promotionId');
          return;
        }

        this.promtionService.delete(promotionId).subscribe({
          next: (response) => {
            const index: number = this.promotions.findIndex(
              (p) => p.id === promotionId
            );
            this.promotions.splice(index, 1);
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

  showDialog(promotionId: number = 0) {
    // edit
    if (promotionId != 0) {
      this.promotionId = promotionId;
      this.edit = true;
      const promotionEdit = this.promotions.find((p) => p.id === promotionId);
      if (promotionEdit == null) {
        this.toasrt.error('Không path được value');
        return;
      }
      this.frm.patchValue({
        name: promotionEdit.name,
        price: promotionEdit.price,
        code: promotionEdit.code,
        description: promotionEdit.description,
        count: promotionEdit.count,
        rangeDate: [
          new Date(promotionEdit.startDate),
          new Date(promotionEdit.endDate),
        ],
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
    this.promotionId = 0;
    this.validationErrors = [];
  }
}
