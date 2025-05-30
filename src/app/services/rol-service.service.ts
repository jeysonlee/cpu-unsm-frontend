import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rol } from '../model/rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  //private apiUrl = 'http://localhost:8080/api/roles'; // Usa tu URL real aquí
private apiUrl = 'https://cpu-unsm-app.onrender.com/api/roles'; // Cambia por tu URL real
  constructor(private http: HttpClient) {}

  // Obtener token desde localStorage y agregarlo al header
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener todos los roles
  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  // Crear un nuevo rol
  createRol(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(this.apiUrl, rol, {
      headers: this.getAuthHeaders()
    });
  }

  // Actualizar un rol existente
  updateRol(rol: Rol): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/${rol.id}`, rol, {
      headers: this.getAuthHeaders()
    });
  }

  // Eliminar un rol
  deleteRol(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
