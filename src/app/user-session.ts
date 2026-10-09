import { Injectable, signal } from '@angular/core';
import type { UserSessionData } from './user-session-data';

@Injectable({ providedIn: 'root' })
export class UserSession {
  readonly loginDetails = signal<UserSessionData | null>(null);
}
