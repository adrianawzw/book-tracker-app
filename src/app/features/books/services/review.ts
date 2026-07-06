import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../../../core/constants';
import { Review, ReviewRequest } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private http = inject(HttpClient);
  private readonly base = `${API_BASE_URL}/api/resenas`;

  create(review: ReviewRequest) {
    return this.http.post<Review>(this.base, review);
  }

  getByBook(libroId: number) {
    return this.http.get<Review[]>(`${this.base}/libro/${libroId}`);
  }

  getByUser(usuarioId: number) {
    return this.http.get<Review[]>(`${this.base}/usuario/${usuarioId}`);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
