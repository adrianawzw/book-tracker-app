import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Books } from '../../services/books';

@Component({
  selector: 'app-book-list',
  imports: [FormsModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css',
})
export class BookList {

  private booksService = inject(Books);

  query = '';
  books: any[] = [];

  search() {
    if (!this.query.trim()) return;

    this.booksService.searchBooks(this.query)
      .subscribe((response: any) => {
        this.books = response.docs;
      });
  }

}