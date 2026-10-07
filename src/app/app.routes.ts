import { Routes } from '@angular/router';
import { DashboardPage } from './dashboard/dashboard';
import { LoginPage } from './login/login';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'dashboard', component: DashboardPage },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];
