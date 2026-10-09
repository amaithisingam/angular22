import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserSession } from '../user-session';
import type { DashboardData } from './dashboard-data';
import { DashboardSidebar } from './sidebar/dashboard-sidebar';

@Component({
  selector: 'app-dashboard-page',
  imports: [DatePipe, DashboardSidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardPage {
  protected readonly username = inject(UserSession).loginDetails;
  protected readonly dashboardData: DashboardData = {
    currentDate: new Date()
  };
}
