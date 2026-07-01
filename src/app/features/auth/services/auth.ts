import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants';

export interface Response {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly _me = signal<Response | null>(null);
  readonly me = this._me.asReadonly();

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** Devuelve el id del usuario autenticado (o null si no hay sesión). */
  currentUserId(): number | null {
    return this._me()?.id ?? null;
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/autenticar`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('refresh_token', res.refresh_token);
        }),
        // tras guardar el token, cargar el usuario antes de navegar
        switchMap(() => this.loadMe())
      );
  }

  loadMe() {
    return this.http
      .get<Response>(`${API_BASE_URL}/api/users/me`)
      .pipe(tap((me) => this._me.set(me)));
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this._me.set(null);
    this.router.navigate(['/login']);
  }
}
