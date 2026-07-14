import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorsService } from '../../services/authors.service';
import { Author } from '../../models/author.model';

@Component({
  selector: 'app-author-detail',
  templateUrl: './author-detail.html',
  styleUrl: './author-detail.css',
})
export class AuthorDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authorsService = inject(AuthorsService);

  author: Author | null = null;
  books: any[] = [];
  loading = signal(true);
  errorMsg = signal('');

  ngOnInit(): void {
    // Attempt to get author from router state (if navigated from search)
    if (history.state && history.state.author) {
      this.author = history.state.author;
    }

    this.route.paramMap.subscribe((params) => {
      const key = params.get('key');
      if (key) {
        this.loadAuthorBooks(key);
      }
    });
  }

  loadAuthorBooks(key: string) {
    this.loading.set(true);
    this.authorsService.getAuthorWorks(key, 30).subscribe({
      next: (data) => {
        this.books = data ?? [];
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudieron cargar los libros del autor.');
        this.loading.set(false);
      }
    });
  }

  viewBookDetail(book: any) {
    // If the book has an apiId, navigate to its detail
    if (book.apiId) {
      this.router.navigate(['/books', book.apiId], { state: { book } });
    }
  }

  handleImageError(img: HTMLImageElement, placeholder: HTMLElement) {
    img.style.display = 'none';
    placeholder.style.setProperty('display', 'flex', 'important');
  }

  handleImageLoad(img: HTMLImageElement, placeholder: HTMLElement) {
    // OpenLibrary returns a 1x1 transparent pixel (width=1) instead of 404 sometimes
    if (img.naturalWidth <= 1) {
      this.handleImageError(img, placeholder);
    }
  }
}
