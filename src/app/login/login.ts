import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserSession } from '../user-session';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginPage {
  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly ageConfirmed = signal(false);
  protected readonly submitted = signal(false);

  protected readonly validation = computed(() => {
    const email = this.email().trim();

    return {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? ''
        : 'Enter a valid email address.',
      password: this.password().length > 0 ? '' : 'Enter your password.',
      age: this.ageConfirmed() ? '' : 'Confirm that you are 18 or older.'
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

    this.userSession.email.set(this.email().trim());
    return this.router.navigate(['/dashboard']);
  }
}
