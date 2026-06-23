import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Books {

  private http = inject(HttpClient);

  searchBooks(query: string) {
    return this.http.get(
      `https://openlibrary.org/search.json?q=${query}`
    );
  }
}