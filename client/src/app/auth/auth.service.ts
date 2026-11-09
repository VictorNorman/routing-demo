import { Injectable, signal } from '@angular/core';

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

  // A one-time action (not a read), so it's a plain async function rather than a resource.
  async signIn(role: 'student' | 'admin'): Promise<SignedInUser> {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }
    const signedInUser = (await response.json()) as SignedInUser;
    sessionStorage.setItem(storageKey, JSON.stringify(signedInUser));
    this.user.set(signedInUser);
    return signedInUser;
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
