import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  //private apiUrl = 'http://localhost:8080/auth';
   private apiUrl='https://cpu-unsm-app.onrender.com/auth'; // Actualiza con tu URL base

  constructor(private http: HttpClient) { }

  // Método para obtener el token del localStorage
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Asegúrate de usar la clave correcta para obtener el token
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener la lista de usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders()
    });
  }

  // Registrar un nuevo usuario
  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/register`, usuario, {
      headers: this.getAuthHeaders()
    });
  }

  // Editar un usuario existente
  updateUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/users/${usuario.id}`, usuario, {
      headers: this.getAuthHeaders()
    });
  }

  // Eliminar un usuario
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
