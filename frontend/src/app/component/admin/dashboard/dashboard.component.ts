import { Component, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { StatisticalService } from '../../../_services/statistical.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartModule, TableModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private statisticalService = inject(StatisticalService);
  totalTicketToDay = 0;
  totalPriceToDay = 0;

  data: any;

  options: any;

  getTotalTicketToDay() {
    this.statisticalService.getTotalTicketToDay().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (er) => {
        console.log(er);
      },
    });
  }

  getTotalPriceToDay() {
    this.statisticalService.getTotalPriceToDay().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (er) => {
        console.log(er);
      },
    });
  }

  getDataChart() {
    this.statisticalService.getDataChart(2024).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (er) => {
        console.log(er);
      },
    });
  }

  ngOnInit() {
    this.getDataChart();
    this.getTotalPriceToDay();
    this.getTotalTicketToDay();
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

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
          label: 'VNĐ',
          backgroundColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          data: [65, 59, 80, 81, 56, 55, 40],
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
}
