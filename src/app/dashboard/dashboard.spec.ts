import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardPage } from './dashboard';
import { UserSession } from '../user-session';

describe('DashboardPage', () => {
  async function renderDashboard(email?: string): Promise<ComponentFixture<DashboardPage>> {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [provideRouter([])]
    }).compileComponents();

    TestBed.inject(UserSession).loginDetails.set(
      email ? { email, ageConfirmed: true } : null
    );
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();
    return fixture;
  }

  it('displays the supplied username in the centered welcome panel', async () => {
    const fixture = await renderDashboard('amaithi@example.com');
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('.dashboard-main .welcome-card h1')?.textContent)
      .toContain('Welcome, amaithi@example.com');
    expect(page.querySelector('.dashboard-main')).toBeTruthy();
  });

  it('shows a friendly fallback when no username is provided', async () => {
    const page = (await renderDashboard()).nativeElement as HTMLElement;

    expect(page.querySelector('#welcome-title')?.textContent).toContain('Welcome, there');
  });

  it('displays the current date as typed dashboard data', async () => {
    const page = (await renderDashboard()).nativeElement as HTMLElement;
    const date = page.querySelector('time');

    expect(date).toBeTruthy();
    expect(Number.isNaN(Date.parse(date?.getAttribute('datetime') ?? ''))).toBe(false);
    expect(date?.textContent?.trim()).toBeTruthy();
  });

  it('renders the dashboard and login details menu before logout', async () => {
    const page = (await renderDashboard()).nativeElement as HTMLElement;
    const navigation = page.querySelector('nav[aria-label="Main navigation"]');
    const items = navigation?.children;

    expect(items).toHaveLength(3);
    expect(items?.[0].textContent).toContain('Dashboard');
    expect(items?.[1].textContent).toContain('Login details');
    expect(items?.[2].textContent).toContain('Log out');
    expect(items?.[2].getAttribute('href')).toBe('/login');
  });

  it('expands the login details menu with email and age confirmation', async () => {
    const fixture = await renderDashboard('amaithi@example.com');
    const page = fixture.nativeElement as HTMLElement;
    const detailsButton = page.querySelector<HTMLButtonElement>('.details-toggle');

    expect(detailsButton).toBeTruthy();
    detailsButton?.click();
    fixture.detectChanges();

    const details = page.querySelector('#login-details-panel');
    expect(details?.textContent).toContain('amaithi@example.com');
    expect(details?.textContent).toContain('18 or older confirmed');
    expect(details?.textContent).toContain('Password is not stored');
  });
});
