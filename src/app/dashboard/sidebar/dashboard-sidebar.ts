import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserSession } from '../../user-session';

@Component({
  selector: 'app-dashboard-sidebar',
  imports: [RouterLink],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.css'
})
export class DashboardSidebar {
  protected readonly loginDetails = inject(UserSession).loginDetails;
  protected readonly detailsExpanded = signal(false);
}
