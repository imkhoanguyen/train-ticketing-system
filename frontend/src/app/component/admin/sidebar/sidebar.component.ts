import { Component, EventEmitter, Input, input, Output, output } from '@angular/core';
import { TreeModule } from 'primeng/tree'
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarModule as PrimeNgSidebarModule } from 'primeng/sidebar';
import { TreeNode } from 'primeng/api';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, PrimeNgSidebarModule, TreeModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent{
  @Input() isSidebarCollapsed: boolean = false;
  @Output() changeIsSidebarCollapsed = new EventEmitter<boolean>();
  items = [
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
      routerLink: 'schedule',
      icon: 'pi pi-calendar-minus',
      label: 'Schedule',

    },
    {
      routerLink: 'train',
      icon: 'pi pi-car',
      label: 'Train',

    },
    {
      routerLink: 'carriage',
      icon: 'pi pi-truck',
      label: 'Carriage',
    },
    {
      routerLink: 'promotion',
      icon: 'pi pi-angle-double-down',
      label: 'Promotion',
    },
    {
      routerLink: 'discount',
      icon: 'pi pi-arrow-circle-down',
      label: 'Discount',
    },
    {
      routerLink: 'order',
      icon: 'pi pi-gift',
      label: 'Order',
    },
    {
      routerLink: 'user',
      icon: 'pi pi-users',
      label: 'User',
    },
  ];


  toggleCollapse(): void {
    this.changeIsSidebarCollapsed.emit(!this.isSidebarCollapsed);
  }

  closeSidenav(): void {
    this.changeIsSidebarCollapsed.emit(true);
  }
}
