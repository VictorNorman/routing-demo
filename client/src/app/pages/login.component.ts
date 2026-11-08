import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <h2>Sign in</h2>
    @if (needs() === 'admin') {
      <p>That page is for admins only.</p>
    }
    @if (returnUrl()) {
      <p class="hint">After signing in you'll go back to <code>{{ returnUrl() }}</code>.</p>
    }
    <div class="buttons">
      <button type="button" (click)="signIn('student')">Sign in as a student</button>
      <button type="button" (click)="signIn('admin')">Sign in as an admin</button>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // Query parameters become inputs too, thanks to withComponentInputBinding().
  readonly returnUrl = input<string>();
  readonly needs = input<string>();

  signIn(role: 'student' | 'admin'): void {
    this.auth.signIn(role).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl() ?? '/courses');
    });
  }
}
