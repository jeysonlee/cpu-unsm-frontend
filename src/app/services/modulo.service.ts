import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Modulo } from '../model/modulo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {
  private apiUrl = 'http://localhost:8080/api/modulos'; // Cambia por tu URL real
  

  constructor(private http: HttpClient) {}

  getModulos(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(this.apiUrl);
  }

  createModulo(modulo: Modulo): Observable<Modulo> {
    return this.http.post<Modulo>(this.apiUrl, modulo);
  }

  updateModulo(modulo: Modulo): Observable<Modulo> {
    return this.http.put<Modulo>(`${this.apiUrl}/${modulo.id}`, modulo);
  }

  deleteModulo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
