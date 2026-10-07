import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserSession } from '../user-session';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardPage {
  protected readonly username = inject(UserSession).email;
}
