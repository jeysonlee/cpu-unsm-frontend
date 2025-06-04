import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

// Interfaz exacta del JWT decodificado
export interface DecodedToken {
  role: string;
  id: number;
  name: string;
  sub: string;
  permissions: string[]; // ✅ CAMBIADO AQUÍ
  iat: number;
  exp: number;
}


@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth'; // Cambia esto a tu URL de API real
  //private apiUrl = 'https://cpu-unsm-app.onrender.com/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/authenticate`, { username, password });
  }

  verify2fa(username: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-2fa`, { username, code });
  }

  registerPublicUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/public-register`, user);
  }

  setToken(token: string): void {
    if (token && this.isValidJWT(token)) {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    return token && this.isValidJWT(token) ? token : null;
  }

  // ✅ Decodifica y devuelve todo el contenido del token
  decodeToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  // ✅ Extrae los datos del usuario (sin perder estructura del token)
  getUserInfo() {
    const decoded = this.decodeToken();
    return decoded ? {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
      email: decoded.sub,
      permissions: decoded.permissions
    } : null;
  }

  // ✅ Verifica si el token es válido y no ha expirado
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return Date.now() < decoded.exp * 1000;
    } catch {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getUserRole(): string | null {
    const decodedToken = this.decodeToken();
    return decodedToken?.role || null;
  }

  // ✅ Valida si tiene estructura válida un JWT
  private isValidJWT(token: string): boolean {
    return token.includes('.') && token.split('.').length === 3;
  }
requestPasswordReset(email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/forgot-password`, { email });
}

validateResetCode(email: string, code: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/validate-code`, { email, code });
}

updatePassword(email: string, newPassword: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/update-password`, {
    email,
    newPassword
  });
}


}
