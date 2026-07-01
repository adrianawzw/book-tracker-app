import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Lista } from '../../models/lista.model';
import { Auth } from '../../../auth/services/auth';
import { Lists } from '../../services/lists';

@Component({
  selector: 'app-list-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './list-list.html',
  styleUrl: './list-list.css',
})
export class ListList implements OnInit {
  private listsService = inject(Lists);
  private auth = inject(Auth);
  private router = inject(Router);

  // exponemos el signal del usuario para la plantilla
  readonly me = this.auth.me;

  listas = signal<Lista[]>([]);
  loading = signal(false);
  errorMsg = signal('');

  // estado del modal (campos simples para [(ngModel)])
  showModal = false;
  editing: Lista | null = null;
  nombre = '';
  saving = false;

  ngOnInit(): void {
    const userId = this.auth.currentUserId();
    if (!userId) {
      this.errorMsg.set('Inicia sesión para gestionar tus listas.');
      return;
    }
    this.load(userId);
  }

  private load(userId: number) {
    this.loading.set(true);
    this.errorMsg.set('');
    this.listsService.getByUser(userId).subscribe({
      next: (data) => {
        this.listas.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudieron cargar las listas.');
        this.loading.set(false);
      },
    });
  }

  openCreate() {
    this.editing = null;
    this.nombre = '';
    this.showModal = true;
  }

  openEdit(lista: Lista) {
    this.editing = lista;
    this.nombre = lista.nombre;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editing = null;
    this.nombre = '';
  }

  save() {
    const nombre = this.nombre.trim();
    if (!nombre) return;
    const userId = this.auth.currentUserId();
    if (!userId) {
      this.errorMsg.set('Debes iniciar sesión.');
      return;
    }
    const dto = { nombre, userId };
    this.saving = true;
    const editing = this.editing;
    const req = editing
      ? this.listsService.update(editing.id, dto)
      : this.listsService.create(dto);
    req.subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
        this.load(userId);
      },
      error: () => {
        this.saving = false;
        this.errorMsg.set('Ocurrió un error al guardar la lista.');
      },
    });
  }

  remove(lista: Lista) {
    if (!confirm(`¿Eliminar la lista "${lista.nombre}"?`)) return;
    this.listsService.delete(lista.id).subscribe({
      next: () => {
        const userId = this.auth.currentUserId();
        if (userId) this.load(userId);
      },
      error: () => this.errorMsg.set('No se pudo eliminar la lista.'),
    });
  }

  ver(lista: Lista) {
    this.router.navigate(['/lists', lista.id]);
  }
}
