import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ReviewForm } from '../../components/review-form/review-form';
import { ReviewList } from '../../components/review-list/review-list';
import { Books } from '../../services/books';
import { Libro, LibroRequest } from '../../models/libro.model';

@Component({
  selector: 'app-book-detail',
  imports: [ReviewForm, ReviewList],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css',
})
export class BookDetail implements OnInit {
  private booksService = inject(Books);

  @ViewChild(ReviewList)
  reviewList!: ReviewList;

  // Libro recibido desde OpenLibrary
  bookApi = signal<any>(history.state?.book ?? null);

  // Libro guardado en BD
  book = signal<Libro | null>(null);

  loading = signal(false);

  errorMsg = signal('');

  ngOnInit(): void {
        if (!this.bookApi()) {
          this.errorMsg.set('No se encontró la información del libro.');

          return;
        }

        this.guardarLibro();
  }

  guardarLibro(): void {
    this.loading.set(true);
    const dto: LibroRequest = {
      titulo: this.bookApi().title,
      autor: this.bookApi().author_name?.[0] ?? 'Desconocido',
      descripcion: '',
      imagenUrl: this.bookApi().cover_i
        ? `https://covers.openlibrary.org/b/id/${this.bookApi().cover_i}-L.jpg`
        : '',

      apiId: this.bookApi().key,

      fechaPublicacion: this.bookApi().first_publish_year?.toString() ?? '',
      genero: '',
    };

    this.booksService.saveBook(dto).subscribe({
      next: (libro: Libro) => {
        this.book.set(libro);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);

        this.errorMsg.set(err.error?.message ?? 'No se pudo guardar el libro.');

        this.loading.set(false);
      },
    });
  }

  actualizarResenas() {
    this.reviewList.cargarResenas();
  }
}
