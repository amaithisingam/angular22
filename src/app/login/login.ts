import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserSession } from '../user-session';
import type { LoginFormData } from './login-form-data';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginPage {
  protected readonly formData = signal<LoginFormData>({
    email: '',
    password: '',
    ageConfirmed: false
  });
  protected readonly submitted = signal(false);

  protected readonly validation = computed(() => {
    const formData = this.formData();
    const email = formData.email.trim();

    return {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? ''
        : 'Enter a valid email address.',
      password: formData.password.length > 0 ? '' : 'Enter your password.',
      age: formData.ageConfirmed ? '' : 'Confirm that you are 18 or older.'
    };
  });

  constructor(
    private readonly router: Router,
    private readonly userSession: UserSession
  ) {}

  protected onSubmit(event: SubmitEvent): Promise<boolean> | void {
    event.preventDefault();

    this.submitted.set(true);
    const validation = this.validation();
    if (validation.email || validation.password || validation.age) {
      return;
    }

    this.userSession.loginDetails.set({
      email: this.formData().email.trim(),
      ageConfirmed: this.formData().ageConfirmed
    });
    return this.router.navigate(['/dashboard']);
  }
}
