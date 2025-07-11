import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

// Interfaz exacta del JWT decodificado
export interface DecodedToken {
  role: string;
  id: number;
  name: string;
  sub: string;
  permissions: string[];
  iat: number;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  //private apiUrl = 'http://localhost:8080/auth'; // Cambia esto a tu URL de API real
  private apiUrl='https://cpu-unsm-app.onrender.com/auth'

  constructor(private http: HttpClient) {}

  // Verificar si la sesión está activa
isSessionActive(username: string, password: string): Observable<boolean> {
  return this.http.post<boolean>(`${this.apiUrl}/session-active`, {
    username,
    password
  });
}

  // Login
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/authenticate`, { username, password }).pipe(
      catchError(error => {
        console.error('Login failed', error);
        Swal.fire('Error', 'Hubo un problema con la autenticación. Intenta nuevamente.', 'error');
        return of(null); // Manejo de error para notificar al usuario
      })
    );
  }

  // Métodos para manejar el token
  setToken(token: string): void {
    if (token && this.isValidJWT(token)) {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    return token && this.isValidJWT(token) ? token : null;
  }

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
  const token = localStorage.getItem('token');
  if (token && this.isValidJWT(token)) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const username = decoded.sub;

      // Llama al backend para cerrar sesión
      this.http.post(`${this.apiUrl}/logout`, username, {
        headers: { 'Content-Type': 'application/json' }
      }).subscribe({
        next: () => {
          console.log('Sesión cerrada en el backend');
        },
        error: (error) => {
          console.error('Error al cerrar sesión en backend:', error);
        }
      });
    } catch (e) {
      console.error('Error al decodificar el token:', e);
    }
  }

  // Elimina el token local en todos los casos
  localStorage.removeItem('token');
}

  // Valida si tiene estructura válida un JWT
  private isValidJWT(token: string): boolean {
    return token.includes('.') && token.split('.').length === 3;
  }

  // Métodos adicionales para reset de contraseña, 2FA, etc.
  verify2fa(username: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-2fa`, { username, code });
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  validateResetCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate-code`, { email, code });
  }

  updatePassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-password`, { email, newPassword });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }
  registerPublicUser(user: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/public-register`, user);
}
getUserRole(): string | null {
  const decodedToken = this.decodeToken();
  return decodedToken?.role || null;
}
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
loginWithGoogle(idToken: string) {
  return this.http.post<any>('/oauth2/google', { credential: idToken });
}


}
