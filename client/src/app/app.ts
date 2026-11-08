import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import { AuthService } from './auth/auth.service';

interface RouterLogEntry {
  time: string;
  message: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  // Only changes on a full page load (refresh, deep link). Client-side navigation keeps it.
  readonly pageLoadedAt = new Date().toLocaleTimeString();
  readonly routerLog = signal<RouterLogEntry[]>([]);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.addLogEntry(`NavigationStart  ${event.url}  (trigger: ${event.navigationTrigger})`);
      } else if (event instanceof NavigationEnd) {
        this.addLogEntry(`NavigationEnd    ${event.urlAfterRedirects}`);
      } else if (event instanceof NavigationCancel) {
        this.addLogEntry(`NavigationCancel ${event.url}  (a guard redirected)`);
      } else if (event instanceof NavigationError) {
        this.addLogEntry(`NavigationError  ${event.url}`);
      }
    });
  }

  signOut(): void {
    this.auth.signOut();
    this.router.navigateByUrl('/courses');
  }

  private addLogEntry(message: string): void {
    const entry = { time: new Date().toLocaleTimeString(), message };
    this.routerLog.update((entries) => [entry, ...entries].slice(0, 8));
  }
}
