import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants';
import { Libro, LibroRequest } from '../models/libro.model';

@Injectable({
  providedIn: 'root',
})
export class Books {
  private http = inject(HttpClient);
  private readonly base = `${API_BASE_URL}/api/libros`;

  // ---- Open Library (a través del backend, no directo desde el navegador) ----
  searchBooks(query: string, limit: number = 20) {
    return this.http.get<any[]>(`${API_BASE_URL}/api/openlibrary/buscar`, {
      params: { titulo: query, limit },
    });
  }

  getDefaultBooks(limit: number = 20) {
    return this.http.get<any[]>(`${API_BASE_URL}/api/openlibrary/populares`, {
      params: { limit },
    });
  }

  // ---- Catálogo local ----
  getAllLocal(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.base);
  }

  searchByTitle(titulo: string): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.base}/buscar/titulo`, { params: { titulo } });
  }

  getById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.base}/${id}`);
  }

  saveBook(dto: LibroRequest): Observable<Libro> {
    return this.http.post<Libro>(this.base, dto);
  }
}