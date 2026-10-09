import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { UserSession } from './user-session';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should route the root path to the login page', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(router.url).toBe('/login');
    expect(compiled.querySelector('h1')?.textContent).toContain('Log in');
    expect(compiled.querySelector('input[name="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="password"]')).toBeTruthy();
  });

  it('should show signal-based validation errors for incomplete login details', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/login');
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    compiled.querySelector('form')?.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    );
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url).toBe('/login');
    expect(compiled.querySelector('#email-error')?.textContent).toContain('valid email');
    expect(compiled.querySelector('#password-error')?.textContent).toContain('password');
    expect(compiled.querySelector('#age-error')?.textContent).toContain('18 or older');
  });

  it('should navigate after valid login details and age confirmation', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/login');
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const emailInput = compiled.querySelector<HTMLInputElement>('input[name="email"]');
    const passwordInput = compiled.querySelector<HTMLInputElement>('input[name="password"]');
    const ageCheckbox = compiled.querySelector<HTMLInputElement>('input[name="ageConfirmed"]');
    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(ageCheckbox).toBeTruthy();

    if (!emailInput || !passwordInput || !ageCheckbox) {
      throw new Error('Login form controls were not rendered');
    }

    emailInput.value = '  amaithi@example.com  ';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'any-password';
    passwordInput.dispatchEvent(new Event('input'));
    ageCheckbox.checked = true;
    ageCheckbox.dispatchEvent(new Event('change'));
    compiled.querySelector('form')?.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    );
    await fixture.whenStable();

    expect(router.url).toBe('/dashboard');
    expect(TestBed.inject(UserSession).loginDetails()).toEqual({
      email: 'amaithi@example.com',
      ageConfirmed: true
    });
    expect(TestBed.inject(UserSession).loginDetails()).not.toHaveProperty('password');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent)
      .toContain('amaithi@example.com');
  });

  it('should display the username in the centered dashboard with side navigation', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    TestBed.inject(UserSession).loginDetails.set({
      email: 'amaithi@example.com',
      ageConfirmed: true
    });
    await router.navigateByUrl('/dashboard');
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('amaithi@example.com');
    expect(compiled.querySelector('aside nav')).toBeTruthy();
    expect(compiled.querySelector('.dashboard-main')).toBeTruthy();
  });

  it('should show logout below dashboard navigation and return to login when selected', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    TestBed.inject(UserSession).loginDetails.set({
      email: 'amaithi@example.com',
      ageConfirmed: true
    });
    await router.navigateByUrl('/dashboard');
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const sidebar = compiled.querySelector('app-dashboard-sidebar aside.sidebar');
    const navigation = sidebar?.querySelector('nav');
    const logoutLink = navigation?.querySelector<HTMLAnchorElement>('a.logout-link');
    expect(navigation?.children[0].textContent).toContain('Dashboard');
    expect(navigation?.children[1].textContent).toContain('Login details');
    expect(navigation?.children[2].textContent).toContain('Log out');
    expect(logoutLink).toBeTruthy();

    logoutLink?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url).toBe('/login');
    expect(compiled.querySelector('h1')?.textContent).toContain('Log in');
  });
});
