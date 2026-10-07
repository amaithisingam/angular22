import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DashboardPage } from './dashboard';
import { UserSession } from '../user-session';

describe('DashboardPage', () => {
  async function renderDashboard(username?: string): Promise<HTMLElement> {
    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [provideRouter([])]
    }).compileComponents();

    TestBed.inject(UserSession).email.set(username ?? '');
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('displays the supplied username in the centered welcome panel', async () => {
    const page = await renderDashboard('amaithi@example.com');

    expect(page.querySelector('.dashboard-main .welcome-card h1')?.textContent)
      .toContain('Welcome, amaithi@example.com');
    expect(page.querySelector('.dashboard-main')).toBeTruthy();
  });

  it('shows a friendly fallback when no username is provided', async () => {
    const page = await renderDashboard();

    expect(page.querySelector('#welcome-title')?.textContent).toContain('Welcome, there');
  });

  it('renders dashboard navigation with logout directly below it', async () => {
    const page = await renderDashboard();
    const navigation = page.querySelector('nav[aria-label="Main navigation"]');
    const links = navigation?.querySelectorAll('a');

    expect(links).toHaveLength(2);
    expect(links?.[0].textContent).toContain('Dashboard');
    expect(links?.[0].getAttribute('href')).toBe('/dashboard');
    expect(links?.[1].textContent).toContain('Log out');
    expect(links?.[1].getAttribute('href')).toBe('/login');
  });
});
