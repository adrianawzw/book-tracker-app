import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lista, ListaRequest } from '../models/lista.model';
import { API_BASE_URL } from '../../../core/constants';

@Injectable({
  providedIn: 'root',
})
export class Lists {
  private http = inject(HttpClient);
  private readonly base = `${API_BASE_URL}/api/listas`;

  getByUser(userId: number): Observable<Lista[]> {
    return this.http.get<Lista[]>(`${this.base}/usuario/${userId}`);
  }

  getById(id: number): Observable<Lista> {
    return this.http.get<Lista>(`${this.base}/${id}`);
  }

  create(dto: ListaRequest): Observable<Lista> {
    return this.http.post<Lista>(this.base, dto);
  }

  update(id: number, dto: ListaRequest): Observable<Lista> {
    return this.http.put<Lista>(`${this.base}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
