import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/constants';
import { Author } from '../models/author.model';

@Injectable({
  providedIn: 'root',
})
export class AuthorsService {
  private http = inject(HttpClient);

  searchAuthors(query: string, limit: number = 20): Observable<Author[]> {
    return this.http.get<Author[]>(`${API_BASE_URL}/api/openlibrary/autores`, {
      params: { nombre: query, limit },
    });
  }

  getAuthorWorks(key: string, limit: number = 20): Observable<any[]> {
    return this.http.get<any[]>(`${API_BASE_URL}/api/openlibrary/autores/${key}/libros`, {
      params: { limit },
    });
  }
}
