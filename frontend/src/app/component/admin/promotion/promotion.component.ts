import { Component, inject } from '@angular/core';
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
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

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
  orderBy = 'id,desc';
  private promotionId: number = 0;
  private toasrt = inject(ToastrService);

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.loadPromotions();
    this.initForm();
  }

  initForm() {
    this.frm = this.fb.group({
      name: new FormControl<string>('', [Validators.required]),
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

  loadPromotions() {
    this.promtionService
      .getPromotionWithLimit(
        this.pageNumber,
        this.pageSize,
        this.search,
        this.orderBy
      )
      .subscribe({
        next: (response) => {
          const data = response.body?.data;
          if (data) {
            this.promotions = data.items; // Lấy danh sách khuyến mãi
            this.total = data.total; // Lấy tổng số khuyến mãi
            this.pageSize = data.size; // Cập nhật pageSize từ API
            this.pageNumber = data.page; // Cập nhật pageNumber từ API
          }
          this.toasrt.success(
            `${response.body?.status} - ${response.body?.message}`
          );
          console.log(this.promotions); // Kiểm tra dữ liệu đã lấy
        },
        error: (er) => {
          console.log(er);
        },
      });
  }

  onSubmit() {
    if (this.edit === true && this.promotionId) {
      // edit
      const promotion: Promotion = {
        id: this.promotionId,
        name: this.frm.value.name,
        price: this.frm.value.price,
        description: this.frm.value.description,
        count: this.frm.value.count,
        startDate: this.frm.value.startDate,
        endDate: this.frm.value.endDate,
        isDelete: false,
      };
      // this.roleServices.updateRole(role.id || '', role).subscribe({
      //   next: (response) => {
      //     const index: number = this.roles.findIndex((r) => r.id === role.id);
      //     this.roles[index] = response;
      //     this.toasrt.success('Cập nhật quyền thành công');
      //     this.closeDialog();
      //   },
      //   error: (er) => {
      //     this.validationErrors = er;
      //   },
      // });
    } else {
      // add
      const promotion: Promotion = {
        name: this.frm.value.name,
        price: this.frm.value.price,
        description: this.frm.value.description,
        count: this.frm.value.count,
        startDate: this.frm.value.startDate,
        endDate: this.frm.value.endDate,
        isDelete: false,
      };
      // this.roleServices.addRole(role).subscribe({
      //   next: (response) => {
      //     this.roles.unshift(response);
      //     this.toasrt.success('Thêm quyền thành công');
      //     this.closeDialog();
      //   },
      //   error: (er) => {
      //     this.validationErrors = er;
      //   },
      // });
    }
  }

  deleteConfirmPopup(event: Event, roleId?: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn muốn xóa dòng này?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: () => {
        if (!roleId) {
          this.toasrt.error('Không tìm thấy promotionId');
          return;
        }

        // this.roleServices.deleteRole(roleId).subscribe({
        //   next: (_) => {
        //     const index: number = this.roles.findIndex((r) => r.id === roleId);
        //     this.roles.splice(index, 1);
        //     this.toasrt.success('Xóa thành công');
        //   },
        //   error: (error) => console.log(error),
        // });
      },
      reject: () => {
        this.toasrt.info('Bạn đã hủy xóa');
      },
    });
  }

  showDialog(promotionId: number = 0) {
    // edit
    if (this.promotionId != 0) {
      this.promotionId = promotionId;
      this.edit = true;
      const promotionEdit = this.promotions.find((p) => p.id === promotionId);
      this.frm.patchValue({
        id: this.promotionId,
        name: this.frm.value.name,
        price: this.frm.value.price,
        description: this.frm.value.description,
        count: this.frm.value.count,
        startDate: this.frm.value.startDate,
        endDate: this.frm.value.endDate,
        isDelete: false,
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
  }
}
