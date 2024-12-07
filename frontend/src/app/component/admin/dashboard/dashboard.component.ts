import { Component, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { StatisticalService } from '../../../_services/statistical.service';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderList } from '../../../_models/statistical';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ChartModule,
    TableModule,
    CalendarModule,
    FormsModule,
    CommonModule,
    PaginatorModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private statisticalService = inject(StatisticalService);
  private router = inject(Router);
  totalTicketToDay = 0;
  totalPriceToDay = 0;
  totalUserToDay = 0;
  listDataChart = [];
  orders: OrderList[] = [];
  rangeDates: Date[] | undefined = [];

  data: any;

  options: any;

  constructor() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    this.rangeDates = [startOfDay, endOfDay];
  }

  getTotalTicketToDay() {
    this.statisticalService.getTotalTicketToDay().subscribe({
      next: (res) => {
        if (res) {
          this.totalTicketToDay = res.data;
        }
      },
      error: (er) => {
        console.log(er);
      },
    });
  }

  getTotalPriceToDay() {
    this.statisticalService.getTotalPriceToDay().subscribe({
      next: (res) => {
        if (res) {
          this.totalPriceToDay = res.data;
        }
      },
      error: (er) => {
        console.log(er);
      },
    });
  }

  getTotalUserToDay() {
    this.statisticalService.getTotalUserToDay().subscribe({
      next: (res) => {
        if (res) {
          this.totalUserToDay = res.data;
        }
      },
      error: (er) => {
        console.log(er);
      },
    });
  }

  ngOnInit() {
    this.statisticalService.getDataChart(2024).subscribe({
      next: (res) => {
        if (res) {
          console.log(res);
          this.listDataChart = res.body.data;
          const documentStyle = getComputedStyle(document.documentElement);
          const textColor = documentStyle.getPropertyValue('--text-color');
          const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
          );
          const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

          this.data = {
            labels: [
              'T1',
              'T2',
              'T3',
              'T4',
              'T5',
              'T6',
              'T7',
              'T8',
              'T9',
              'T10',
              'T11',
              'T12',
            ],
            datasets: [
              {
                label: 'Doanh thu (VNĐ)',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                data: this.listDataChart,
              },
            ],
          };

          this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
              legend: {
                labels: {
                  color: textColor,
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  color: textColorSecondary,
                  font: {
                    weight: 500,
                  },
                },
                grid: {
                  color: surfaceBorder,
                  drawBorder: false,
                },
              },
              y: {
                ticks: {
                  color: textColorSecondary,
                },
                grid: {
                  color: surfaceBorder,
                  drawBorder: false,
                },
              },
            },
          };
        }
      },
      error: (er) => {
        console.log(er);
      },
    });
    this.getTotalPriceToDay();
    this.getTotalTicketToDay();
    this.getTotalUserToDay();
    this.loadOrders();
  }

  pageNumber = 1;
  pageSize = 5;
  total = 0;
  search: string = '';
  sortBy = 'id';
  sortOrder = 'desc';

  loadOrders() {
    const orderBy = `${this.sortBy},${this.sortOrder}`;
    let startDate = '';
    let endDate = '';
    if (this.rangeDates && this.rangeDates.length > 0) {
      startDate = this.rangeDates[0].toISOString();
      endDate = this.rangeDates[1].toISOString();
    }
    this.statisticalService
      .getListOder(
        this.pageNumber,
        this.pageSize,
        this.search,
        orderBy,
        startDate,
        endDate
      )
      .subscribe({
        next: (response) => {
          const data = response.body?.data;
          console.log(response);
          if (data) {
            this.orders = data.items;
            this.total = data.total;
            this.pageSize = data.size;
            this.pageNumber = data.page;
          }
          console.log('orders', this.orders);
        },
        error: (er) => {
          console.log(er);
        },
      });
  }
  onPageChange(event: any) {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    this.loadOrders();
  }

  onSearch() {
    this.pageNumber = 1;
    this.loadOrders();
  }

  openOrderDetail(orderId: number) {
    this.router.navigate(['/admin/order/ticket', orderId]);
  }
}
