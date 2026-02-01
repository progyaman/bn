import { Injectable, signal } from '@angular/core';

const AUTH_KEY = 'bn:isLoggedIn';
const USER_KEY = 'bn:username';

@Injectable({ providedIn: 'root' })
export class AuthService {
  userName = signal<string | null>(this.getStorage()?.getItem(USER_KEY) ?? null);

  private getStorage(): Storage | null {
    try {
      if (typeof window === 'undefined') return null;
      return window.sessionStorage;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    try {
      return this.getStorage()?.getItem(AUTH_KEY) === '1';
    } catch {
      return false;
    }
  }

  login(username: string, password: string): boolean {
    const ok = username === 'amir' && password === '123';

    if (!ok) return false;

    try {
      this.getStorage()?.setItem(AUTH_KEY, '1');
      this.getStorage()?.setItem(USER_KEY, username);
      this.userName.set(username);
    } catch {
      // ignore
    }

    return true;
  }

  logout(): void {
    try {
      this.getStorage()?.removeItem(AUTH_KEY);
      this.getStorage()?.removeItem(USER_KEY);
      this.userName.set(null);
    } catch {
      // ignore
    }
  }
}
