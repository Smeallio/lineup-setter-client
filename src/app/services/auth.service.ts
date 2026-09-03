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

  isLoggedIn = signal<boolean>(!!this.getToken());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.API_URL}/managers/login`, { email, password }).pipe(
      tap((res) => {   
        this.setSession(res.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedIn.set(false);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setSession(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.isLoggedIn.set(true);
  }
}
