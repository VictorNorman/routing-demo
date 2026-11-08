import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface SignedInUser {
  name: string;
  role: 'student' | 'admin';
  token: string;
}

const storageKey = 'routing-demo-user';

// Keeps the signed-in user in sessionStorage, so a refresh keeps you signed in.
// Try editing "role" in DevTools > Application > Session Storage: the client-side
// guard believes you, but the server still knows your real role from the token.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  readonly user = signal<SignedInUser | null>(this.readStoredUser());

  isSignedIn(): boolean {
    return this.readStoredUser() !== null;
  }

  isAdmin(): boolean {
    return this.readStoredUser()?.role === 'admin';
  }

  token(): string | null {
    return this.readStoredUser()?.token ?? null;
  }

  signIn(role: 'student' | 'admin'): Observable<SignedInUser> {
    return this.http.post<SignedInUser>('/api/login', { role }).pipe(
      tap((signedInUser) => {
        sessionStorage.setItem(storageKey, JSON.stringify(signedInUser));
        this.user.set(signedInUser);
      }),
    );
  }

  signOut(): void {
    sessionStorage.removeItem(storageKey);
    this.user.set(null);
  }

  // Read from storage every time, so edits made in DevTools take effect.
  private readStoredUser(): SignedInUser | null {
    try {
      const stored = sessionStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as SignedInUser) : null;
    } catch {
      return null;
    }
  }
}
