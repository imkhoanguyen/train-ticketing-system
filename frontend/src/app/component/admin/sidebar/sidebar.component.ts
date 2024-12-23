import {
  Component,
  EventEmitter,
  Input,
  input,
  Output,
  output,
} from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarModule as PrimeNgSidebarModule } from 'primeng/sidebar';
import { TreeNode } from 'primeng/api';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, PrimeNgSidebarModule, TreeModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() isSidebarCollapsed: boolean = false;
  @Output() changeIsSidebarCollapsed = new EventEmitter<boolean>();
  items = [
    {
      routerLink: 'dashboard',
      icon: 'pi pi-chart-line',
      label: 'Thống kê',
    },
    {
      routerLink: 'station',
      icon: 'pi pi-arrow-right-arrow-left',
      label: 'Station',
    },
    {
      routerLink: 'route',
      icon: 'pi pi-book',
      label: 'Route',
    },
    {
      routerLink: 'train',
      icon: 'pi pi-car',
      label: 'Xe lửa',
    },
    {
      routerLink: 'promotion',
      icon: 'pi pi-angle-double-down',
      label: 'Mã khuyến mãi',
    },
    {
      routerLink: 'discount',
      icon: 'pi pi-arrow-circle-down',
      label: 'Đối tượng khuyến mãi',
    },
    {
      routerLink: 'order',
      icon: 'pi pi-gift',
      label: 'Đơn hàng',
    },
    {
      routerLink: 'user',
      icon: 'pi pi-users',
      label: 'Khách hàng',
    },
  ];

  toggleCollapse(): void {
    this.changeIsSidebarCollapsed.emit(!this.isSidebarCollapsed);
  }

  closeSidenav(): void {
    this.changeIsSidebarCollapsed.emit(true);
  }
}
