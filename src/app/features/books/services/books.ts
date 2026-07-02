import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Libro } from '../../list/models/lista.model';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants';

@Injectable({
  providedIn: 'root'
})
export class Books {

  private http = inject(HttpClient);
  private readonly base = `${API_BASE_URL}/api/libros`;

  searchBooks(query: string) {
    return this.http.get(
      `https://openlibrary.org/search.json?q=${query}`
    );
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

  create(dto: Partial<Libro>): Observable<Libro> {
    return this.http.post<Libro>(this.base, dto);
  }
}
