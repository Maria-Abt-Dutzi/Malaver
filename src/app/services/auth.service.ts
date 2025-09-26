// services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private readonly authTokenKey = 'authToken';
  private readonly username = 'admin';
  private readonly password = 'terciopelo123'; // Cambiar en producción

  // BehaviorSubject para manejar el estado de autenticación
  private authStatusSubject = new BehaviorSubject<boolean>(this.isAuthenticated);
  public authStatus$ = this.authStatusSubject.asObservable();

  constructor(private router: Router) {
    // Verificar si ya está autenticado
    this.isAuthenticated = !!localStorage.getItem(this.authTokenKey);
    this.authStatusSubject.next(this.isAuthenticated);
  }

  login(username: string, password: string): boolean {
    if (username === this.username && password === this.password) {
      const token = btoa(`${username}:${password}`);
      localStorage.setItem(this.authTokenKey, token);
      this.isAuthenticated = true;
      this.authStatusSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    this.isAuthenticated = false;
    this.authStatusSubject.next(false);
    this.router.navigate(['/admin/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getAuthToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }
}
