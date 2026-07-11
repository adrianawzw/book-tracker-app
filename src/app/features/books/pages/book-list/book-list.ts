import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Books } from '../../services/books';
import { Router } from '@angular/router';
import { Auth } from '../../../auth/services/auth';

@Component({
  selector: 'app-book-list',
  imports: [FormsModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList implements OnInit {

  private router = inject(Router);
  private booksService = inject(Books);
  private auth = inject(Auth);

  query = '';
  books: any[] = [];
  loading = signal(false);
  errorMsg = signal('');

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  ngOnInit(): void {
    this.cargarLibrosPorDefecto();
  }

  cargarLibrosPorDefecto() {
    this.loading.set(true);
    this.errorMsg.set('');

    this.booksService.getDefaultBooks(20).subscribe({
      next: (data) => {
        this.books = data ?? [];
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudieron cargar los libros. Intenta nuevamente.');
        this.loading.set(false);
      },
    });
  }

  search() {
    if (!this.query.trim()) {
      this.cargarLibrosPorDefecto();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    this.booksService.searchBooks(this.query, 20).subscribe({
      next: (data) => {
        this.books = data ?? [];
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Ocurrió un error al buscar libros.');
        this.loading.set(false);
      },
    });
  }

  viewDetail(book: any) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(
      ['/books', book.apiId.replace('/works/', '')],
      { state: { book } }
    );
  }
}