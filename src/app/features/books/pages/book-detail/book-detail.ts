import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReviewForm } from '../../components/review-form/review-form';
import { ReviewList } from '../../components/review-list/review-list';
import { Books } from '../../services/books';
import { Libro, LibroRequest } from '../../models/libro.model';
import { Auth } from '../../../auth/services/auth';
import { Lists } from '../../../list/services/lists';
import { LibroEnListaService } from '../../../list/services/libro-en-lista';
import { Lista } from '../../../list/models/lista.model';

@Component({
  selector: 'app-book-detail',
  imports: [ReviewForm, ReviewList, FormsModule, RouterLink],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css',
})
export class BookDetail implements OnInit {
  private booksService = inject(Books);
  private auth = inject(Auth);
  private listsService = inject(Lists);
  private libroEnListaService = inject(LibroEnListaService);

  @ViewChild(ReviewList)
  reviewList!: ReviewList;

  bookApi = signal<any>(history.state?.book ?? null);
  book = signal<Libro | null>(null);

  loading = signal(false);
  errorMsg = signal('');

  misListas = signal<Lista[]>([]);
  listaSeleccionada: number | null = null;
  agregando = signal(false);
  agregadoMsg = signal('');

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
      titulo: this.bookApi().titulo,
      autor: this.bookApi().autor ?? 'Desconocido',
      descripcion: '',
      imagenUrl: this.bookApi().coverUrl ?? '',
      apiId: this.bookApi().apiId,
      fechaPublicacion: this.bookApi().anioPublicacion ?? '',
      genero: '',
    };

    this.booksService.saveBook(dto).subscribe({
      next: (libro: Libro) => {
        this.book.set(libro);
        this.loading.set(false);
        this.cargarMisListas();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg.set(err.error?.message ?? 'No se pudo guardar el libro.');
        this.loading.set(false);
      },
    });
  }

  cargarMisListas(): void {
    const userId = this.auth.currentUserId();
    if (!userId) return;

    this.listsService.getByUser(userId).subscribe({
      next: (listas) => this.misListas.set(listas),
      error: () => { },
    });
  }

  agregarALista(): void {
    const libro = this.book();
    if (!libro || !this.listaSeleccionada) return;

    this.agregando.set(true);
    this.agregadoMsg.set('');

    this.libroEnListaService.add({ libroId: libro.id, listaId: this.listaSeleccionada }).subscribe({
      next: () => {
        this.agregando.set(false);
        this.agregadoMsg.set('¡Libro agregado a la lista!');
      },
      error: () => {
        this.agregando.set(false);
        this.agregadoMsg.set('No se pudo agregar el libro (revisa que no esté ya en esa lista).');
      },
    });
  }

  actualizarResenas() {
    this.reviewList.cargarResenas();
  }
}