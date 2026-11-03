import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginResponse } from '../models/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private expiryTimer?: ReturnType<typeof setTimeout>;

  isLoggedIn = signal<boolean>(this.hasValidToken());
  sessionExpired = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    if (token && this.isLoggedIn()) {
      this.scheduleSessionExpiry(token);
    }
  }

  signup(name: string, email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/managers`, {
        name,
        email,
        password,
      })
      .pipe(tap((res) => this.setSession(res.token)));
  }

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/managers/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          this.setSession(res.token);
        })
      );
  }

  logout(): void {
    clearTimeout(this.expiryTimer);
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn.set(false);
    this.router.navigate(['/']);
  }

  expireSession(): void {
    if (!this.isLoggedIn()) return;
    this.sessionExpired.set(true);
    this.logout();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setSession(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.sessionExpired.set(false);
    this.isLoggedIn.set(true);
    this.scheduleSessionExpiry(token);
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    if (this.isTokenExpired(token)) {
      localStorage.removeItem(this.TOKEN_KEY);
      return false;
    }
    return true;
  }

  private scheduleSessionExpiry(token: string): void {
    clearTimeout(this.expiryTimer);
    const expiresAt = this.getTokenExpiry(token);
    if (expiresAt === null) return;
    const delay = expiresAt - Date.now();
    if (delay <= 0) {
      this.expireSession();
      return;
    }
    this.expiryTimer = setTimeout(() => this.expireSession(), delay);
  }

  private isTokenExpired(token: string): boolean {
    const expiresAt = this.getTokenExpiry(token);
    return expiresAt !== null && Date.now() >= expiresAt;
  }

  private getTokenExpiry(token: string): number | null {
    try {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      );
      return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }
}
