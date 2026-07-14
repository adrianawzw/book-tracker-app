import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../../../core/constants';
import { Observable } from 'rxjs';
import { LibroEnLista, LibroEnListaRequest } from '../models/lista.model';

@Injectable({
  providedIn: 'root',
})
export class LibroEnListaService {
  private http = inject(HttpClient);
  private readonly base = `${API_BASE_URL}/api/libros-lista`;

  getByLista(listaId: number): Observable<LibroEnLista[]> {
    return this.http.get<LibroEnLista[]>(`${this.base}/lista/${listaId}`);
  }

  add(dto: LibroEnListaRequest): Observable<LibroEnLista> {
    return this.http.post<LibroEnLista>(this.base, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
