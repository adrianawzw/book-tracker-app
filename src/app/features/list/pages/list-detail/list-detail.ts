import { Component, inject, OnInit, signal } from '@angular/core';
import { Libro, LibroEnLista, Lista } from '../../models/lista.model';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Lists } from '../../services/lists';
import { LibroEnListaService } from '../../services/libro-en-lista';
import { Books } from '../../../books/services/books';
import { forkJoin } from 'rxjs';

interface ListItemViewModel {
  registro: LibroEnLista;
  libro: Libro | null;
}
@Component({
  selector: 'app-list-detail',
  imports: [FormsModule],
  templateUrl: './list-detail.html',
  styleUrl: './list-detail.css',
})
export class ListDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private listsService = inject(Lists);
  private lelService = inject(LibroEnListaService);
  private books = inject(Books);

  listaId = 0;
  lista = signal<Lista | null>(null);
  items = signal<ListItemViewModel[]>([]);
  loading = signal(false);
  errorMsg = signal('');

  query = '';
  resultados: Libro[] = [];
  searching = signal(false);

  ngOnInit(): void {
    this.listaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarLista();
  }

  cargarLista() {
    this.loading.set(true);
    this.listsService.getById(this.listaId).subscribe({
      next: (l) => {
        this.lista.set(l);
        this.loading.set(false);
        this.cargarLibrosDeLista();
      },
      error: () => {
        this.errorMsg.set('No se encontró la lista.');
        this.loading.set(false);
      },
    });
  }

  cargarLibrosDeLista() {
    this.lelService.getByLista(this.listaId).subscribe({
      next: (regs) => {
        if (regs.length === 0) {
          this.items.set([]);
          return;
        }
        // El backend devuelve solo libroId; obtenemos los detalles en paralelo
        forkJoin(regs.map((r) => this.books.getById(r.libroId))).subscribe({
          next: (libros) => this.items.set(regs.map((r, i) => ({ registro: r, libro: libros[i] }))),
          error: () => this.items.set(regs.map((r) => ({ registro: r, libro: null }))),
        });
      },
      error: () => this.errorMsg.set('No se pudieron cargar los libros.'),
    });
  }

  buscar() {
    const q = this.query.trim();
    if (!q) {
      this.resultados = [];
      return;
    }
    this.searching.set(true);
    this.books.searchByTitle(q).subscribe({
      next: (data) => {
        this.resultados = data;
        this.searching.set(false);
      },
      error: () => {
        this.searching.set(false);
        this.errorMsg.set('Error al buscar libros.');
      },
    });
  }

  yaEnLista(libroId: number): boolean {
    return this.items().some((item) => item.registro.libroId === libroId);
  }

  agregar(libro: Libro) {
    if (!this.listaId) return;
    if (this.yaEnLista(libro.id)) return;

    this.lelService.add({ libroId: libro.id, listaId: this.listaId }).subscribe({
      next: () => {
        this.cargarLibrosDeLista();
        this.resultados = this.resultados.filter((r) => r.id !== libro.id);
      },
      error: () =>
        this.errorMsg.set('No se pudo agregar el libro (verifica que exista en el catálogo).'),
    });
  }

  quitar(item: ListItemViewModel) {
    if (!confirm(`¿Quitar "${item.libro?.titulo ?? 'este libro'}" de la lista?`)) return;
    this.lelService.remove(item.registro.id).subscribe({
      next: () => this.cargarLibrosDeLista(),
      error: () => this.errorMsg.set('No se pudo quitar el libro.'),
    });
  }

  volver() {
    this.router.navigate(['/lists']);
  }
}
