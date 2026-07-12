import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthorsService } from '../../services/authors.service';
import { Router } from '@angular/router';
import { Auth } from '../../../auth/services/auth';
import { Author } from '../../models/author.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-author-search',
  imports: [FormsModule],
  templateUrl: './author-search.html',
  styleUrl: './author-search.css',
})
export class AuthorSearchComponent implements OnInit {

  private router = inject(Router);
  private authorsService = inject(AuthorsService);
  private auth = inject(Auth);

  query = '';
  authors: Author[] = [];
  loading = signal(false);
  errorMsg = signal('');

  suggestedAuthors: Author[] = [];

  private readonly FAMOUS_AUTHORS: Author[] = [
    { name: 'J.R.R. Tolkien', key: 'OL26320A', workCount: 43, topWork: 'The Lord of the Rings', birthDate: '' },
    { name: 'Stephen King', key: 'OL2162284A', workCount: 158, topWork: 'The Shining', birthDate: '' },
    { name: 'J.K. Rowling', key: 'OL23919A', workCount: 49, topWork: "Harry Potter and the Philosopher's Stone", birthDate: '' },
    { name: 'George R.R. Martin', key: 'OL1351111A', workCount: 50, topWork: 'A Game of Thrones', birthDate: '' },
    { name: 'Gabriel García Márquez', key: 'OL58651A', workCount: 45, topWork: 'Cien años de soledad', birthDate: '' },
    { name: 'Agatha Christie', key: 'OL27695A', workCount: 139, topWork: 'And Then There Were None', birthDate: '' },
    { name: 'Isaac Asimov', key: 'OL34221A', workCount: 200, topWork: 'Foundation', birthDate: '' },
    { name: 'Jane Austen', key: 'OL19371A', workCount: 15, topWork: 'Pride and Prejudice', birthDate: '' }
  ];

  ngOnInit() {
    this.pickRandomSuggestions();
  }

  pickRandomSuggestions() {
    const shuffled = [...this.FAMOUS_AUTHORS].sort(() => 0.5 - Math.random());
    this.suggestedAuthors = shuffled.slice(0, 4);
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  search() {
    if (!this.query.trim()) {
      this.authors = [];
      this.errorMsg.set('');
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');

    this.authorsService.searchAuthors(this.query, 20)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: data => {
          this.authors = data ?? [];
        },
        error: () => {
          this.errorMsg.set('Ocurrió un error al buscar autores.');
        }
      });
  }

  searchSuggested(author: Author) {
    this.query = author.name;
    this.search();
  }

  viewDetail(author: Author) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(
      ['/authors', author.key],
      { state: { author } }
    );
  }
}
